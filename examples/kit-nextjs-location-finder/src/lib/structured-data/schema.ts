/**
 * Schema.org structured data generators
 * Provides functions to generate JSON-LD structured data for SEO and rich snippets
 */
import type { JsonLdValue } from './jsonld';

export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
}

export interface WebPageSchema {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  name: string;
  description?: string;
  url: string;
  inLanguage?: string;
}

export interface PlaceSchema {
  '@context': 'https://schema.org';
  '@type': 'LocalBusiness' | 'Place';
  name: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
}

export interface ProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description?: string;
  image?: string;
  url?: string;
  offers?: {
    '@type': 'Offer';
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}

export interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface ReviewSchema {
  '@context': 'https://schema.org';
  '@type': 'Review';
  author?: {
    '@type': 'Person';
    name: string;
  };
  reviewBody?: string;
  reviewRating?: {
    '@type': 'Rating';
    ratingValue?: number;
    bestRating?: number;
  };
}

export interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export function generateWebSiteSchema(
  siteName: string,
  siteUrl: string,
  description?: string
): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    } as JsonLdValue,
  };

  if (description) {
    schema.description = description as JsonLdValue;
  }

  return schema as JsonLdValue;
}

export function generateOrganizationSchema(
  name: string,
  url: string,
  logo?: string,
  description?: string
): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
  };

  if (logo) {
    schema.logo = logo as JsonLdValue;
  }

  if (description) {
    schema.description = description as JsonLdValue;
  }

  return schema as JsonLdValue;
}

export function generateWebPageSchema(
  pageName: string,
  pageUrl: string,
  description?: string,
  locale?: string
): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageName,
    url: pageUrl,
    inLanguage: locale || 'en',
  };

  if (description) {
    schema.description = description as JsonLdValue;
  }

  return schema as JsonLdValue;
}

export function generatePlaceSchema(
  name: string,
  streetAddress?: string,
  city?: string,
  region?: string,
  postalCode?: string,
  country?: string,
  latitude?: number,
  longitude?: number
): JsonLdValue {
  const addressObj: { [key: string]: JsonLdValue } = {
    '@type': 'PostalAddress',
    addressCountry: country || 'US',
  };

  if (streetAddress) {
    addressObj.streetAddress = streetAddress as JsonLdValue;
  }

  if (city) {
    addressObj.addressLocality = city as JsonLdValue;
  }

  if (region) {
    addressObj.addressRegion = region as JsonLdValue;
  }

  if (postalCode) {
    addressObj.postalCode = postalCode as JsonLdValue;
  }

  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    address: addressObj as JsonLdValue,
  };

  if (latitude && longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    } as JsonLdValue;
  }

  return schema as JsonLdValue;
}

export function generateProductSchema(
  name: string,
  description?: string,
  image?: string,
  url?: string,
  price?: string,
  priceCurrency: string = 'USD'
): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
  };

  if (description) {
    schema.description = description as JsonLdValue;
  }

  if (image) {
    schema.image = image as JsonLdValue;
  }

  if (url) {
    schema.url = url as JsonLdValue;
  }

  if (price) {
    schema.offers = {
      '@type': 'Offer',
      price: price.replace(/[^0-9.]/g, ''), // Strip currency symbols
      priceCurrency,
      availability: 'https://schema.org/InStock',
    } as JsonLdValue;
  }

  return schema as JsonLdValue;
}

export function generateFAQPageSchema(
  questions: Array<{ question: string; answer: string }>
): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  } as JsonLdValue;
}

export function generateReviewSchema(
  authorName: string,
  reviewBody?: string,
  ratingValue?: number,
  bestRating: number = 5
): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: authorName,
    } as JsonLdValue,
  };

  if (reviewBody) {
    schema.reviewBody = reviewBody as JsonLdValue;
  }

  if (ratingValue !== undefined) {
    schema.reviewRating = {
      '@type': 'Rating',
      ratingValue,
      bestRating,
    } as JsonLdValue;
  }

  return schema as JsonLdValue;
}

export function generateBreadcrumbListSchema(
  breadcrumbs: Array<{ name: string; url?: string }>
): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => {
      const item: { [key: string]: JsonLdValue } = {
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
      };
      if (crumb.url) {
        item.item = crumb.url as JsonLdValue;
      }
      return item as JsonLdValue;
    }),
  } as JsonLdValue;
}
