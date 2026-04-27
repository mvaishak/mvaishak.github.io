import nowData from '../../data/now.json';

function Stars({ rating, max = 5 }) {
  return (
    <span className="font-mono text-[9px] tracking-tighter text-zinc-600">
      {'●'.repeat(rating)}{'○'.repeat(max - rating)}
    </span>
  );
}

function Card({ label, href, linkLabel, children }) {
  return (
    <div className="w-48 shrink-0 border border-border p-3 space-y-2.5 snap-start">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">{label}</span>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-zinc-700 hover:text-zinc-400 no-underline"
          >
            {linkLabel} ↗
          </a>
        )}
      </div>
      {children}
    </div>
  );
}

export default function NowMobile() {
  const { film, books, music, gaming, lifestyle } = nowData;

  return (
    <section className="space-y-3 lg:hidden">
      <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">now</h2>

      {/* Bleed to page edges, snap-scroll between cards */}
      <div className="overflow-x-auto scrollbar-none -mx-6 px-6">
        <div className="flex gap-3 pb-1 snap-x snap-mandatory" style={{ width: 'max-content' }}>

          {/* Film */}
          <Card label="film" href={film.letterboxd} linkLabel="lbxd">
            <div className="space-y-1.5">
              {film.recentlyWatched.map((f) => (
                <div key={f.title} className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] text-zinc-400 truncate max-w-[100px] leading-snug">{f.title}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-mono text-[9px] text-zinc-700">{f.year}</span>
                    {f.rating && <Stars rating={f.rating} />}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Reading */}
          <Card label="reading" href={books.goodreads} linkLabel="gr">
            <div className="space-y-2">
              <div>
                <p className="text-[11px] text-white leading-snug">{books.currentlyReading.title}</p>
                <p className="font-mono text-[9px] text-zinc-600 mt-0.5">{books.currentlyReading.author}</p>
              </div>
              <div className="border-t border-border pt-1.5 space-y-1">
                {books.recentlyFinished.map((b) => (
                  <p key={b.title} className="text-[10px] text-zinc-600 truncate">{b.title}</p>
                ))}
              </div>
            </div>
          </Card>

          {/* Music */}
          <Card label="music" href={music.lastfm} linkLabel="lfm">
            <div className="flex flex-wrap gap-x-2 gap-y-1.5">
              {music.recentArtists.map((artist) => (
                <span key={artist} className="text-[11px] text-zinc-400">{artist}</span>
              ))}
            </div>
          </Card>

          {/* Playing */}
          <Card label="playing">
            <div className="space-y-2">
              <div>
                <p className="text-[11px] text-white leading-snug">{gaming.currentlyPlaying.title}</p>
                <p className="font-mono text-[9px] text-zinc-600 mt-0.5">
                  {gaming.currentlyPlaying.platform} · {gaming.currentlyPlaying.status}
                </p>
              </div>
              <div className="border-t border-border pt-1.5 flex flex-wrap gap-x-1.5 gap-y-1">
                {lifestyle.activities.map((act) => (
                  <span key={act} className="text-[10px] text-white">{act}</span>
                ))}
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
