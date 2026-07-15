import './globals.css';

import { StructuredData } from '@/components/structured-data/StructuredData';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/structured-data/schema';
import type { JsonLdValue } from '@/lib/structured-data/jsonld';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  // Site-wide schemas: Organization + WebSite (injected once per page)
  const organizationSchema = generateOrganizationSchema({
    name: 'Solterra & Co.',
    url: baseUrl || undefined,
  });

  const webSiteSchema = baseUrl
    ? generateWebSiteSchema({
      name: 'Solterra & Co.',
      url: baseUrl,
    })
    : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://edge-platform.sitecorecloud.io" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <StructuredData id="organization-schema" data={organizationSchema as JsonLdValue} />
        {webSiteSchema && <StructuredData id="website-schema" data={webSiteSchema as JsonLdValue} />}
        {children}
      </body>
    </html>
  );
}
