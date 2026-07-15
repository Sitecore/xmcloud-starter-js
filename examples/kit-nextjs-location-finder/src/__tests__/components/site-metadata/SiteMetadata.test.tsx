import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as SiteMetadata } from '@/components/site-metadata/SiteMetadata';
import { Page } from '@sitecore-content-sdk/nextjs';

// Test props use type assertions for edge case testing where invalid data is intentionally passed

// Mock page object with all required Page properties
const mockPageBase = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

describe('SiteMetadata Component', () => {
  const mockRendering = { componentName: 'SiteMetadata' };

  beforeEach(() => {
    // Clear any preconnect links from previous tests (in container or head)
    document.head.querySelectorAll('link[rel="preconnect"]').forEach((el) => el.remove());
  });

  it('renders preconnect link when fields are provided', () => {
    const props = {
      fields: {
        title: { value: 'Page Title' },
        metadataTitle: { value: 'Meta Title' },
        metadataKeywords: { value: 'keyword1, keyword2, keyword3' },
        metadataDescription: { value: 'Page meta description for SEO' },
      },
      params: {},
      rendering: mockRendering,
      page: mockPageBase,
    };

    const { container } = render(<SiteMetadata {...props} />);

    // Component only renders preconnect link; title/meta are handled by generateMetadata() in page.tsx.
    const preconnectLink =
      container.querySelector('link[rel="preconnect"]') ||
      document.head.querySelector('link[rel="preconnect"]');
    expect(preconnectLink).toBeInTheDocument();
    expect(preconnectLink).toHaveAttribute('href', 'https://fonts.googleapis.com');
  });

  it('renders preconnect link with minimal fields', () => {
    const props = {
      fields: {
        title: { value: 'Fallback Title' },
      },
      params: {},
      rendering: mockRendering,
      page: mockPageBase,
    };

    const { container } = render(<SiteMetadata {...props} />);
    const preconnectLink =
      container.querySelector('link[rel="preconnect"]') ||
      document.head.querySelector('link[rel="preconnect"]');
    expect(preconnectLink).toBeInTheDocument();
    expect(preconnectLink).toHaveAttribute('href', 'https://fonts.googleapis.com');
  });

  it('renders NoDataFallback when fields are missing', () => {
    const props = {
      fields: undefined,
      params: {},
      rendering: mockRendering,
      page: mockPageBase,
    };

    render(<SiteMetadata {...(props as unknown as React.ComponentProps<typeof SiteMetadata>)} />);
    expect(screen.getByText(/Site Metadata/i)).toBeInTheDocument();
  });

  it('renders preconnect link when only metadata fields are provided', () => {
    const props = {
      fields: {
        metadataTitle: { value: 'SEO Title' },
        metadataKeywords: { value: 'seo, react, testing' },
        metadataDescription: { value: 'SEO optimized description' },
      },
      params: {},
      rendering: mockRendering,
      page: mockPageBase,
    };

    const { container } = render(<SiteMetadata {...props} />);
    const preconnectLink =
      container.querySelector('link[rel="preconnect"]') ||
      document.head.querySelector('link[rel="preconnect"]');
    expect(preconnectLink).toBeInTheDocument();
    expect(preconnectLink).toHaveAttribute('href', 'https://fonts.googleapis.com');
  });

  it('renders preconnect link when optional metadata fields are empty', () => {
    const props = {
      fields: {
        title: { value: 'Title Only' },
        metadataKeywords: { value: '' },
        metadataDescription: { value: '' },
      },
      params: {},
      rendering: mockRendering,
      page: mockPageBase,
    };

    const { container } = render(<SiteMetadata {...props} />);
    const preconnectLink =
      container.querySelector('link[rel="preconnect"]') ||
      document.head.querySelector('link[rel="preconnect"]');
    expect(preconnectLink).toBeInTheDocument();
  });

  it('handles empty field values without throwing', () => {
    const props = {
      fields: {
        title: { value: undefined },
        metadataTitle: { value: undefined },
        metadataKeywords: { value: undefined },
        metadataDescription: { value: undefined },
      },
      params: {},
      rendering: mockRendering,
      page: mockPageBase,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => render(<SiteMetadata {...(props as any)} />)).not.toThrow();
  });
});
