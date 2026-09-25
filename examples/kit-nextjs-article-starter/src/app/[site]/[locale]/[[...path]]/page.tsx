import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { draftMode, headers as nextHeaders } from 'next/headers';
import { getPageMetadata } from '@sitecore-content-sdk/nextjs';
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import { routing } from '@/i18n/routing';
import scConfig from 'sitecore.config';
import client from '@/lib/sitecore-client';
import Layout, { RouteFields } from '@/Layout';
import Providers from '@/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { StructuredData } from '@/components/structured-data/StructuredData';
import { generateWebPageSchema } from '@/lib/structured-data/schema';
import { getBaseUrl } from '@/lib/utils';

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

  const routeFields = page.layout.sitecore.route?.fields as RouteFields;
  const pageTitle = routeFields?.Title?.value?.toString() || 'Page';
  const pageDescription = routeFields?.ogDescription?.value?.toString();

  const pathSegments = path && path.length > 0 ? path.join('/') : '';
  const urlPath = pathSegments ? `/${pathSegments}` : '';
  const fullUrl = baseUrl ? `${baseUrl}${urlPath}` : undefined;

  const webPageSchema = generateWebPageSchema({
    name: pageTitle,
    description: pageDescription,
    url: fullUrl,
    inLanguage: locale.replace('_', '-'),
    ...(baseUrl && {
      isPartOf: {
        name: 'Solterra & Co.',
        url: baseUrl,
      },
    }),
  });

  return (
    <NextIntlClientProvider>
      <Providers page={page}>
        <StructuredData id="webpage-schema" data={webPageSchema} />
        <Layout page={page} />
      </Providers>
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
    return await client.getAppRouterStaticParams(
      allowedSites,
      routing.locales.slice(),
    );
  }
  return [];
};

type AuthoredField = { value?: unknown };

/** Maps this starter's page fields onto the names getPageMetadata reads. */
function toSdkMetadataFields(fields: Record<string, AuthoredField | undefined> | undefined) {
  const text = (field?: AuthoredField) => {
    const value = field?.value;
    if (typeof value !== 'string' && typeof value !== 'number') return undefined;
    return String(value) ? field : undefined;
  };
  const title =
    text(fields?.Title) ??
    text(fields?.metadataTitle) ??
    text(fields?.pageTitle) ??
    text(fields?.ogTitle);

  return {
    ...fields,
    Title: title,
    baseMetadataTitle: text(fields?.baseMetadataTitle) ?? text(fields?.metadataTitle) ?? title,
    baseMetadataDescription:
      text(fields?.baseMetadataDescription) ??
      text(fields?.metadataDescription) ??
      text(fields?.pageSummary) ??
      text(fields?.ogDescription),
    baseMetadataKeywords: text(fields?.baseMetadataKeywords) ?? text(fields?.metadataKeywords),
    baseMetadataAuthor: text(fields?.baseMetadataAuthor) ?? text(fields?.metadataAuthor),
    baseOgTitle: text(fields?.baseOgTitle) ?? text(fields?.ogTitle) ?? title,
    baseOgDescription:
      text(fields?.baseOgDescription) ??
      text(fields?.ogDescription) ??
      text(fields?.metadataDescription) ??
      text(fields?.pageSummary),
    baseOgImage: fields?.baseOgImage ?? fields?.ogImage ?? fields?.thumbnailImage,
  };
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const baseUrl = getBaseUrl();

  const { path, site, locale } = await params;

  // Canonical URL: base URL + content path only (no site/locale segments)
  const pathSegment = path?.length ? `/${path.join('/')}` : '';
  const canonicalUrl = baseUrl ? `${baseUrl}${pathSegment}` : undefined;

  // The same call as for rendering the page. Should be cached by default react behavior
  const page = await client.getPage(path ?? [], { site, locale });
  const route = page?.layout.sitecore.route;

  return {
    ...getPageMetadata(
      route && {
        ...route,
        fields: toSdkMetadataFields(
          route.fields as Record<string, AuthoredField | undefined> | undefined
        ) as typeof route.fields,
      }
    ),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
  };
};
