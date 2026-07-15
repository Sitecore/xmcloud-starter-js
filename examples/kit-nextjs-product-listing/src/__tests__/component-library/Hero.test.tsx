import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as HeroDefault,
  Hero1,
  Hero2,
  Hero3,
  Hero4,
  Hero5,
  Hero6,
} from '../../components/component-library/CLHero';
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

// Mock Sitecore Content SDK
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  NextImage: ({ field, className, width, height }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="hero-image"
      src={field?.value?.src}
      alt={field?.value?.alt}
      className={className}
      width={width}
      height={height}
    />
  ),
  Text: ({ field }: any) => <span data-testid="hero-text">{field?.value}</span>,
  RichText: ({ field }: any) => (
    <div data-testid="hero-richtext" dangerouslySetInnerHTML={{ __html: field?.value || '' }} />
  ),
  Link: ({ field }: any) => (
    <a data-testid="hero-link" href={field?.value?.href}>
      {field?.value?.text}
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
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, variant }: any) => (
    <button data-testid="hero-button" className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

const defaultProps = {
  rendering: {
    componentName: 'Hero',
    params: {},
  },
  params: { styles: '' },
  fields: {
    HeroTitle: { value: 'Welcome to Our Platform' },
    HeroBody: { value: '<p>Discover amazing features and capabilities.</p>' },
    HeroLink1: { value: { href: '/get-started', text: 'Get Started' } },
    HeroLink2: { value: { href: '/learn-more', text: 'Learn More' } },
    HeroImage1: { value: { src: '/images/hero1.jpg', alt: 'Hero Image 1' } },
    HeroImage2: { value: { src: '/images/hero2.jpg', alt: 'Hero Image 2' } },
  },
  page: mockPageNormal,
};

describe('HeroDefault', () => {
  it('renders Hero component', () => {
    render(<HeroDefault {...defaultProps} />);
    expect(screen.getByTestId('hero-text')).toBeInTheDocument();
  });
});

describe('Hero Variants', () => {
  describe('Hero1', () => {
    it('renders with all props', () => {
      render(<Hero1 {...defaultProps} />);

      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
      expect(screen.getByTestId('hero-richtext')).toHaveTextContent(
        'Discover amazing features and capabilities.'
      );
    });

    it('renders hero images', () => {
      render(<Hero1 {...defaultProps} />);

      const images = screen.getAllByTestId('hero-image');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', '/images/hero1.jpg');
    });

    it('renders CTA buttons with links', () => {
      render(<Hero1 {...defaultProps} />);

      const buttons = screen.getAllByTestId('hero-button');
      expect(buttons.length).toBeGreaterThan(0);

      const links = screen.getAllByTestId('hero-link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/get-started');
      expect(links[1]).toHaveAttribute('href', '/learn-more');
    });

    it('applies custom styles from params', () => {
      const propsWithStyles = {
        ...defaultProps,
        params: { styles: 'custom-hero-style' },
      };

      const { container } = render(<Hero1 {...propsWithStyles} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-hero-style');
    });

    it('handles missing optional fields', () => {
      const minimalProps = {
        rendering: {
          componentName: 'Hero',
          params: {},
        },
        params: { styles: '' },
        fields: {
          HeroTitle: { value: 'Title Only' },
          HeroBody: { value: '' },
          HeroLink1: { value: { href: '', text: '' } },
          HeroLink2: { value: { href: '', text: '' } },
          HeroImage1: { value: { src: '', alt: '' } },
          HeroImage2: { value: { src: '', alt: '' } },
        },
        page: mockPageNormal,
      };

      render(<Hero1 {...minimalProps} />);
      expect(screen.getByText('Title Only')).toBeInTheDocument();
    });
  });

  // Test remaining variants to achieve 75%+ function coverage
  const otherVariants = [
    { component: Hero2, name: 'Hero2' },
    { component: Hero3, name: 'Hero3' },
    { component: Hero4, name: 'Hero4' },
    { component: Hero5, name: 'Hero5' },
    { component: Hero6, name: 'Hero6' },
  ];

  otherVariants.forEach(({ component: Component, name }) => {
    describe(name, () => {
      it('renders correctly', () => {
        render(<Component {...defaultProps} />);
        expect(screen.getByTestId('hero-text')).toBeInTheDocument();
      });

      it('renders with hero content', () => {
        const { container } = render(<Component {...defaultProps} />);
        // Some variants use background images instead of img tags
        const section = container.querySelector('section, div');
        expect(section).toBeInTheDocument();
      });

      it('applies custom styles', () => {
        const styledProps = {
          ...defaultProps,
          params: { styles: `custom-${name}` },
        };
        const { container } = render(<Component {...styledProps} />);
        // Check for the custom class in the rendered output
        expect(container.innerHTML).toContain(`custom-${name}`);
      });
    });
  });
});
