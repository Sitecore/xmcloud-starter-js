import { Figtree, Montserrat } from 'next/font/google';
import './globals.css';

const sansFont = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-wl-sans',
  display: 'swap',
});

const footerFont = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-wl-footer',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${footerFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://edge-platform.sitecorecloud.io" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
