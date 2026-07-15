import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Serves the public llms.txt file for AI search engines and LLM consumption.
 * Follows the llms.txt specification: https://llmstxt.org/
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const baseUrl = new URL(request.url).origin;

  const content = `# Alaris

> Alaris is a car brand template with a location finder, showcasing vehicle lineups and helping visitors find dealers and test drive options.

The site highlights product models (Aero, Terra, Nexa), supports test drive discovery, and provides dealer locator functionality. Built with Next.js and Sitecore XM Cloud.

## Key pages

- [Home](${baseUrl}/): Brand overview and featured vehicles
- [Products - Aero](${baseUrl}/Products/Aero): Aero model information
- [Products - Terra](${baseUrl}/Products/Terra): Terra model information
- [Products - Nexa](${baseUrl}/Products/Nexa): Nexa model information
- [Test Drive](${baseUrl}/Test-Drive): Test drive and dealer locator

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
