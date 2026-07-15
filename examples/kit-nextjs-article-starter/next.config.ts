import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',
  
  // Enable React Strict Mode
  reactStrictMode: true,

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,

  // Enable source maps for production (helps with debugging and PageSpeed Insights)
  // Set to 'hidden-source-map' to generate source maps but not expose them publicly
  // This satisfies PageSpeed Insights while maintaining security
  productionBrowserSourceMaps: process.env.GENERATE_SOURCEMAP === 'true',

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    // Enable modern image formats (WebP, AVIF) for better compression
    formats: ['image/avif', 'image/webp'],
    // Optimize image sizes for responsive loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.sitecore-staging.cloud',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.sitecorecloud.io',
        port: '',
      },
    ],
    // Disable image optimization in development to avoid upstream timeouts
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Sitemap, robots, and AI JSON endpoints via rewrites; handlers live under app/api/
  rewrites: async () => {
    return [
      {
        // sitemap.xml serves the main sitemap
        source: '/sitemap.xml',
        destination: '/api/sitemap',
        locale: false,
      },
      {
        // Numbered sitemap index pages (e.g. /sitemap-0.xml, /sitemap-1.xml)
        source: '/sitemap-:id(\\d+).xml',
        destination: '/api/sitemap',
        locale: false,
      },
      {
        // LLM-optimized sitemap for AI crawler ingestion
        source: '/sitemap-llm.xml',
        destination: '/api/sitemap-llm',
        locale: false,
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
        locale: false,
      },
      {
        source: '/llms.txt',
        destination: '/api/llms-txt',
        locale: false,
      },
      {
        source: '/ai/summary.json',
        destination: '/api/ai/summary',
        locale: false,
      },
      {
        source: '/ai/faq.json',
        destination: '/api/ai/faq',
        locale: false,
      },
      {
        source: '/ai/service.json',
        destination: '/api/ai/service',
        locale: false,
      },
      {
        source: '/ai/markdown/:path*',
        destination: '/api/ai/markdown/:path*',
        locale: false,
      },
      {
        source: '/.well-known/ai.txt',
        destination: '/api/well-known/ai-txt',
        locale: false,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
