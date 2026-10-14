import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as LogoCloud } from '../../components/component-library/logo-cloud';
import { IGQLImageField, IGQLLinkField, IGQLRichTextField, IGQLTextField } from '@/lib/component-props';
import type { Page } from '@sitecore-content-sdk/nextjs';

/**
 * Mock page object for normal mode
 */
const mockPageNormal = {
  mode: {
    isEditing: false,
    isNormal: true,
    isPreview: false,
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

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="logo-image"
      src={field?.jsonValue?.value?.src}
      alt={field?.jsonValue?.value?.alt}
      className={className}
    />
  ),
  Text: ({ field }: any) => <span data-testid="logo-text">{field?.jsonValue?.value}</span>,
  RichText: ({ field }: any) => (
    <div
      data-testid="logo-richtext"
      dangerouslySetInnerHTML={{ __html: field?.jsonValue?.value || '' }}
    />
  ),
  Link: ({ field }: any) => (
    <a data-testid="logo-link" href={field?.jsonValue?.value?.href}>
      {field?.jsonValue?.value?.text}
    </a>
  ),
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
}));

// Mock shadcn Button
jest.mock('shadcd/components/ui/button', () => ({
  Button: ({ children, className, variant }: any) => (
    <button data-testid="logo-button" className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ArrowRight: ({ className }: any) => <span data-testid="arrow-right" className={className} />,
}));

const defaultProps = {
  rendering: {
    componentName: 'LogoCloud',
    params: {},
  },
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            {
              logoImage: {
                jsonValue: {
                  value: { src: '/logo1.jpg', alt: 'Logo 1', width: 200, height: 100 },
                },
              } as IGQLImageField,
              logoLink: {
                jsonValue: {
                  value: { href: 'https://company1.com', text: 'Company 1', title: 'Company 1' },
                },
              } as IGQLLinkField,
            },
          ],
        },
        title: {
          jsonValue: { value: 'Trusted Partners' },
        } as IGQLTextField,
        bodyText: {
          jsonValue: { value: '<p>Leading companies trust us.</p>' },
        } as IGQLRichTextField,
        link1: {
          jsonValue: {
            value: { href: '/start', text: 'Get Started', title: 'Get Started' },
          },
        } as IGQLLinkField,
        link2: {
          jsonValue: {
            value: { href: '/learn', text: 'Learn More', title: 'Learn More' },
          },
        } as IGQLLinkField,
      },
    },
  },
  page: mockPageNormal,
};

describe('LogoCloud', () => {
  it('renders without crashing', () => {
    const { container } = render(<LogoCloud {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders logo images', () => {
    render(<LogoCloud {...defaultProps} />);
    const images = screen.getAllByTestId('logo-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders CTA buttons', () => {
    render(<LogoCloud {...defaultProps} />);
    const buttons = screen.getAllByTestId('logo-button');
    expect(buttons).toHaveLength(2);
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-style' },
    };
    const { container } = render(<LogoCloud {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-style');
  });
});
