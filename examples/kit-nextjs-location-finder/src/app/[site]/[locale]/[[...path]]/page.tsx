import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode, headers as nextHeaders } from 'next/headers';
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { preload } from 'react-dom';
import sites from '.sitecore/sites.json';
import { routing } from 'src/i18n/routing';
import scConfig from 'sitecore.config';
import client from 'src/lib/sitecore-client';
import Layout, { RouteFields } from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import {
  generateWebPageSchema,
  generateProductSchema,
} from 'src/lib/structured-data/schema';
import { StructuredData } from '@/components/structured-data/StructuredData';
import { getFullUrl, getBaseUrl } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findHeroImageSrc(page: any): string | undefined {
  const placeholders = page?.layout?.sitecore?.route?.placeholders;
  if (!placeholders) return undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search = (components: any[]): string | undefined => {
    for (const comp of components) {
      if (comp.componentName === 'Hero' && comp.fields?.image?.value?.src) {
        return comp.fields.image.value.src;
      }
      // Recurse into nested placeholders (containers / flex)
      if (comp.placeholders) {
        for (const nested of Object.values(comp.placeholders)) {
          if (Array.isArray(nested)) {
            const found = search(nested);
            if (found) return found;
          }
        }
      }
    }
    return undefined;
  };

  for (const phComponents of Object.values(placeholders)) {
    if (Array.isArray(phComponents)) {
      const found = search(phComponents);
      if (found) return found;
    }
  }
  return undefined;
}

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

  if (!page) {
    notFound();
  }

  const heroImageSrc = findHeroImageSrc(page);
  if (heroImageSrc) {
    preload(heroImageSrc, { as: 'image', fetchPriority: 'high' });
  }

  // Generate page-specific structured data
  const fields = page.layout.sitecore.route?.fields as RouteFields;
  const pageTitle =
    fields?.Title?.value?.toString() ||
    fields?.pageTitle?.value?.toString() ||
    'Page';
  const pageDescription =
    fields?.metadataDescription?.value?.toString() ||
    fields?.ogDescription?.value?.toString();
  const currentPath = path?.length ? `/${path.join('/')}` : '/';
  const fullUrl = baseUrl
    ? `${baseUrl}${currentPath}`
    : getFullUrl(currentPath);
  const webPageSchema = generateWebPageSchema(
    pageTitle,
    fullUrl,
    pageDescription,
    locale,
  );

  // Detect if this is a product page and generate Product schema
  const isProductPage = path && path[0] === 'Products';
  const productSchema = isProductPage
    ? generateProductSchema(
        pageTitle,
        fields?.pageSummary?.value?.toString() || pageDescription,
        fields?.thumbnailImage?.value?.src || fields?.ogImage?.value?.src,
        fullUrl,
        undefined, // Price not available on detail pages by default
      )
    : null;

  return (
    <NextIntlClientProvider>
      <Providers page={page}>
        {/* Page-specific structured data */}
        <StructuredData id="webpage-schema" data={webPageSchema} />
        {productSchema && (
          <StructuredData id="product-schema-page" data={productSchema} />
        )}
        <Layout page={page} baseUrl={baseUrl || undefined} />
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

export const generateMetadata = async ({ params }: PageProps) => {
  const baseUrl = getBaseUrl();

  const { site, locale, path } = await params;

  // Canonical URL: base URL + content path only (no site/locale segments)
  const pathSegment = path?.length ? `/${path.join('/')}` : '';
  const canonicalUrl = baseUrl ? `${baseUrl}${pathSegment}` : undefined;

  // The same call as for rendering the page. Should be cached by default react behavior
  const page = await client.getPage(path ?? [], { site, locale });

  // Cast route fields once to avoid repeated type assertions
  const routeFields = (page?.layout.sitecore.route?.fields ??
    {}) as RouteFields;

  // Extract metadata values with fallback chain
  const metadataTitle =
    routeFields?.metadataTitle?.value?.toString() ||
    routeFields?.pageTitle?.value?.toString() ||
    routeFields?.Title?.value?.toString() ||
    routeFields?.ogTitle?.value?.toString() ||
    'Page';

  const metadataDescription =
    routeFields?.metadataDescription?.value?.toString() ||
    routeFields?.pageSummary?.value?.toString() ||
    routeFields?.ogDescription?.value?.toString() ||
    'Alaris - Find your nearest location';

  const ogTitle =
    routeFields?.ogTitle?.value?.toString() ||
    routeFields?.Title?.value?.toString() ||
    metadataTitle;

  const ogDescription =
    routeFields?.ogDescription?.value?.toString() || metadataDescription;

  // Ensure image URL is absolute (HTTPS preferred)
  const imageSource =
    routeFields?.ogImage?.value?.src || routeFields?.thumbnailImage?.value?.src;

  const ogImageUrl = imageSource
    ? imageSource.startsWith('http')
      ? imageSource
      : `${baseUrl}${imageSource.startsWith('/') ? '' : '/'}${imageSource}`
    : undefined;

  const pageUrl = canonicalUrl;

  // Parse keywords from comma-separated string to array (for <meta name="keywords">)
  const keywordsString = routeFields?.metadataKeywords?.value?.toString() || '';
  const keywords = keywordsString
    ? keywordsString.split(',').map((k: string) => k.trim())
    : [];

  const metadataAuthor =
    routeFields?.metadataAuthor?.value?.toString() || 'Sitecore';

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
      siteName: site || 'Alaris',
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
};
