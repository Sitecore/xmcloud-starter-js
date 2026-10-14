/**
 * Schema.org structured data generators
 * Provides functions to generate JSON-LD structured data for SEO and rich snippets
 */
import type { JsonLdValue } from './jsonld';

export interface ProductSchema {
  '@context': string;
  '@type': 'Product';
  name: string;
  image?: string;
  description?: string;
  offers?: {
    '@type': 'Offer';
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
  url?: string;
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue?: string;
    reviewCount?: string;
  };
}

export interface ArticleSchema {
  '@context': string;
  '@type': 'Article';
  headline: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': 'Person';
    name: string;
    image?: string;
    jobTitle?: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  description?: string;
  articleBody?: string;
}

export interface OrganizationSchema {
  '@context': string;
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType?: string;
    email?: string;
    telephone?: string;
  };
}

export interface WebSiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface FAQPageSchema {
  '@context': string;
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

export interface PlaceSchema {
  '@context': string;
  '@type': 'Place';
  name: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude?: string;
    longitude?: string;
  };
  telephone?: string;
  url?: string;
}

/**
 * Generate Product JSON-LD structured data
 */
export function generateProductSchema(product: {
  name: string;
  image?: string;
  description?: string;
  price?: string;
  priceCurrency?: string;
  url?: string;
  brand?: string;
}): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
  };

  if (product.image) {
    schema.image = product.image as JsonLdValue;
  }

  if (product.description) {
    schema.description = product.description as JsonLdValue;
  }

  if (product.price) {
    schema.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.priceCurrency || 'USD',
      availability: 'https://schema.org/InStock',
    } as JsonLdValue;
  }

  if (product.url) {
    schema.url = product.url as JsonLdValue;
  }

  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: product.brand,
    } as JsonLdValue;
  }

  return schema as JsonLdValue;
}

/**
 * Generate Article JSON-LD structured data
 */
export function generateArticleSchema(article: {
  headline: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    image?: string;
    jobTitle?: string;
  };
  publisher?: {
    name: string;
    logo?: string;
  };
  description?: string;
  articleBody?: string;
}): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
  };

  if (article.image) {
    schema.image = (Array.isArray(article.image) ? article.image : [article.image]) as JsonLdValue;
  }

  if (article.datePublished) {
    schema.datePublished = article.datePublished as JsonLdValue;
  }

  if (article.dateModified) {
    schema.dateModified = article.dateModified as JsonLdValue;
  }

  if (article.author) {
    const authorObj: { [key: string]: JsonLdValue } = {
      '@type': 'Person',
      name: article.author.name,
    };
    if (article.author.image) {
      authorObj.image = article.author.image as JsonLdValue;
    }
    if (article.author.jobTitle) {
      authorObj.jobTitle = article.author.jobTitle as JsonLdValue;
    }
    schema.author = authorObj as JsonLdValue;
  }

  if (article.publisher) {
    const publisherObj: { [key: string]: JsonLdValue } = {
      '@type': 'Organization',
      name: article.publisher.name,
    };
    if (article.publisher.logo) {
      publisherObj.logo = {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      } as JsonLdValue;
    }
    schema.publisher = publisherObj as JsonLdValue;
  }

  if (article.description) {
    schema.description = article.description as JsonLdValue;
  }

  if (article.articleBody) {
    schema.articleBody = article.articleBody as JsonLdValue;
  }

  return schema as JsonLdValue;
}

/**
 * Generate Organization JSON-LD structured data
 */
export function generateOrganizationSchema(org: {
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    contactType?: string;
    email?: string;
    telephone?: string;
  };
}): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
  };

  if (org.url) {
    schema.url = org.url as JsonLdValue;
  }

  if (org.logo) {
    schema.logo = org.logo as JsonLdValue;
  }

  if (org.sameAs && org.sameAs.length > 0) {
    schema.sameAs = org.sameAs as JsonLdValue;
  }

  if (org.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      contactType: org.contactPoint.contactType || 'Customer Service',
    } as JsonLdValue;
    if (org.contactPoint.email) {
      (schema.contactPoint as { [key: string]: JsonLdValue }).email = org.contactPoint.email as JsonLdValue;
    }
    if (org.contactPoint.telephone) {
      (schema.contactPoint as { [key: string]: JsonLdValue }).telephone = org.contactPoint.telephone as JsonLdValue;
    }
  }

  return schema as JsonLdValue;
}

/**
 * Generate WebSite JSON-LD structured data
 */
export function generateWebSiteSchema(site: {
  name: string;
  url: string;
  searchUrl?: string;
}): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
  };

  if (site.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: site.searchUrl,
      },
      'query-input': 'required name=search_term_string',
    } as JsonLdValue;
  }

  return schema as JsonLdValue;
}

/**
 * Generate FAQPage JSON-LD structured data
 */
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } as JsonLdValue;
}

/**
 * Generate Place JSON-LD structured data
 */
export function generatePlaceSchema(place: {
  name: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude?: string;
    longitude?: string;
  };
  telephone?: string;
  url?: string;
}): JsonLdValue {
  const schema: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: place.name,
  };

  if (place.address) {
    const addressObj: { [key: string]: JsonLdValue } = {
      '@type': 'PostalAddress',
    };
    if (place.address.streetAddress) {
      addressObj.streetAddress = place.address.streetAddress as JsonLdValue;
    }
    if (place.address.addressLocality) {
      addressObj.addressLocality = place.address.addressLocality as JsonLdValue;
    }
    if (place.address.addressRegion) {
      addressObj.addressRegion = place.address.addressRegion as JsonLdValue;
    }
    if (place.address.postalCode) {
      addressObj.postalCode = place.address.postalCode as JsonLdValue;
    }
    if (place.address.addressCountry) {
      addressObj.addressCountry = place.address.addressCountry as JsonLdValue;
    }
    schema.address = addressObj as JsonLdValue;
  }

  if (place.geo) {
    const geoObj: { [key: string]: JsonLdValue } = {
      '@type': 'GeoCoordinates',
    };
    if (place.geo.latitude) {
      geoObj.latitude = place.geo.latitude as JsonLdValue;
    }
    if (place.geo.longitude) {
      geoObj.longitude = place.geo.longitude as JsonLdValue;
    }
    schema.geo = geoObj as JsonLdValue;
  }

  if (place.telephone) {
    schema.telephone = place.telephone as JsonLdValue;
  }

  if (place.url) {
    schema.url = place.url as JsonLdValue;
  }

  return schema as JsonLdValue;
}
