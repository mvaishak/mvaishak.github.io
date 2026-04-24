import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Nav from './components/Nav';

export const metadata = {
  title: 'Vaishak Menon',
  description: 'Machine Learning Engineer & Data Scientist',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen">
        <header className="border-b border-border">
          <Nav />
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
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
