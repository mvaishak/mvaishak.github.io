import resumeData from '../../data/resume.json';

export const metadata = {
  title: 'Contact — Vaishak Menon',
};

export default function ContactPage() {
  const { personal } = resumeData;

  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-[-0.05em] lowercase">contact</h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
          open to research collaborations, ml engineering roles, and interesting problems.
        </p>
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">direct</p>
          <a
            href={`mailto:${personal.email}`}
            className="text-sm no-underline hover:underline decoration-1 underline-offset-4 transition-none"
          >
            {personal.email}
          </a>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">elsewhere</p>
          <div className="flex flex-col gap-2">
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
            >
              linkedin →
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
            >
              github →
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-1">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">message</p>
          <p className="text-xs text-zinc-600">or send a message directly</p>
        </div>

        <form
          action="https://formspree.io/f/placeholder"
          method="POST"
          className="space-y-5 max-w-md"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="font-mono text-xs text-zinc-500 block">
              name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full bg-transparent border border-border px-3 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-none"
              placeholder="your name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="font-mono text-xs text-zinc-500 block">
              email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-transparent border border-border px-3 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="font-mono text-xs text-zinc-500 block">
              message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full bg-transparent border border-border px-3 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-none resize-none"
              placeholder="what's on your mind?"
            />
          </div>

          <button
            type="submit"
            className="font-mono text-xs text-zinc-400 border border-border px-4 py-2 hover:text-white hover:border-zinc-500 transition-none cursor-pointer bg-transparent"
          >
            send message
          </button>
        </form>
      </section>
    </div>
  );
}
