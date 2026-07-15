import { Suspense } from 'react';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode, headers as nextHeaders } from 'next/headers';
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import { routing } from 'src/i18n/routing';
import scConfig from 'sitecore.config';
import client from 'src/lib/sitecore-client';
import Layout, { RouteFields } from 'src/Layout';
import components from '.sitecore/component-map';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getBaseUrl } from 'lib/utils';

type PageProps = {
  params: Promise<{
    site: string;
    locale: string;
    path?: string[];
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { site, locale, path } = await params;
  const draft = await draftMode();
  const baseUrl = getBaseUrl();

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  // Fetch the page data from Sitecore
  let page;
  if (draft.isEnabled) {
    const headers = await nextHeaders();
    const previewData = client.getPreviewData(headers);
    if (isDesignLibraryPreviewData(previewData)) {
      page = await client.getDesignLibraryData(previewData);
    } else {
      page = await client.getPreview(previewData);
    }
  } else {
    page = await client.getPage(path ?? [], { site, locale });
  }

  // If the page is not found, return a 404
  if (!page) {
    notFound();
  }

  // Fetch the component data from Sitecore (Likely will be deprecated)
  const componentProps = await client.getComponentData(page.layout, {}, components);

  return (
    <NextIntlClientProvider>
      <Suspense fallback={null}>
        <Providers page={page} componentProps={componentProps}>
          <Layout page={page} baseUrl={baseUrl || undefined} />
        </Providers>
      </Suspense>
    </NextIntlClientProvider>
  );
}
// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const generateStaticParams = async () => {
  if (process.env.NODE_ENV !== 'development' && scConfig.generateStaticPaths) {
    // Filter sites to only include the sites this starter is designed to serve.
    // This prevents cross-site build errors when multiple starters share the same XM Cloud instance.
    const defaultSite = scConfig.defaultSite;
    const allowedSites = defaultSite
      ? sites
          .filter((site: SiteInfo) => site.name === defaultSite)
          .map((site: SiteInfo) => site.name)
      : sites.map((site: SiteInfo) => site.name);

    return await client.getAppRouterStaticParams(allowedSites, routing.locales.slice());
  }
  return [];
};

export const generateMetadata = async ({ params }: PageProps) => {
  const baseUrl = getBaseUrl();

  const { path, site, locale } = await params;

  // Canonical URL: base URL + content path only (no site/locale segments)
  const pathSegment = path?.length ? `/${path.join('/')}` : '';
  const canonicalUrl = baseUrl ? `${baseUrl}${pathSegment}` : undefined;

  // The same call as for rendering the page. Should be cached by default react behavior
  const page = await client.getPage(path ?? [], { site, locale });

  // Cast route fields once to the expected RouteFields shape to avoid accessing unknown {}
  const routeFields = (page?.layout.sitecore.route?.fields ?? {}) as RouteFields;

  // Extract metadata values with fallback chain
  const metadataTitle =
    routeFields?.metadataTitle?.value?.toString() ||
    routeFields?.pageTitle?.value?.toString() ||
    'Page';

  const metadataDescription =
    routeFields?.metadataDescription?.value?.toString() ||
    routeFields?.pageSummary?.value?.toString() ||
    'SYNC - Premium audio gear for professionals';

  const ogTitle = routeFields?.ogTitle?.value?.toString() || metadataTitle;

  const ogDescription = routeFields?.ogDescription?.value?.toString() || metadataDescription;

  // Ensure image URL is absolute (HTTPS preferred)
  const imageSource = routeFields?.ogImage?.value?.src || routeFields?.thumbnailImage?.value?.src;

  const ogImageUrl = imageSource
    ? imageSource.startsWith('http')
      ? imageSource
      : `${baseUrl}${imageSource.startsWith('/') ? '' : '/'}${imageSource}`
    : undefined;

  const pageUrl = canonicalUrl;

  // Parse keywords from comma-separated string to array (for <meta name="keywords">)
  const keywordsString = routeFields?.metadataKeywords?.value?.toString() || '';
  const keywords = keywordsString ? keywordsString.split(',').map((k: string) => k.trim()) : [];

  const metadataAuthor = routeFields?.metadataAuthor?.value?.toString() || 'Sitecore';

  return {
    title: metadataTitle,
    description: metadataDescription,
    authors: [{ name: metadataAuthor }],
    ...(keywords.length > 0 && { keywords }),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: pageUrl,
      type: 'website',
      siteName: site || 'SYNC',
      locale: locale || 'en',
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: ogTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
};
