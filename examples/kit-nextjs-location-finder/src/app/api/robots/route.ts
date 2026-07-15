import { createRobotsRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import sites from '.sitecore/sites.json';
import client from 'lib/sitecore-client';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * API route for serving robots.txt
 *
 * This Next.js API route handler generates and returns the robots.txt content dynamically
 * based on the resolved site name. It is commonly
 * used by search engine crawlers to determine crawl and indexing rules.
 *
 * Allowed Bots:
 * - GPTBot (OpenAI) - https://platform.openai.com/docs/bots/gptbot
 * - ClaudeBot (Anthropic) - https://docs.anthropic.com/en/docs/claude-bot
 * - PerplexityBot - https://www.perplexity.ai/blog/perplexitybot
 * - Googlebot - https://developers.google.com/search/docs/crawling-indexing/googlebot
 * - Bingbot - https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0
 *
 * To restrict AI crawler access, modify the generateRobotsContent function below
 * or configure your hosting provider's bot management settings.
 */

const { GET: sitecoreGET } = createRobotsRouteHandler({
  client,
  sites,
});

// Generate robots.txt
function generateRobotsContent(baseUrl: string): string {
  return `# Robots.txt for ${baseUrl}
# This file controls access for web crawlers and AI bots

# ==============================================
# AI Crawlers - Explicitly Allowed
# ==============================================

# OpenAI GPTBot
# https://platform.openai.com/docs/bots/gptbot
User-agent: GPTBot
Allow: /

# OpenAI ChatGPT-User (browsing plugin)
User-agent: ChatGPT-User
Allow: /

# Anthropic ClaudeBot
# https://docs.anthropic.com/en/docs/claude-bot
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: anthropic-ai
Allow: /

# Perplexity AI
# https://www.perplexity.ai/blog/perplexitybot
User-agent: PerplexityBot
Allow: /

# Google Gemini (Extended)
User-agent: Google-Extended
Allow: /

# Meta AI
User-agent: FacebookBot
Allow: /

# Cohere AI
User-agent: cohere-ai
Allow: /

# ==============================================
# Search Engine Crawlers - Allowed
# ==============================================

# Google
User-agent: Googlebot
Allow: /
User-agent: Googlebot-Image
Allow: /
User-agent: Googlebot-News
Allow: /
User-agent: Googlebot-Video
Allow: /

# Bing
User-agent: Bingbot
Allow: /
User-agent: msnbot
Allow: /

# DuckDuckGo
User-agent: DuckDuckBot
Allow: /

# Yahoo
User-agent: Slurp
Allow: /

# Yandex
User-agent: YandexBot
Allow: /

# Baidu
User-agent: Baiduspider
Allow: /

# ==============================================
# Default Rules for All Other Bots
# ==============================================

User-agent: *
Allow: /

# ==============================================
# Sitemap Location
# ==============================================

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-llm.xml
`;
}

/**
 * Custom GET handler that ensures AI crawlers and search engines can access the site
 */
export async function GET(request: NextRequest) {
  try {
    // Try to get robots.txt from Sitecore first
    const response = await sitecoreGET(request);
    const clonedResponse = response.clone();
    const text = await clonedResponse.text();

    // Check if Sitecore returned a blocking robots.txt
    // Common blocking patterns: "Disallow: /" without any "Allow:" rules
    const hasBlockingRule = text.includes('Disallow: /') && !text.includes('Allow:');
    
    if (hasBlockingRule) {
      // Return our permissive robots.txt with AI crawler allowances
      const baseUrl = new URL(request.url).origin;
      return new NextResponse(generateRobotsContent(baseUrl), {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    // If Sitecore's robots.txt allows crawling, append AI bot rules and sitemap
    const baseUrl = new URL(request.url).origin;
    const enhancedRobots = ensureAICrawlerAccess(text, baseUrl);

    return new NextResponse(enhancedRobots, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    // If Sitecore fails, return our permissive robots.txt
    console.error('Error fetching robots.txt from Sitecore:', error);
    const baseUrl = new URL(request.url).origin;

    return new NextResponse(generateRobotsContent(baseUrl), {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}

/**
 * Ensures AI crawler access rules are present in the robots.txt
 * If they're missing, appends them to the existing content
 */
function ensureAICrawlerAccess(existingContent: string, baseUrl: string): string {
  const aiCrawlers = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'ChatGPT-User', 'anthropic-ai'];
  const missingCrawlers = aiCrawlers.filter(crawler => !existingContent.includes(crawler));

  let enhanced = existingContent;

  // Add missing AI crawler rules
  if (missingCrawlers.length > 0) {
    const aiRules = missingCrawlers.map(crawler => 
      `\n# AI Crawler - ${crawler}\nUser-agent: ${crawler}\nAllow: /`
    ).join('\n');
    
    enhanced += `\n\n# ==============================================\n# AI Crawlers - Added for discoverability\n# ==============================================\n${aiRules}`;
  }

  // Ensure sitemap is present
  if (!existingContent.toLowerCase().includes('sitemap:')) {
    enhanced += `\n\n# Sitemaps\nSitemap: ${baseUrl}/sitemap.xml\nSitemap: ${baseUrl}/sitemap-llm.xml`;
  } else if (!existingContent.toLowerCase().includes('sitemap-llm')) {
    enhanced += `\n\n# LLM-Optimized Sitemap\nSitemap: ${baseUrl}/sitemap-llm.xml`;
  }

  return enhanced;
}
