import Head from 'next/head';
import { SiteMetadataProps } from '@/components/site-metadata/site-metadata.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { getDatasource } from '@/lib/component-props';

export const Default: React.FC<SiteMetadataProps> = (props) => {
  const fields = getDatasource(props.fields);

  if (!fields) {
    return <NoDataFallback componentName="Site Metadata" />;
  }

  const title = fields.metadataTitle?.value || fields.title?.value;
  const keywords = fields.metadataKeywords?.value || '';
  const description = fields.metadataDescription?.value || '';
  const author = fields.metadataAuthor?.value || 'Sitecore';

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content={author} />
        {keywords.length && <meta name="keywords" content={fields.metadataKeywords?.value} />}
        {description.length && <meta name="description" content={fields.metadataDescription?.value} />}
      </Head>
    </>
  );
};
