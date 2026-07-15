import Link from 'next/link';
import { Metadata } from 'next';
import { ErrorPage, getCachedPageParams } from '@sitecore-content-sdk/nextjs';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';

// Prevent search engines from indexing 404 pages
export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Nested 404 page with site/locale context
 * Used when URL has site/locale segments
 */
export default async function NotFound() {
  const { site, locale } = getCachedPageParams();

  // Fetch Sitecore 404 page for the resolved site/locale
  try {
    const page = await client.getErrorPage(ErrorPage.NotFound, {
      site: site || scConfig.defaultSite,
      locale: locale || scConfig.defaultLanguage,
    });

    if (page) {
      return (
        <NextIntlClientProvider>
          <Providers page={page}>
            <Layout page={page} />
          </Providers>
        </NextIntlClientProvider>
      );
    }
  } catch (error) {
    console.error('Error fetching 404 page:', error);
  }

  // Fallback UI when Sitecore page not available
  return (
    <div style={{ padding: 10 }}>
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link href="/">Go to the Home page</Link>
    </div>
  );
}
