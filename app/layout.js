import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Vaishak Menon',
  description: 'Machine Learning Engineer & Data Scientist',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen">
        <header className="border-b border-border">
          <nav className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link
              href="/"
              className="font-mono text-sm text-white no-underline hover:underline decoration-1 underline-offset-4 transition-none"
            >
              vaishak menon
            </Link>
            <div className="flex items-center gap-8">
              {[
                { href: '/resume', label: 'resume' },
                { href: '/contact', label: 'contact' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-20">
          {children}
        </main>

        <footer className="border-t border-border mt-20">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <p className="font-mono text-xs text-zinc-600">
              © {new Date().getFullYear()} vaishak menon
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
