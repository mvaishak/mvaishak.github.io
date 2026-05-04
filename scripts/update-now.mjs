#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NOW_PATH = path.join(__dirname, '../data/now.json');

const UA = 'Mozilla/5.0 (compatible; personal-site-bot/1.0; +https://github.com/mvaishak)';

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cdata(s) {
  return decodeEntities(s.replace(/<!\[CDATA\[|\]\]>/g, '').trim());
}

function tag(text, name) {
  const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'g');
  const hits = [];
  let m;
  while ((m = re.exec(text)) !== null) hits.push(cdata(m[1]));
  return hits;
}

function first(text, name) {
  return tag(text, name)[0] ?? null;
}

function items(xml) {
  return xml.split(/<item[\s>]/).slice(1);
}

// --- Letterboxd ---------------------------------------------------------
async function fetchFilms() {
  const xml = await get('https://letterboxd.com/vaishakmelon/rss/');
  return items(xml).slice(0, 5).flatMap((item) => {
    const title  = first(item, 'letterboxd:filmTitle');
    const year   = first(item, 'letterboxd:filmYear');
    const rating = first(item, 'letterboxd:memberRating');
    if (!title) return [];
    return [{ title, year: parseInt(year) || null, rating: rating ? Math.round(parseFloat(rating)) : null }];
  });
}

// --- Last.fm via xiffy --------------------------------------------------
async function fetchArtists() {
  const xml = await get('https://lfm.xiffy.nl/m_vaishak/toptracks');
  const seen = new Set();
  const artists = [];
  for (const item of items(xml)) {
    const artist = first(item, 'lfm:artist');
    if (artist && !seen.has(artist)) {
      seen.add(artist);
      artists.push(artist);
    }
    if (artists.length >= 6) break;
  }
  return artists;
}

// --- Goodreads ----------------------------------------------------------
async function fetchBooks() {
  const xml = await get('https://www.goodreads.com/user/updates_rss/71907939-vaishak');
  let currentlyReading = null;
  const recentlyFinished = [];

  for (const item of items(xml)) {
    const title = cdata(first(item, 'title') ?? '');
    // title patterns: "Vaishak is currently reading 'Book'" / "Vaishak has read 'Book'"
    const bookMatch = title.match(/'(.*)'/);
    if (!bookMatch) continue;
    const bookTitle = bookMatch[1];

    // author is in the description — strip HTML and find "by <name>"
    const desc = cdata(first(item, 'description') ?? '').replace(/<[^>]+>/g, ' ');
    const authorMatch = desc.match(/\bby\s+([^,\n<]+)/i);
    const author = authorMatch?.[1]?.trim() ?? '';

    if (title.includes('currently reading') && !currentlyReading) {
      currentlyReading = { title: bookTitle, author };
    } else if ((title.includes('has read') || title.includes('marked as read')) && recentlyFinished.length < 2) {
      recentlyFinished.push({ title: bookTitle, author });
    }
  }

  return { currentlyReading, recentlyFinished };
}

// --- Main ---------------------------------------------------------------
let now;
try {
  now = JSON.parse(fs.readFileSync(NOW_PATH, 'utf8'));
} catch (err) {
  now = { film: {}, music: {}, books: {} };
}

const results = await Promise.allSettled([fetchFilms(), fetchArtists(), fetchBooks()]);

const [filmsResult, artistsResult, booksResult] = results;

if (filmsResult.status === 'fulfilled' && filmsResult.value.length > 0) {
  now.film.recentlyWatched = filmsResult.value;
  console.log(`✓ Letterboxd: ${filmsResult.value.length} films`);
} else {
  console.warn(`✗ Letterboxd: ${filmsResult.reason?.message ?? 'no data'}`);
}

if (artistsResult.status === 'fulfilled' && artistsResult.value.length > 0) {
  now.music.recentArtists = artistsResult.value;
  console.log(`✓ Last.fm: ${artistsResult.value.length} artists`);
} else {
  console.warn(`✗ Last.fm: ${artistsResult.reason?.message ?? 'no data'}`);
}

if (booksResult.status === 'fulfilled') {
  const { currentlyReading, recentlyFinished } = booksResult.value;
  if (currentlyReading) {
    now.books.currentlyReading = currentlyReading;
    console.log(`✓ Goodreads: currently reading "${currentlyReading.title}"`);
  }
  if (recentlyFinished.length > 0) {
    now.books.recentlyFinished = recentlyFinished;
  }
  if (!currentlyReading && recentlyFinished.length === 0) {
    console.warn('✗ Goodreads: no readable items found');
  }
} else {
  console.warn(`✗ Goodreads: ${booksResult.reason?.message ?? 'no data'}`);
}

fs.writeFileSync(NOW_PATH, JSON.stringify(now, null, 2) + '\n');
console.log('now.json written.');
