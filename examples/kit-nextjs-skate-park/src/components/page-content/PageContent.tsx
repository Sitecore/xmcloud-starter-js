import React, { JSX } from 'react';
import {
  RichText as ContentSdkRichText,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import StructuredData from 'components/structured-data/StructuredData';
import { buildArticleJsonLd } from 'src/lib/structured-data/schema';
import { PageContentProps } from './page-content.props';

export const Default = ({ params, fields, page }: PageContentProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = params;

  const field = fields?.Content ?? (page.layout.sitecore.route?.fields?.Content as RichTextField);
  const titleField = page.layout.sitecore.route?.fields?.Title as { value?: unknown } | undefined;
  const headline = titleField?.value ? String(titleField.value) : undefined;
  const articleBodyHtml = field?.value ? String(field.value) : undefined;

  return (
    <article
      className={`component content ${styles}`}
      id={id}
      itemScope
      itemType="https://schema.org/Article"
    >
      <div className="component-content">
        <div className="field-content" itemProp="articleBody">
          {field ? <ContentSdkRichText field={field} /> : '[Content]'}
        </div>
      </div>
      {(headline || articleBodyHtml) && (
        <StructuredData
          id={`jsonld-article-${id ?? 'page-content'}`}
          data={buildArticleJsonLd({
            headline,
            articleBodyHtml,
            inLanguage: page?.locale,
          })}
        />
      )}
    </article>
  );
};
