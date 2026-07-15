# AI Crawler Access Configuration Guide

This guide explains how to configure AI crawler and search engine bot access for your XM Cloud starter applications.

## Table of Contents

- [Overview](#overview)
- [Default Configuration](#default-configuration)
- [Supported AI Crawlers](#supported-ai-crawlers)
- [Robots.txt Configuration](#robotstxt-configuration)
- [Hosting Provider Setup](#hosting-provider-setup)
  - [Vercel](#vercel)
  - [Azure](#azure-static-web-apps--azure-app-service)
  - [Netlify](#netlify)
  - [XM Cloud Rendering Hosts](#xm-cloud-rendering-hosts)
- [Restricting Bot Access](#restricting-bot-access)
- [Sitemap Configuration](#sitemap-configuration)
  - [Configuring Sitemap in Sitecore Content Editor](#configuring-sitemap-in-sitecore-content-editor)
  - [Automated Sitemap Configuration Script](#automated-sitemap-configuration-script)
  - [Troubleshooting Sitemap Issues](#troubleshooting-sitemap-issues)
- [Testing Crawler Access](#testing-crawler-access)
- [References](#references)

## Overview

AI-powered search and discovery tools (like ChatGPT, Claude, Perplexity AI) use web crawlers to index content. By default, this starter kit is configured to **allow all major AI crawlers and search engines** to ensure maximum discoverability of your content.

The robots.txt configuration is dynamically generated and includes:
- Explicit allowances for AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Search engine crawler access (Googlebot, Bingbot, etc.)
- Automatic sitemap.xml linking
- Fallback handling when Sitecore configuration is unavailable

## Default Configuration

All starter applications include an enhanced `robots.txt` route handler located at:
```
src/app/api/robots/route.ts
```

This handler:
1. Attempts to fetch robots.txt configuration from Sitecore XM Cloud
2. Enhances the response with explicit AI crawler allowances if missing
3. Falls back to a permissive default if Sitecore is unavailable
4. Always includes a link to `/sitemap.xml`

## Supported AI Crawlers

The following AI crawlers are explicitly allowed by default:

| Crawler | Company | Documentation |
|---------|---------|---------------|
| GPTBot | OpenAI | [OpenAI GPTBot](https://platform.openai.com/docs/bots/gptbot) |
| ChatGPT-User | OpenAI | [OpenAI Bots](https://platform.openai.com/docs/bots) |
| ClaudeBot | Anthropic | [Anthropic Claude-Bot](https://docs.anthropic.com/en/docs/claude-bot) |
| Claude-Web | Anthropic | [Anthropic Documentation](https://docs.anthropic.com) |
| anthropic-ai | Anthropic | [Anthropic Documentation](https://docs.anthropic.com) |
| PerplexityBot | Perplexity AI | [PerplexityBot](https://www.perplexity.ai/blog/perplexitybot) |
| Google-Extended | Google | [Google Bard/Gemini](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers) |
| FacebookBot | Meta | [Meta Crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) |
| cohere-ai | Cohere | [Cohere Documentation](https://cohere.com) |

### Search Engine Crawlers

| Crawler | Search Engine | Documentation |
|---------|---------------|---------------|
| Googlebot | Google | [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot) |
| Bingbot | Bing | [Bingbot](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0) |
| DuckDuckBot | DuckDuckGo | [DuckDuckBot](https://duckduckgo.com/duckduckbot) |
| Slurp | Yahoo | Yahoo Search |
| YandexBot | Yandex | [YandexBot](https://yandex.com/support/webmaster/robot-workings/check-yandex-robots.html) |
| Baiduspider | Baidu | [Baiduspider](http://www.baidu.com/search/spider.htm) |

## Robots.txt Configuration

### Viewing Your robots.txt

After deploying your application, you can view the generated robots.txt at:
```
https://your-domain.com/robots.txt
```

### Customizing robots.txt

To customize the robots.txt output, modify the `generateRobotsContent` function in:
```
src/app/api/robots/route.ts
```

Example: Adding a custom disallow rule:

```typescript
function generateRobotsContent(baseUrl: string): string {
  return `# Custom robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# AI Crawlers
User-agent: GPTBot
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}
```

## Hosting Provider Setup

### Vercel

Vercel respects the `robots.txt` served by your application by default. No additional configuration is typically needed.

#### Bot Protection Settings

If you've enabled Vercel's [Firewall](https://vercel.com/docs/security/vercel-firewall) or [Attack Challenge Mode](https://vercel.com/docs/security/attack-challenge-mode), you may need to allowlist AI crawler IPs:

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Security** → **Firewall**
3. Create rules to allow known bot User-Agents:

```
# Example Vercel Firewall Rule (vercel.json)
{
  "headers": [
    {
      "source": "/robots.txt",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

#### Environment Variables

Ensure your `SITECORE_EDGE_CONTEXT_ID` and other required environment variables are set in Vercel's project settings.

### Azure (Static Web Apps / App Service)

#### Azure Static Web Apps

Create or update `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/robots.txt",
      "headers": {
        "Cache-Control": "public, max-age=3600"
      }
    },
    {
      "route": "/sitemap.xml",
      "headers": {
        "Cache-Control": "public, max-age=3600"
      }
    }
  ],
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html",
      "statusCode": 404
    }
  }
}
```

#### Azure App Service

For Azure App Service with Node.js, the application handles robots.txt through the Next.js API route. Ensure:

1. The application is configured to run in production mode
2. Environment variables are set in Azure Portal → Configuration → Application settings

#### Azure Front Door / CDN

If using Azure Front Door or Azure CDN, configure rules to:

1. Allow bot traffic through WAF rules
2. Cache robots.txt and sitemap.xml appropriately

```
# Azure Front Door Rules Engine example
Match condition: Request URL path equals /robots.txt
Action: Override cache configuration (1 hour)
```

### Netlify

Netlify serves the dynamically generated robots.txt from your Next.js application.

#### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[headers]]
  for = "/robots.txt"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/sitemap.xml"
  [headers.values]
    Cache-Control = "public, max-age=3600"

# Ensure AI crawlers aren't blocked by Netlify's bot protection
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "all"
```

#### Bot Detection

If you've enabled [Netlify Bot Detection](https://docs.netlify.com/security/bot-detection/), ensure AI crawlers are not being challenged:

1. Go to **Site settings** → **Security** → **Bot detection**
2. Review the settings to ensure legitimate crawlers are allowed

### XM Cloud Rendering Hosts

When deploying to XM Cloud's managed rendering hosts:

1. The robots.txt handler integrates with Sitecore's site configuration
2. Robots rules can be managed through Sitecore's content management interface
3. The API route enhances Sitecore's rules with AI crawler allowances

## Restricting Bot Access

If you need to **block** specific AI crawlers (e.g., for content licensing reasons):

### Option 1: Modify robots.txt Handler

Edit `src/app/api/robots/route.ts` to add disallow rules:

```typescript
function generateRobotsContent(baseUrl: string): string {
  return `# Restrict certain AI crawlers
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

# Allow search engines
User-agent: Googlebot
Allow: /

User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}
```

### Option 2: Environment-Based Configuration

Create environment-specific bot access:

```typescript
// In route.ts
const BLOCKED_BOTS = process.env.BLOCKED_AI_BOTS?.split(',') || [];

function generateRobotsContent(baseUrl: string): string {
  const blockedRules = BLOCKED_BOTS.map(bot => 
    `User-agent: ${bot}\nDisallow: /`
  ).join('\n\n');

  return `# robots.txt
${blockedRules}

User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}
```

Then set the environment variable:
```bash
BLOCKED_AI_BOTS=GPTBot,ClaudeBot,PerplexityBot
```

### Option 3: Hosting Provider Bot Protection

Configure bot blocking at the infrastructure level:

- **Vercel**: Use Firewall rules or Edge Functions
- **Azure**: Configure Azure WAF or Front Door rules
- **Netlify**: Use Edge Functions or serverless functions
- **Cloudflare**: Configure Bot Management rules

## Sitemap Configuration

The sitemap.xml file lists all crawlable pages on your site, helping search engines and AI crawlers discover your content efficiently.

### Sitemap Overview

A properly configured sitemap includes:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2026-01-12</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/products</loc>
    <lastmod>2026-01-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Additional pages... -->
</urlset>
```

### Configuring Sitemap in Sitecore Content Editor

#### Step 1: Configure Site Grouping

Navigate to your site's Site Grouping settings:

```
/sitecore/content/<Tenant>/<Site>/Settings/Site Grouping/<SiteName>
```

Configure these fields:

| Field | Value | Description |
|-------|-------|-------------|
| **Host Name** | `*` | Matches all incoming requests |
| **Target Host Name** | `your-domain.com` | Used for sitemap URLs (NO protocol, NO trailing slash) |
| **Scheme** | `https` | Protocol for URLs |

> ⚠️ **Important**: The Target Host Name must be the domain only, without `https://` prefix or trailing `/`. Incorrect configuration will result in malformed URLs like `https://https://domain.com//`.

#### Step 2: Enable Sitemap/ Sitemap-llm on Pages

Each page needs sitemap settings configured. On page items, set:

| Field | Description | Recommended Value |
|-------|-------------|-------------------|
| **Change Frequency** | How often content changes | `daily`, `weekly`, or `monthly` |
| **Priority** | Page importance (0.0 - 1.0) | `1.0` for home, `0.5` - `0.8` for others |

#### Step 3: Publish to Experience Edge

After configuration:

1. Select the root of your site content
2. **Publish** → **Publish Site**
3. Enable **Smart Publish** and **Publish subitems**
4. Wait 2-5 minutes for Edge cache to refresh

### Troubleshooting Sitemap/ Sitemap-llm Issues

#### Sitemap Only Shows Homepage

- Verify all the pages are approved in the page builder and published to Experience Edge

#### Malformed URLs (https://https://...)

- Remove protocol (`https://`) from Target Host Name field
- Remove trailing slash from Target Host Name field
- Republish the Site Grouping item

#### Sitemap Returns 404

- Verify Host Name and Target Host Name are configured
- Check that the site is published to Experience Edge
- Ensure the sitemap API route exists at `/api/sitemap/route.ts`

#### Changes Not Appearing

- Clear Experience Edge cache in XM Cloud Deploy Portal
- Wait 2-5 minutes for cache to expire
- Force refresh with `Ctrl + Shift + R` in browser

## Testing Crawler Access

### Online Testing Tools

1. **Google Search Console** - [URL Inspection Tool](https://search.google.com/search-console)
2. **Bing Webmaster Tools** - [URL Inspection](https://www.bing.com/webmasters)
3. **robots.txt Tester** - [Google robots.txt Tester](https://www.google.com/webmasters/tools/robots-testing-tool)

### Command Line Testing

```bash
# Fetch robots.txt
curl -A "GPTBot" https://your-domain.com/robots.txt

# Test specific User-Agent
curl -A "ClaudeBot" -I https://your-domain.com/

# Verify sitemap
curl https://your-domain.com/sitemap.xml
```

### AI Crawler Simulation

Test how AI crawlers see your content:

```bash
# Simulate GPTBot
curl -H "User-Agent: Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 GPTBot/1.0" https://your-domain.com/

# Simulate ClaudeBot  
curl -H "User-Agent: ClaudeBot/1.0" https://your-domain.com/

# Simulate PerplexityBot
curl -H "User-Agent: PerplexityBot" https://your-domain.com/
```

## References

### AI Crawler Documentation

- **OpenAI GPTBot**: https://platform.openai.com/docs/bots/gptbot
- **OpenAI Bots Overview**: https://platform.openai.com/docs/bots
- **Anthropic ClaudeBot**: https://docs.anthropic.com/en/docs/claude-bot
- **Perplexity PerplexityBot**: https://www.perplexity.ai/blog/perplexitybot
- **Google AI Crawlers**: https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers

### Search Engine Documentation

- **Google Robots.txt**: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- **Bing Robots.txt**: https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec
- **Robots.txt Specification**: https://www.robotstxt.org/

### Hosting Provider Documentation

- **Vercel Security**: https://vercel.com/docs/security
- **Netlify Bot Detection**: https://docs.netlify.com/security/bot-detection/
- **Azure Static Web Apps**: https://docs.microsoft.com/azure/static-web-apps/
- **Azure App Service**: https://docs.microsoft.com/azure/app-service/

### SEO Best Practices

- **Google SEO Starter Guide**: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- **Schema.org**: https://schema.org/
- **Structured Data Testing**: https://search.google.com/test/rich-results
