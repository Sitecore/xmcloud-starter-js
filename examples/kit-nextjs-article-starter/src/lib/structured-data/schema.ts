/**
 * Schema.org structured data generators
 * These are pure functions that can be used in both server and client components
 */
import type { JsonLdValue } from './jsonld';

/**
 * Convert schema object to JSON-LD string.
 * (Useful for debugging / testing and parity with other starters.)
 */
export const schemaToJsonLd = (schema: JsonLdValue): string => {
  return JSON.stringify(schema, null, 2);
};

/**
 * Generate Article schema.org structured data
 */
export interface ArticleSchemaProps {
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo?: string;
  };
  url?: string;
}

export function generateArticleSchema(props: ArticleSchemaProps): JsonLdValue {
  const {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author,
    publisher,
    url,
  } = props;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
  } as { [key: string]: JsonLdValue };

  if (description) {
    schema.description = description;
  }

  if (image) {
    schema.image = Array.isArray(image) ? image : [image];
  }

  if (datePublished) {
    schema.datePublished = datePublished;
  }

  if (dateModified) {
    schema.dateModified = dateModified;
  }

  if (author) {
    schema.author = {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    };
  }

  if (publisher) {
    schema.publisher = {
      '@type': 'Organization',
      name: publisher.name,
      ...(publisher.logo && {
        logo: {
          '@type': 'ImageObject',
          url: publisher.logo,
        },
      }),
    };
  }

  if (url) {
    schema.url = url;
    schema.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': url,
    };
  }

  return schema as JsonLdValue;
}

/**
 * Generate FAQPage schema.org structured data
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQPageSchemaProps {
  faqs: FAQItem[];
}

export const generateFAQPageSchema = (props: FAQPageSchemaProps): JsonLdValue | null => {
  const { faqs } = props;

  if (!faqs || faqs.length === 0) {
    return null;
  }

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
};

/**
 * Generate Organization schema.org structured data
 */
export interface OrganizationSchemaProps {
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
}

export function generateOrganizationSchema(props: OrganizationSchemaProps): JsonLdValue {
  const { name, url, logo, sameAs, contactPoint } = props;

  const result: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
  };

  if (url) {
    result.url = url as JsonLdValue;
  }

  if (logo) {
    result.logo = logo as JsonLdValue;
  }

  if (sameAs && sameAs.length > 0) {
    result.sameAs = sameAs as JsonLdValue;
  }

  if (contactPoint) {
    result.contactPoint = {
      '@type': 'ContactPoint',
      ...(contactPoint.telephone && { telephone: contactPoint.telephone }),
      ...(contactPoint.contactType && { contactType: contactPoint.contactType }),
      ...(contactPoint.email && { email: contactPoint.email }),
    } as JsonLdValue;
  }

  return result as JsonLdValue;
}

/**
 * Generate WebSite schema.org structured data
 */
export interface WebSiteSchemaProps {
  name: string;
  url: string;
  searchUrlTemplate?: string;
}

export function generateWebSiteSchema(props: WebSiteSchemaProps): JsonLdValue {
  const { name, url, searchUrlTemplate } = props;

  const result: { [key: string]: JsonLdValue } = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
  };

  if (searchUrlTemplate) {
    result.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrlTemplate,
      },
      'query-input': 'required name=search_term_string',
    } as JsonLdValue;
  }

  return result as JsonLdValue;
}

/**
 * Generate WebPage schema.org structured data
 */
export interface WebPageSchemaProps {
  name: string;
  url?: string;
  description?: string;
  inLanguage?: string;
  isPartOf?: {
    name: string;
    url: string;
  };
}

export function generateWebPageSchema(props: WebPageSchemaProps): JsonLdValue {
  const { name, url, description, inLanguage, isPartOf } = props;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
  } as { [key: string]: JsonLdValue };

  if (description) schema.description = description;
  if (url) schema.url = url;
  if (inLanguage) schema.inLanguage = inLanguage;
  if (isPartOf) {
    schema.isPartOf = {
      '@type': 'WebSite',
      name: isPartOf.name,
      url: isPartOf.url,
    };
  }

  return schema as JsonLdValue;
}

/**
 * Generate BreadcrumbList schema.org structured data
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export interface BreadcrumbListSchemaProps {
  items: BreadcrumbItem[];
}

export const generateBreadcrumbListSchema = (props: BreadcrumbListSchemaProps): JsonLdValue | null => {
  const { items } = props;

  if (!items || items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  } as JsonLdValue;
};

/**
 * Generate Person schema.org structured data
 */
export interface PersonSchemaProps {
  name: string;
  jobTitle?: string;
  image?: string;
  url?: string;
  sameAs?: string[];
}

export function generatePersonSchema(props: PersonSchemaProps): JsonLdValue {
  const { name, jobTitle, image, url, sameAs } = props;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
  } as { [key: string]: JsonLdValue };

  if (jobTitle) {
    schema.jobTitle = jobTitle;
  }

  if (image) {
    schema.image = image;
  }

  if (url) {
    schema.url = url;
  }

  if (sameAs && sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return schema as JsonLdValue;
}
