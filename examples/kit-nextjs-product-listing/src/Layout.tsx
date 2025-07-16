/**
 * This Layout is needed for Starter Kit.
 */
import React, { type JSX } from 'react';
import Head from 'next/head';
import { Placeholder, Field, DesignLibrary, ImageField, Page } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider/theme-provider.dev';
import { VideoProvider } from './contexts/VideoContext';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const heading = localFont({
  src: [
    {
      path: './assets/fonts/Boldonse-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-heading',
  display: 'swap',
});

const body = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const accent = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  variable: '--font-accent',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

// tailwindcss-safelist
// !py-4
// !pt-0
// !py-0
// bg-muted
// bg-black
// bg-gradient
// bg-gradient-secondary
// text-primary
// multipromo-1_1
// multipromo-2_3
// multipromo-3_2

import SitecoreStyles from 'components/content-sdk/SitecoreStyles';

interface LayoutProps {
  page: Page;
}

interface RouteFields {
  [key: string]: unknown;
  metadataTitle?: Field;
  metadataKeywords?: Field;
  pageTitle?: Field;
  metadataDescription?: Field;
  pageSummary?: Field;
  ogTitle?: Field;
  ogDescription?: Field;
  ogImage?: ImageField;
  thumbnailImage?: ImageField;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout } = page;
  const { route } = layout.sitecore;
  const fields = route?.fields as RouteFields;
  const { isEditing } = page.mode;
  const isPartialDesignEditing = route?.templateName === 'Partial Design';
  const mainClassPartialDesignEditing = isPartialDesignEditing ? 'partial-editing-mode' : '';
  const mainClassPageEditing = isEditing ? 'editing-mode' : 'prod-mode';
  const classNamesMain = `${mainClassPageEditing} ${mainClassPartialDesignEditing} ${accent.variable} ${body.variable} ${heading.variable} main-layout`;

  const metaTitle =
    fields?.metadataTitle?.value?.toString() || fields?.pageTitle?.value?.toString() || 'Page';
  const metaDescription =
    fields?.metadataDescription?.value?.toString() || fields?.pageSummary?.value?.toString() || '';
  const metaKeywords = fields?.metadataKeywords?.value?.toString() || '';
  const ogTitle =
    fields?.ogTitle?.value?.toString() ||
    fields?.metadataTitle?.value?.toString() ||
    fields?.pageTitle?.value?.toString() ||
    'Page';
  const ogImage = fields?.ogImage?.value?.src || fields?.thumbnailImage?.value?.src;
  const ogDescription =
    fields?.ogDescription?.value?.toString() ||
    fields?.metadataDescription?.value?.toString() ||
    fields?.pageSummary?.value?.toString() ||
    '';
  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <Head>
        <link rel="preconnect" href="https://edge-platform.sitecorecloud.io" />
        <title>{metaTitle}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        <link rel="icon" href="/favicon.ico" />
        {ogTitle && <meta property="og:title" content={ogTitle} />}
        {ogDescription && <meta property="og:description " content={ogDescription} />}
        {ogImage && <meta property="og:image " content={ogImage} />}
      </Head>
      <VideoProvider>
        {/* root placeholder for the app, which we add components to using route data */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className={`min-h-screen flex flex-col ${classNamesMain}`}>
            {page.mode.isDesignLibrary ? (
              <DesignLibrary />
            ) : (
              <>
                <header
                  className={`sticky ${isEditing ? 'lg:relative' : 'lg:fixed'} top-0 left-0 right-0 -mb-[38px] lg:mb-0 z-50`}
                >
                  <div id="header">
                    {route && <Placeholder name="headless-header" rendering={route} />}
                  </div>
                </header>
                <main>
                  <div id="content">
                    {route && <Placeholder name="headless-main" rendering={route} />}
                  </div>
                </main>
                <footer>
                  <div id="footer">
                    {route && <Placeholder name="headless-footer" rendering={route} />}
                  </div>
                </footer>
              </>
            )}
          </div>
        </ThemeProvider>
      </VideoProvider>
      <SpeedInsights />
    </>
  );
};

export default Layout;
