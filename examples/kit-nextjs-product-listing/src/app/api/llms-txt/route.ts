import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Serves the public llms.txt file for AI search engines and LLM consumption.
 * Follows the llms.txt specification: https://llmstxt.org/
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const baseUrl = new URL(request.url).origin;

  const content = `# SYNC

> SYNC is a product-focused template for audio gear companies, featuring speaker and product listings plus video content, built with Next.js and Sitecore XM Cloud.

The site showcases audio products, speaker lineups, and video content in a commerce-oriented layout. Content is managed in Sitecore and delivered headlessly.

## Key pages

- [Home](${baseUrl}/): Brand landing and featured products
- [Speakers](${baseUrl}/Speakers): Speaker product listing and catalog
- [Video](${baseUrl}/Video): Video content and product demos
- [Heritage-10](${baseUrl}/Speakers/Heritage-10): Heritage-10 product and details
- [Heritage-30](${baseUrl}/Speakers/Heritage-30): Heritage-30 product and details
- [Heritage-50](${baseUrl}/Speakers/Heritage-50): Heritage-50 product and details

## Optional

- [Sitemap](${baseUrl}/sitemap.xml): Full XML sitemap for search engines
- [LLM Sitemap](${baseUrl}/sitemap-llm.xml): LLM-optimized sitemap for AI crawlers
- [Robots](${baseUrl}/robots.txt): Crawler and bot access rules
- [AI metadata](${baseUrl}/.well-known/ai.txt): AI crawler and LLM metadata (ai.txt)
- [FAQ (JSON)](${baseUrl}/ai/faq.json): Frequently asked questions
- [Summary (JSON)](${baseUrl}/ai/summary.json): Site summary for AI consumption
- [Service (JSON)](${baseUrl}/ai/service.json): Service information for AI consumption
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
