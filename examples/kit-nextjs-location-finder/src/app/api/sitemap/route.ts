import { createSitemapRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import sites from '.sitecore/sites.json';
import client from 'lib/sitecore-client';

export const dynamic = 'force-dynamic';

/**
 * API route for serving sitemap.xml
 */

export const { GET } = createSitemapRouteHandler({
  client,
  sites,
});
