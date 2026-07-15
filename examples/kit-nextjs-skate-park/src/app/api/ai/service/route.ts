import { aiJsonResponse } from '@/lib/ai-json-response';

export const revalidate = 3600;

interface Service {
  name: string;
  description: string;
  category: string;
}

interface ServiceResponse {
  services: Service[];
  lastModified: string;
}

const services: Service[] = [
  {
    name: 'Component Showcase',
    description:
      'Explore and learn from a variety of pre-built components demonstrating XM Cloud integration patterns.',
    category: 'Development',
  },
  {
    name: 'Starter Kit Scaffolding',
    description:
      'Provides a ready-to-use Next.js App Router project template for rapid XM Cloud development.',
    category: 'Development',
  },
  {
    name: 'Multi-Locale Content Delivery',
    description:
      'Deliver localized content in multiple languages (English and Canadian English) with automatic locale detection.',
    category: 'Localization',
  },
  {
    name: 'XM Cloud Content Integration',
    description:
      'Seamlessly integrate with Sitecore XM Cloud for headless content management and delivery using the Content SDK.',
    category: 'Content Delivery',
  },
  {
    name: 'Component-Based Page Building',
    description:
      'Build pages using modular, reusable components with multiple layout variants and styling options.',
    category: 'Development',
  },
  {
    name: 'Responsive Image Optimization',
    description:
      'Automatically optimize and serve images in modern formats with responsive sizing for optimal performance.',
    category: 'Performance',
  },
  {
    name: 'SEO Metadata Management',
    description:
      'Manage page titles, descriptions, and Open Graph metadata for improved search engine visibility.',
    category: 'SEO',
  },
  {
    name: 'Content Preview and Editing',
    description:
      'Preview content changes in real-time with integrated XM Cloud editing experience support.',
    category: 'Content Management',
  },
];

export async function GET() {
  const response: ServiceResponse = {
    services,
    lastModified: new Date().toISOString(),
  };

  return aiJsonResponse(response, {
    maxAge: 3600,
    sMaxAge: 3600,
    staleWhileRevalidate: 86400,
  });
}
