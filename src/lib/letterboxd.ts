/**
 * Letterboxd RSS Ingestion Engine for travel.varneet.in
 * Implements resilient build-time caching with 4000ms network timeout.
 * Zero runtime npm dependencies.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export interface LetterboxdFilm {
  id: string;
  title: string;
  year: string;
  rating: string;
  ratingValue: number;
  watchedDate: string;
  link: string;
  poster: string;
  note?: string;
  trailConnection?: string;
}

const CACHE_FILE = resolve(process.cwd(), 'src/data/letterboxdCache.json');

function loadCache(): LetterboxdFilm[] {
  try {
    if (existsSync(CACHE_FILE)) {
      const raw = readFileSync(CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return parsed.films || [];
    }
  } catch (err) {
    console.warn('[letterboxd] Failed reading cache fallback:', err);
  }
  return [];
}

export async function getLetterboxdDiary(username = 'the_musafir_paaji'): Promise<LetterboxdFilm[]> {
  const cachedFilms = loadCache();
  const feedUrl = `https://letterboxd.com/${username}/rss/`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'reKhoj-TravelJournal/2.0 (Build-time RSS engine)'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return cachedFilms;
    }

    const xml = await res.text();
    const items = parseLetterboxdXml(xml);

    if (items.length > 0) {
      // Merge with cache notes
      const merged = items.map((item) => {
        const existing = cachedFilms.find((c) => c.title.toLowerCase() === item.title.toLowerCase());
        return {
          ...item,
          note: existing?.note || item.note,
          trailConnection: existing?.trailConnection || item.trailConnection
        };
      });

      try {
        writeFileSync(CACHE_FILE, JSON.stringify({ username, films: merged }, null, 2), 'utf-8');
      } catch {
        // Safe ignore in read-only environments
      }
      return merged;
    }
  } catch (e) {
    // Graceful offline fallback
  }

  return cachedFilms;
}

function parseLetterboxdXml(xml: string): LetterboxdFilm[] {
  const films: LetterboxdFilm[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const item of itemMatches.slice(0, 8)) {
    const titleMatch = item.match(/<letterboxd:filmTitle>([\s\S]*?)<\/letterboxd:filmTitle>/) || item.match(/<title>([\s\S]*?)<\/title>/);
    const yearMatch = item.match(/<letterboxd:filmYear>([\s\S]*?)<\/letterboxd:filmYear>/);
    const ratingMatch = item.match(/<letterboxd:memberRating>([\s\S]*?)<\/letterboxd:memberRating>/);
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
    const watchedMatch = item.match(/<letterboxd:watchedDate>([\s\S]*?)<\/letterboxd:watchedDate>/) || item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);

    const rawTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : 'Film';
    // Strip trailing year/rating from title if present
    const cleanTitle = rawTitle.replace(/,\s*\d{4}.*$/, '').trim();
    const year = yearMatch ? yearMatch[1].trim() : '';
    const ratingNum = ratingMatch ? parseFloat(ratingMatch[1].trim()) : 4;
    const link = linkMatch ? linkMatch[1].trim() : 'https://letterboxd.com/';
    const watched = watchedMatch ? formatWatchedDate(watchedMatch[1].trim()) : 'Recent';

    // Poster image from CDATA description: <img src="..." />
    let poster = '';
    if (descMatch) {
      const imgMatch = descMatch[1].match(/<img\s+[^>]*src=["']([^"']+)["']/i);
      if (imgMatch) poster = imgMatch[1];
    }

    const stars = '★'.repeat(Math.floor(ratingNum)) + (ratingNum % 1 !== 0 ? '½' : '');

    films.push({
      id: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: cleanTitle,
      year: year || '2024',
      rating: stars || '★★★★☆',
      ratingValue: ratingNum,
      watchedDate: watched,
      link,
      poster: poster || '/images/books/1984.jpg'
    });
  }

  return films;
}

function formatWatchedDate(raw: string): string {
  try {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  } catch {
    // fallback
  }
  return raw.slice(0, 10);
}
