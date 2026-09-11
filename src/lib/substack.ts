import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface SubstackPost {
  title: string;
  link: string;
  pubDate: string;        // Formatted display date (e.g., "Sep 10, 2026")
  isoDate: string;        // ISO 8601 string (e.g., "2026-09-10T12:00:00.000Z")
  description: string;    // Sanitized, plain-text summary (max 160 chars)
  author: string;         // Author name ("Varneet Singh")
  enclosureUrl?: string;  // Optional banner image URL
}

export interface GetSubstackArticlesOptions {
  feedUrl?: string;
  cacheFilePath?: string;
  timeoutMs?: number;
}

const FEED_URL = 'https://rekhoj.substack.com/feed';
const DEFAULT_CACHE_FILE = fileURLToPath(new URL('../data/substackCache.json', import.meta.url));
const DEFAULT_TIMEOUT_MS = 4000;

/**
 * Decodes XML / HTML entities into raw Unicode characters.
 */
export function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => {
      try {
        return String.fromCharCode(Number(code));
      } catch {
        return '';
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return '';
      }
    });
}

/**
 * Extracts inner content from a specified XML tag, preferring CDATA sections if present.
 */
export function extractCdataOrText(xmlSnippet: string, tagName: string): string {
  const escapedTag = tagName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const cdataRegex = new RegExp(`<${escapedTag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${escapedTag}>`, 'i');
  const plainRegex = new RegExp(`<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`, 'i');

  const cdataMatch = xmlSnippet.match(cdataRegex);
  if (cdataMatch) {
    return decodeXmlEntities(cdataMatch[1].trim());
  }

  const plainMatch = xmlSnippet.match(plainRegex);
  if (plainMatch) {
    const innerCdata = plainMatch[1].match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
    if (innerCdata) {
      return decodeXmlEntities(innerCdata[1].trim());
    }
    return decodeXmlEntities(plainMatch[1].replace(/<[^>]+>/g, '').trim());
  }

  return '';
}

/**
 * Robust zero-dependency RSS 2.0 XML parser for Substack publication feeds.
 */
export function parseRssXml(xml: string): SubstackPost[] {
  const items: SubstackPost[] = [];
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];

  for (const block of itemBlocks) {
    const title = extractCdataOrText(block, 'title') || 'Field Dispatch';

    let link = extractCdataOrText(block, 'link');
    if (!link) {
      const guid = extractCdataOrText(block, 'guid');
      if (guid && guid.startsWith('http')) {
        link = guid;
      }
    }
    if (link.startsWith('http://rekhoj.substack.com')) {
      link = link.replace('http://', 'https://');
    }
    // Strict URL validation: must point to https://rekhoj.substack.com
    if (!link || !link.startsWith('https://rekhoj.substack.com')) {
      link = 'https://rekhoj.substack.com';
    }

    const rawPubDate = extractCdataOrText(block, 'pubDate');
    let pubDate = rawPubDate;
    let isoDate = '';
    if (rawPubDate) {
      const parsedDate = new Date(rawPubDate);
      if (!isNaN(parsedDate.getTime())) {
        isoDate = parsedDate.toISOString();
        pubDate = parsedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }

    let description = extractCdataOrText(block, 'description');
    if (!description) {
      description = extractCdataOrText(block, 'content:encoded');
    }
    description = description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (description.length > 160) {
      description = description.slice(0, 157) + '...';
    }

    const author = extractCdataOrText(block, 'dc:creator') || extractCdataOrText(block, 'author') || 'Varneet Singh';

    const enclosureMatch = block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*>/i);
    const enclosureUrl = enclosureMatch ? enclosureMatch[1].trim() : undefined;

    items.push({
      title,
      link,
      pubDate,
      isoDate,
      description,
      author,
      ...(enclosureUrl ? { enclosureUrl } : {})
    });
  }

  return items;
}

/**
 * Fetches and synchronizes authentic Substack dispatches at build time.
 * - Attempts live network fetch with 4s timeout.
 * - If live fetch returns posts, updates repository cache (src/data/substackCache.json).
 * - If network is unreachable or times out, falls back cleanly to cached articles.
 * - Strict Content Integrity: Returns empty array [] if 0 posts exist (never injects synthetic content).
 */
export async function getSubstackArticles(options: GetSubstackArticlesOptions = {}): Promise<SubstackPost[]> {
  const feedUrl = options.feedUrl || FEED_URL;
  const cacheFile = options.cacheFilePath || DEFAULT_CACHE_FILE;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  // 1. Attempt live network fetch with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'Astro-Build-Pipeline/reKhoj-Travel (travel.varneet.in)'
        },
        signal: controller.signal
      });

      if (response.ok) {
        const xml = await response.text();
        const liveArticles = parseRssXml(xml);

        if (liveArticles.length > 0) {
          try {
            writeFileSync(cacheFile, JSON.stringify(liveArticles, null, 2), 'utf-8');
          } catch (writeErr) {
            console.warn(`[reKhoj RSS] Failed to write cache: ${writeErr}`);
          }
          return liveArticles;
        }
      } else {
        console.warn(`[reKhoj RSS] Feed returned HTTP ${response.status}. Checking cache...`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (err) {
    console.warn(`[reKhoj RSS] Live feed fetch failed or timed out (${err}). Checking cache...`);
  }

  // 2. Offline fallback to local repository cache
  if (existsSync(cacheFile)) {
    try {
      const cachedContent = readFileSync(cacheFile, 'utf-8');
      const cachedArticles = JSON.parse(cachedContent);
      if (Array.isArray(cachedArticles) && cachedArticles.length > 0) {
        return cachedArticles;
      }
    } catch (readErr) {
      console.warn(`[reKhoj RSS] Failed to read cache: ${readErr}`);
    }
  }

  // 3. Authentic Empty State (Strictly ZERO dummy/synthetic articles)
  return [];
}
