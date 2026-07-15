import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Serves the public llms.txt file for AI search engines and LLM consumption.
 * Follows the llms.txt specification: https://llmstxt.org/
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const baseUrl = new URL(request.url).origin;

  const content = `# Solterra & Co.

> Solterra & Co. is an editorial-style lifestyle brand site built with Next.js and Sitecore XM Cloud, featuring articles, storytelling, and content-driven experiences.

The site offers a curated reading experience with hero sections, article listings, and full article pages. Content is managed in Sitecore and delivered headlessly. Supports English and Canadian English.

## Key pages

- [Home](${baseUrl}/): Brand landing and featured content
- [Articles](${baseUrl}/Articles): Article listing and editorial index
- [Article page](${baseUrl}/Article-Page): Full article layout and reading experience
- [Landing page](${baseUrl}/Landing-Page): Full landing page layout and experience

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
