import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export const metadata = {
  title: 'Writing — Vaishak Menon',
};

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-[-0.05em] lowercase">writing</h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
          technical writing on ml systems, recommender systems, and generative ai.
        </p>
      </section>

      <section className="space-y-0">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="no-underline block border-b border-border py-6 group"
          >
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="text-sm font-medium group-hover:underline decoration-1 underline-offset-4 transition-none leading-snug">
                {post.title}
              </h2>
              <span className="font-mono text-xs text-zinc-500 shrink-0">{post.date}</span>
            </div>
            {post.excerpt && (
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed max-w-lg">
                {post.excerpt}
              </p>
            )}
          </Link>
        ))}
      </section>
    </div>
  );
}
