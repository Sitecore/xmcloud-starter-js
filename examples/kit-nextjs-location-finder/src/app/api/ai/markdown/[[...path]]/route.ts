import { NextRequest, NextResponse } from 'next/server';
import client from 'lib/sitecore-client';
import { generateMarkdownFromRoute } from 'src/lib/ai-markdown';

export const dynamic = 'force-dynamic';

const CACHE_MAX_AGE = 300;
const DEFAULT_SITE_NAME = process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || 'alaris';
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';

function isAiMarkdownEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_AIMARKDOWN !== 'false';
}

function ensureSiteAndLocale(request: NextRequest): { site: string; locale: string } {
  const site =
    request.nextUrl.searchParams.get('site') ||
    DEFAULT_SITE_NAME;
  const locale = request.nextUrl.searchParams.get('locale') || DEFAULT_LOCALE;

  return { site, locale };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
): Promise<NextResponse> {
  try {
    if (!isAiMarkdownEnabled()) {
      return new NextResponse('AI markdown is disabled', { status: 404 });
    }

    const { site, locale } = ensureSiteAndLocale(request);
    const { path = [] } = await context.params;

    const page = await client.getPage(path, { site, locale });
    if (!page || !page.layout?.sitecore?.route) {
      return new NextResponse('Page not found', { status: 404 });
    }

    const markdown = generateMarkdownFromRoute(page.layout.sitecore.route);

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=600`,
      },
    });
  } catch (error) {
    console.error('Error generating AI markdown:', error);
    return new NextResponse('Error generating markdown', { status: 500 });
  }
}
