/** Minimal JSON-LD builders for structured data. */

export type ArticleJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline?: string;
  articleBody?: string;
  inLanguage?: string;
};

export type ProductJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name?: string;
  description?: string;
  image?: string | string[];
  url?: string;
};

const stripHtml = (html: string): string =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script[^>]*>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export function buildArticleJsonLd(input: {
  headline?: string;
  articleBodyHtml?: string;
  inLanguage?: string;
}): ArticleJsonLd {
  const headline = input.headline ? stripHtml(input.headline) : undefined;
  const articleBody = input.articleBodyHtml ? stripHtml(input.articleBodyHtml) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    articleBody,
    inLanguage: input.inLanguage,
  };
}

export function buildProductJsonLd(input: {
  name?: string;
  descriptionHtml?: string;
  image?: string | string[];
  url?: string;
}): ProductJsonLd {
  // `name` may come straight from rich text (e.g. Promo's PromoText); strip markup so JSON-LD
  // never carries raw HTML.
  const name = input.name ? stripHtml(input.name) : undefined;
  const description = input.descriptionHtml ? stripHtml(input.descriptionHtml) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: input.image,
    url: input.url,
  };
}
