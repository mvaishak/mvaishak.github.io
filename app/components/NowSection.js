import nowData from '../../data/now.json';

function Stars({ rating, max = 5 }) {
  return (
    <span className="font-mono text-[9px] tracking-tighter text-zinc-600">
      {'●'.repeat(rating)}{'○'.repeat(max - rating)}
    </span>
  );
}

function Label({ children }) {
  return (
    <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
      {children}
    </span>
  );
}

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[10px] text-zinc-700 hover:text-zinc-400 no-underline transition-colors"
    >
      {children} ↗
    </a>
  );
}

export default function NowSection() {
  const { film, books, music, gaming, lifestyle } = nowData;

  return (
    <section className="space-y-4">
      <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">now</h2>

      <div className="border border-border divide-y divide-border">

        {/* Film */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label>film</Label>
            <ExternalLink href={film.letterboxd}>letterboxd</ExternalLink>
          </div>
          <div className="space-y-2">
            {film.recentlyWatched.map((f) => (
              <div key={f.title} className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-zinc-400 truncate leading-snug">{f.title}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono text-[10px] text-zinc-700">{f.year}</span>
                  {f.rating && <Stars rating={f.rating} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label>reading</Label>
            <ExternalLink href={books.goodreads}>goodreads</ExternalLink>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-white leading-snug">{books.currentlyReading.title}</p>
              <p className="font-mono text-[10px] text-zinc-600 mt-0.5">{books.currentlyReading.author}</p>
            </div>
            <div className="space-y-1 pt-0.5 border-t border-border">
              {books.recentlyFinished.map((b) => (
                <p key={b.title} className="text-[11px] text-zinc-600 truncate">{b.title}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Music */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label>music</Label>
            <ExternalLink href={music.lastfm}>last.fm</ExternalLink>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1.5">
            {music.recentArtists.map((artist) => (
              <span key={artist} className="text-xs text-zinc-400">{artist}</span>
            ))}
          </div>
        </div>

        {/* Playing */}
        <div className="p-4 space-y-3">
          <Label>playing</Label>
          <div>
            <p className="text-xs text-white leading-snug">{gaming.currentlyPlaying.title}</p>
            <p className="font-mono text-[10px] text-zinc-600 mt-0.5">
              {gaming.currentlyPlaying.platform} · {gaming.currentlyPlaying.status}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 pt-0.5 border-t border-border">
            {lifestyle.activities.map((act) => (
              <span key={act} className="text-[11px] text-white">{act}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
