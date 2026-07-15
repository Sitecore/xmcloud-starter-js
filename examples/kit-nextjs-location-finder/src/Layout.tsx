import React, { type JSX } from 'react';
import {
  Field,
  ImageField,
  Page,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Sora, Roboto } from 'next/font/google';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';
import { DesignLibraryApp } from '@sitecore-content-sdk/nextjs';
import componentMap from '.sitecore/component-map';
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
} from 'src/lib/structured-data/schema';
import { StructuredData } from 'src/components/structured-data/StructuredData';
import { getBaseUrl } from 'src/lib/utils';
import type { JsonLdValue } from 'src/lib/structured-data/jsonld';
import Providers from './Providers';

const heading = Sora({
  weight: ['300', '400', '500'],
  variable: '--font-heading',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const body = Roboto({
  weight: ['400', '500'],
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

interface LayoutProps {
  page: Page;
  /** Base URL for the site (e.g. from request host or NEXT_PUBLIC_SITE_URL). When provided, used for JSON-LD so deployed URLs are correct. */
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
  Title?: Field;
}

const Layout = ({ page, baseUrl: baseUrlProp }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';
  const classNamesMain = `${mainClassPageEditing} ${body.variable} ${heading.variable} main-layout`;

  // Generate site-wide structured data (use request-derived baseUrl when provided so deployed URLs are correct)
  const baseUrl = baseUrlProp ?? getBaseUrl();
  const websiteSchema = generateWebSiteSchema('Alaris', baseUrl, 'Find your nearest Alaris dealership');
  const organizationSchema = generateOrganizationSchema('Alaris', baseUrl, undefined, 'Alaris - Premium automotive dealership network');

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      
      {/* Site-wide structured data */}
      <StructuredData id="website-schema" data={websiteSchema as JsonLdValue} />
      <StructuredData id="organization-schema" data={organizationSchema as JsonLdValue} />
      
      <Providers page={page}>
        {/* root placeholder for the app, which we add components to using route data */}
        <div className={`min-h-screen flex flex-col ${classNamesMain}`}>
          {page.mode.isDesignLibrary ? (
            route && (
              <DesignLibraryApp
                page={page}
                rendering={route}
                componentMap={componentMap}
                loadServerImportMap={() =>
                  import('.sitecore/import-map.server')
                }
              />
            )
          ) : (
            <>
              {/* Header placeholder - components handle their own semantic elements */}
              <div id="header">
                {route && (
                  <AppPlaceholder
                    page={page}
                    componentMap={componentMap}
                    name="headless-header"
                    rendering={route}
                  />
                )}
              </div>
              {/* Main content area */}
              <main id="content" role="main">
                {route && (
                  <AppPlaceholder
                    page={page}
                    componentMap={componentMap}
                    name="headless-main"
                    rendering={route}
                  />
                )}
              </main>
              {/* Footer placeholder - components handle their own semantic elements */}
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
            </>
          )}
        </div>
      </Providers>
      <SpeedInsights />
    </>
  );
};

export default Layout;
