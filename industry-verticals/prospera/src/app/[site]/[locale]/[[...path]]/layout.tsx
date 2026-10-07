import { setCachedPageParams } from '@sitecore-content-sdk/nextjs';
import { SearchProvider } from 'components/legacysearch/SearchProvider';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string; locale: string }>;
}) {
  const { site, locale } = await params;

  setCachedPageParams({ locale, site });

  return (
    <SearchProvider locale={locale}>
      {children}
    </SearchProvider>
  );
}

