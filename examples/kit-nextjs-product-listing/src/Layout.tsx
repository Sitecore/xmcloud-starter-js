/**
 * This Layout is needed for Starter Kit.
 */
import React, { type JSX } from 'react';
import { Field, ImageField, Page, AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from 'src/Providers';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { DesignLibraryApp } from '@sitecore-content-sdk/nextjs';
import componentMap from '.sitecore/component-map';
import { generateOrganizationSchema, generateWebSiteSchema } from 'src/lib/structured-data/schema';
import { StructuredData } from 'src/components/structured-data/StructuredData';

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
  preload: true,
});

const body = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
});

const accent = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  variable: '--font-accent',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
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
  baseUrl?: string;
}

export interface RouteFields {
  [key: string]: unknown;
  metadataTitle?: Field;
  metadataAuthor?: Field;
  metadataKeywords?: Field;
  pageTitle?: Field;
  metadataDescription?: Field;
  pageSummary?: Field;
  ogTitle?: Field;
  ogDescription?: Field;
  ogImage?: ImageField;
  thumbnailImage?: ImageField;
}

const Layout = ({ page, baseUrl: baseUrlProp }: LayoutProps): JSX.Element => {
  const { layout } = page;
  const { route } = layout.sitecore;
  const { isEditing } = page.mode;
  const isPartialDesignEditing = route?.templateName === 'Partial Design';
  const mainClassPartialDesignEditing = isPartialDesignEditing ? 'partial-editing-mode' : '';
  const mainClassPageEditing = isEditing ? 'editing-mode' : 'prod-mode';
  const classNamesMain = `${mainClassPageEditing} ${mainClassPartialDesignEditing} ${accent.variable} ${body.variable} ${heading.variable} main-layout`;

  // Generate JSON-LD structured data for Organization and WebSite (use request-derived baseUrl when provided)
  const baseUrl = baseUrlProp ?? process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const organizationSchema = generateOrganizationSchema({
    name: 'SYNC',
    ...(baseUrl && { url: baseUrl }),
  });

  const websiteSchema = generateWebSiteSchema({
    name: 'SYNC',
    url: baseUrl,
  });

  return (
    <>
      <Scripts />
      {/* JSON-LD structured data for Organization and WebSite */}
      <StructuredData id="organization-schema" data={organizationSchema} />
      <StructuredData id="website-schema" data={websiteSchema} />
      <SitecoreStyles layoutData={layout} />
      <Providers page={page}>
        {/* root placeholder for the app, which we add components to using route data */}
        <div className={`min-h-screen flex flex-col ${classNamesMain}`}>
          {page.mode.isDesignLibrary ? (
            route && (
              <DesignLibraryApp
                page={page}
                rendering={route}
                componentMap={componentMap}
                loadServerImportMap={() => import('.sitecore/import-map.server')}
              />
            )
          ) : (
            <>
              <header
                className={`sticky ${isEditing ? 'lg:relative' : 'lg:fixed'} top-0 left-0 right-0 -mb-[38px] lg:mb-0 z-50`}
              >
                <nav id="header" aria-label="Main navigation">
                  {route && (
                    <AppPlaceholder
                      page={page}
                      componentMap={componentMap}
                      name="headless-header"
                      rendering={route}
                    />
                  )}
                </nav>
              </header>
              <main>
                <section id="content" aria-label="Main content">
                  {route && (
                    <AppPlaceholder
                      page={page}
                      componentMap={componentMap}
                      name="headless-main"
                      rendering={route}
                    />
                  )}
                </section>
              </main>
              <footer>
                <div id="footer">
                  {route && (
                    <AppPlaceholder
                      page={page}
                      componentMap={componentMap}
                      name="headless-footer"
                      rendering={route}
                    />
                  )}
                </div>
              </footer>
            </>
          )}
        </div>
      </Providers>
      <SpeedInsights />
    </>
  );
};

export default Layout;
