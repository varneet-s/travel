import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export interface GoodreadsBook {
  title: string;
  author: string;
  bookId: string;
  link: string;
  cover: string;
  rating: number;
  readAt: string;
  shelf: 'currently-reading' | 'read';
  shelves: string[];
  numPages?: number;
  description: string;
  note?: string;
  trailConnection?: string;
  progress?: string;
  percent?: number;
  tag?: string;
}

export interface GoodreadsLibrary {
  currentlyReading: GoodreadsBook[];
  readBooks: GoodreadsBook[];
  totalReadCount: number;
}

export interface GetGoodreadsLibraryOptions {
  currentlyReadingFeedUrl?: string;
  readFeedUrl?: string;
  cacheFilePath?: string;
  timeoutMs?: number;
}

function getDefaultCacheFile(): string {
  const cwdPath = resolve(process.cwd(), 'src/data/goodreadsCache.json');
  if (existsSync(cwdPath)) {
    return cwdPath;
  }
  try {
    const metaPath = fileURLToPath(new URL('../data/goodreadsCache.json', import.meta.url));
    if (existsSync(metaPath)) {
      return metaPath;
    }
  } catch {}
  return cwdPath;
}

const CURRENTLY_READING_URL = 'https://www.goodreads.com/review/list_rss/202026328?shelf=currently-reading';
const READ_URL = 'https://www.goodreads.com/review/list_rss/202026328?shelf=read';
const DEFAULT_TIMEOUT_MS = 4000;

/**
 * Authentic trail notes and field connections for currently reading books.
 */
interface TrailEnrichment {
  note: string;
  trailConnection: string;
  progress: string;
  percent: number;
  tag: string;
}

const TRAIL_NOTES: Record<string, TrailEnrichment> = {
  '1984': {
    note: 'Reading for the 2nd time. An enduring examination of surveillance, language, and memory.',
    trailConnection: '📍 Carried on the Parvati Valley trail · Read on a wooden balcony in Chalal overlooking the rushing river.',
    progress: 'Page 47 of 304 · 15%',
    percent: 15,
    tag: 'Classic · Dystopia · Philosophy'
  },
  'men-without-women': {
    note: 'Short stories on solitude, longing, quiet estrangement, and what remains behind.',
    trailConnection: '📍 Read beside the cold green pools of the Tirthan river in Gushaini on a quiet afternoon.',
    progress: 'Page 55 of 228 · 24%',
    percent: 24,
    tag: 'Literary · Contemporary Fiction'
  },
  'what-i-talk-about-when-i-talk-about-running': {
    note: 'Memoir on daily distance running, physical endurance, routine, and the craft of writing.',
    trailConnection: '📍 Read on the 8-hour ordinary HRTC bus through the Sutlej river gorge en route to Spiti.',
    progress: 'Page 81 of 180 · 45%',
    percent: 45,
    tag: 'Memoir · Non-fiction · Discipline'
  },
  'start-with-why': {
    note: 'Framework on purpose, authentic leadership, and intentional work while navigating remote mountain hostels.',
    trailConnection: '📍 Read under deodar pines at a quiet cafe in Dharamkot during monsoon work hours.',
    progress: 'Page 62 of 256 · 24%',
    percent: 24,
    tag: 'Leadership · Purpose · Mindset'
  }
};

/**
 * Local high-resolution book cover assets in /images/books/
 */
const LOCAL_BOOK_COVERS: Record<string, string> = {
  '230149114': '/images/books/1984.jpg',
  '1984': '/images/books/1984.jpg',
  '36114337': '/images/books/men-without-women.jpg',
  'men-without-women': '/images/books/men-without-women.jpg',
  '57025000': '/images/books/running-murakami.jpg',
  'running-murakami': '/images/books/running-murakami.jpg',
  'what-i-talk-about-when-i-talk-about-running': '/images/books/running-murakami.jpg'
};

function normalizeSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

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
 * Parses a Goodreads RSS feed XML string into typed GoodreadsBook objects.
 */
export function parseGoodreadsXml(xml: string, shelf: 'currently-reading' | 'read'): GoodreadsBook[] {
  const items: GoodreadsBook[] = [];
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];

  for (const block of itemBlocks) {
    const title = extractCdataOrText(block, 'title') || 'Untitled Book';
    const author = extractCdataOrText(block, 'author_name') || 'Unknown Author';
    const bookId = extractCdataOrText(block, 'book_id') || '';
    const link = bookId
      ? `https://www.goodreads.com/book/show/${bookId}`
      : (extractCdataOrText(block, 'link') || 'https://www.goodreads.com');

    // Prefer book_large_image_url || book_medium_image_url || book_image_url
    const largeImg = extractCdataOrText(block, 'book_large_image_url');
    const mediumImg = extractCdataOrText(block, 'book_medium_image_url');
    const smallImg = extractCdataOrText(block, 'book_image_url');
    let cover = largeImg || mediumImg || smallImg || '';

    // Enrich with local high-res assets in /images/books/ if available
    const titleSlug = normalizeSlug(title);
    if (LOCAL_BOOK_COVERS[bookId] || LOCAL_BOOK_COVERS[titleSlug]) {
      cover = LOCAL_BOOK_COVERS[bookId] || LOCAL_BOOK_COVERS[titleSlug];
    }

    const ratingRaw = extractCdataOrText(block, 'user_rating');
    const rating = parseInt(ratingRaw || '0', 10) || 0;

    const rawReadAt = extractCdataOrText(block, 'user_read_at');
    let readAt = '';
    if (rawReadAt) {
      const parsedDate = new Date(rawReadAt);
      if (!isNaN(parsedDate.getTime())) {
        readAt = parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
    }

    const rawShelves = extractCdataOrText(block, 'user_shelves');
    const shelves = rawShelves
      ? rawShelves.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const rawPages = extractCdataOrText(block, 'num_pages');
    const numPages = rawPages ? parseInt(rawPages, 10) : undefined;

    let description = extractCdataOrText(block, 'book_description');
    if (!description) {
      description = extractCdataOrText(block, 'description');
    }
    description = description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    const book: GoodreadsBook = {
      title,
      author,
      bookId,
      link,
      cover,
      rating,
      readAt,
      shelf,
      shelves,
      ...(numPages !== undefined ? { numPages } : {}),
      description
    };

    // Enrich currently-reading books with authentic trail notes
    if (shelf === 'currently-reading') {
      let enriched = TRAIL_NOTES[titleSlug];
      if (!enriched) {
        if (title.toLowerCase().includes('1984')) enriched = TRAIL_NOTES['1984'];
        else if (title.toLowerCase().includes('men without women')) enriched = TRAIL_NOTES['men-without-women'];
        else if (title.toLowerCase().includes('running')) enriched = TRAIL_NOTES['what-i-talk-about-when-i-talk-about-running'];
        else if (title.toLowerCase().includes('start with why')) enriched = TRAIL_NOTES['start-with-why'];
      }
      if (enriched) {
        book.note = enriched.note;
        book.trailConnection = enriched.trailConnection;
        book.progress = enriched.progress;
        book.percent = enriched.percent;
        book.tag = enriched.tag;
      }
    }

    items.push(book);
  }

  return items;
}

/**
 * Fetches a single Goodreads RSS feed with strict timeout.
 */
async function fetchGoodreadsFeed(
  url: string,
  shelf: 'currently-reading' | 'read',
  timeoutMs: number
): Promise<GoodreadsBook[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Astro-Build-Pipeline/reKhoj-Travel (travel.varneet.in)'
      },
      signal: controller.signal
    });

    if (response.ok) {
      const xml = await response.text();
      return parseGoodreadsXml(xml, shelf);
    } else {
      console.warn(`[Goodreads RSS] Feed for ${shelf} returned HTTP ${response.status}`);
      return [];
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches and synchronizes authentic Goodreads library data at build time.
 * - Attempts live network fetch with 4000ms timeout for currently-reading and read shelves.
 * - Writes fresh data to src/data/goodreadsCache.json.
 * - Falls back seamlessly to offline cache if network is unreachable or times out.
 */
export async function getGoodreadsLibrary(
  options: GetGoodreadsLibraryOptions = {}
): Promise<GoodreadsLibrary> {
  const crUrl = options.currentlyReadingFeedUrl || CURRENTLY_READING_URL;
  const readUrl = options.readFeedUrl || READ_URL;
  const cacheFile = options.cacheFilePath || getDefaultCacheFile();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  let currentlyReading: GoodreadsBook[] = [];
  let readBooks: GoodreadsBook[] = [];

  // 1. Attempt live network fetch
  try {
    const [crResult, readResult] = await Promise.allSettled([
      fetchGoodreadsFeed(crUrl, 'currently-reading', timeoutMs),
      fetchGoodreadsFeed(readUrl, 'read', timeoutMs)
    ]);

    if (crResult.status === 'fulfilled' && crResult.value.length > 0) {
      currentlyReading = crResult.value;
    }
    if (readResult.status === 'fulfilled' && readResult.value.length > 0) {
      readBooks = readResult.value;
    }

    if (currentlyReading.length > 0 || readBooks.length > 0) {
      const libraryPayload: GoodreadsLibrary = {
        currentlyReading,
        readBooks,
        totalReadCount: readBooks.length
      };

      try {
        writeFileSync(cacheFile, JSON.stringify(libraryPayload, null, 2), 'utf-8');
      } catch (writeErr) {
        console.warn(`[Goodreads RSS] Failed to write cache: ${writeErr}`);
      }

      return libraryPayload;
    }
  } catch (err) {
    console.warn(`[Goodreads RSS] Live fetch failed or timed out (${err}). Falling back to cache...`);
  }

  // 2. Offline fallback to local cache
  if (existsSync(cacheFile)) {
    try {
      const cachedContent = readFileSync(cacheFile, 'utf-8');
      const cachedData = JSON.parse(cachedContent);
      if (cachedData && (Array.isArray(cachedData.currentlyReading) || Array.isArray(cachedData.readBooks))) {
        return {
          currentlyReading: Array.isArray(cachedData.currentlyReading) ? cachedData.currentlyReading : [],
          readBooks: Array.isArray(cachedData.readBooks) ? cachedData.readBooks : [],
          totalReadCount: cachedData.totalReadCount ?? (cachedData.readBooks?.length || 0)
        };
      }
    } catch (readErr) {
      console.warn(`[Goodreads RSS] Failed to read cache: ${readErr}`);
    }
  }

  return {
    currentlyReading: [],
    readBooks: [],
    totalReadCount: 0
  };
}
