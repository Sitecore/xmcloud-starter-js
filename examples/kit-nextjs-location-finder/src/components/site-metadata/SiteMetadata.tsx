import { NoDataFallback } from '@/utils/NoDataFallback';
import type { SiteMetadataProps } from './site-metadata.props';

/**
 * Note: This component is primarily for Sitecore editing experience.
 * Actual page metadata is set via generateMetadata() in page.tsx for proper SEO.
 */
export const Default: React.FC<SiteMetadataProps> = (props) => {
  const { fields } = props;
  
  if (!fields) {
    return <NoDataFallback componentName="Site Metadata" />;
  }

  return (
    <>
      {/*
       * SEO metadata (title, description, keywords, viewport) is managed by
       * generateMetadata() in page.tsx. Rendering them here would create
       * duplicate <title> / <meta> tags.
       *
       * This component now only renders supplementary <head> elements that
       * are NOT handled by generateMetadata().
       */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
    </>
  );
};
