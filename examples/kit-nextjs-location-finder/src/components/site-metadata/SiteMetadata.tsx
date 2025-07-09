import Head from 'next/head';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
type SiteMetadataProps = ComponentProps & SiteMetadataFields;

type SiteMetadataFields = {
  fields: {
    title?: Field<string>;
    metadataTitle?: Field<string>;
    metadataKeywords?: Field<string>;
    metadataDescription?: Field<string>;
  };
};

export const Default: React.FC<SiteMetadataProps> = (props) => {
  const { fields } = props;
  const title = fields.metadataTitle?.value || fields.title?.value;
  const keywords = fields.metadataKeywords?.value || '';
  const description = fields.metadataDescription?.value || '';
  if (fields) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {keywords.length && <meta name="keywords" content={fields.metadataKeywords?.value} />}
          {description.length && (
            <meta name="description" content={fields.metadataDescription?.value} />
          )}
        </Head>
      </>
    );
  }
  return <NoDataFallback componentName="Site Metadata" />;
};
