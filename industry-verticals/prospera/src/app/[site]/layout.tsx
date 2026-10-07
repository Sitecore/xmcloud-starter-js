import { draftMode } from 'next/headers';
import Bootstrap from 'src/Bootstrap';
import { ProfileWidget } from 'components/non-sitecore/ProfileWidget';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const { isEnabled } = await draftMode();

  return (
    <>
      <Bootstrap siteName={site} isPreviewMode={isEnabled} />
      {children}
      <ProfileWidget />
    </>
  );
}
