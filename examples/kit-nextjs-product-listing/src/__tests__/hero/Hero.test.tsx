/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as HeroDefault,
  ImageBottom,
  ImageBottomInset,
  ImageBackground,
  ImageRight,
} from '../../components/hero/Hero';
import {
  defaultHeroProps,
  heroPropsNoFields,
  heroPropsMinimal,
  heroPropsWithoutBanner,
  heroPropsEditing,
} from './Hero.mockProps';

// Mock the Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag = 'span', className }: any) => {
    const f = field;
    if (!f?.value) return null;
    return React.createElement(tag, { className }, f.value);
  },
  Image: ({ field, className, alt }: any) => {
    const f = field;
    if (!f?.value?.src) return null;
    return React.createElement('img', {
      src: f.value.src,
      alt: f.value.alt || alt,
      className,
      'data-testid': 'sitecore-image',
    });
  },
  Link: ({ field, children, className }: any) => {
    const f = field;
    if (!f?.value?.href) return React.createElement(React.Fragment, {}, children);
    return React.createElement('a', { href: f.value.href, className }, children || f.value.text);
  },
  useSitecore: jest.fn(() => ({ page: { mode: { isEditing: false } } })),
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

// Mock next-intl for ESM module support
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      Demo2_Hero_SubmitCTALabel: 'Find Store',
      Demo2_Hero_ZipPlaceholder: 'Enter ZIP code',
      HERO_SubmitCTALabel: 'Find Store',
      HERO_ZipPlaceholder: 'Enter ZIP code',
    };
    return translations[key] || key;
  },
  useLocale: () => 'en',
  useTimeZone: () => 'UTC',
  useFormatter: () => ({
    dateTime: jest.fn(),
    number: jest.fn(),
    relativeTime: jest.fn(),
    plural: jest.fn(),
    select: jest.fn(),
    selectOrdinal: jest.fn(),
    list: jest.fn(),
  }),
  IntlProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

// Mock the hero components
jest.mock('../../components/hero/HeroDefault.dev', () => ({
  HeroDefault: ({ fields, isPageEditing }: any) => {
    return (
      <section data-testid="hero-default">
        <div data-testid="hero-content">
          {fields?.title?.value && <h1 data-testid="hero-title">{fields.title.value}</h1>}

          {fields?.description?.value && (
            <p data-testid="hero-description">{fields.description.value}</p>
          )}

          {fields?.image?.value?.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fields.image.value.src}
              alt={fields.image.value.alt}
              data-testid="hero-image"
            />
          )}

          {fields?.bannerText?.value && (
            <div data-testid="hero-banner">
              <span data-testid="banner-text">{fields.bannerText.value}</span>
              {fields?.bannerCTA?.value?.href && (
                <a href={fields.bannerCTA.value.href} data-testid="banner-cta">
                  {fields.bannerCTA.value.text}
                </a>
              )}
            </div>
          )}

          {fields?.searchLink?.value?.href && (
            <a href={fields.searchLink.value.href} data-testid="hero-search-link">
              {fields.searchLink.value.text}
            </a>
          )}

          {fields?.dictionary && (
            <div data-testid="hero-dictionary">
              <span data-testid="submit-label">{fields.dictionary.SubmitCTALabel}</span>
              <span data-testid="zip-placeholder">{fields.dictionary.ZipPlaceholder}</span>
            </div>
          )}

          <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
        </div>
      </section>
    );
  },
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

// Mock all hero variant components
jest.mock('../../components/hero/HeroImageBottom.dev', () => ({
  HeroImageBottom: ({ fields, isPageEditing }: any) => {
    return (
      <section data-testid="hero-image-bottom">
        <div data-testid="hero-content">
          {fields?.title?.value && <h1 data-testid="hero-title">{fields.title.value}</h1>}
          {fields?.dictionary && (
            <div data-testid="hero-dictionary">
              <span data-testid="submit-label">{fields.dictionary.SubmitCTALabel}</span>
            </div>
          )}
          <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
        </div>
      </section>
    );
  },
}));

jest.mock('../../components/hero/HeroImageBottomInset.dev', () => ({
  HeroImageBottomInset: ({ fields, isPageEditing }: any) => {
    return (
      <section data-testid="hero-image-bottom-inset">
        <div data-testid="hero-content">
          {fields?.title?.value && <h1 data-testid="hero-title">{fields.title.value}</h1>}
          {fields?.dictionary && (
            <div data-testid="hero-dictionary">
              <span data-testid="submit-label">{fields.dictionary.SubmitCTALabel}</span>
            </div>
          )}
          <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
        </div>
      </section>
    );
  },
}));

jest.mock('../../components/hero/HeroImageBackground.dev', () => ({
  HeroImageBackground: ({ fields, isPageEditing }: any) => {
    return (
      <section data-testid="hero-image-background">
        <div data-testid="hero-content">
          {fields?.title?.value && <h1 data-testid="hero-title">{fields.title.value}</h1>}
          {fields?.dictionary && (
            <div data-testid="hero-dictionary">
              <span data-testid="submit-label">{fields.dictionary.SubmitCTALabel}</span>
            </div>
          )}
          <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
        </div>
      </section>
    );
  },
}));

jest.mock('../../components/hero/HeroImageRight.dev', () => ({
  HeroImageRight: ({ fields, isPageEditing }: any) => {
    return (
      <section data-testid="hero-image-right">
        <div data-testid="hero-content">
          {fields?.title?.value && <h1 data-testid="hero-title">{fields.title.value}</h1>}
          {fields?.dictionary && (
            <div data-testid="hero-dictionary">
              <span data-testid="submit-label">{fields.dictionary.SubmitCTALabel}</span>
            </div>
          )}
          <span data-testid="editing-mode">{isPageEditing ? 'editing' : 'normal'}</span>
        </div>
      </section>
    );
  },
}));

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Variant', () => {
    it('renders complete hero structure with all content', () => {
      render(<HeroDefault {...defaultHeroProps} />);

      // Main structure
      expect(screen.getByTestId('hero-default')).toBeInTheDocument();
      expect(screen.getByTestId('hero-content')).toBeInTheDocument();

      // Content elements
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Experience Premium Audio');
      expect(screen.getByTestId('hero-description')).toHaveTextContent(
        'Discover our premium collection'
      );

      // Image
      const heroImage = screen.getByTestId('hero-image');
      expect(heroImage).toHaveAttribute('src', '/hero-image.jpg');
      expect(heroImage).toHaveAttribute('alt', 'Premium Audio Equipment');
    });

    it('renders interactive elements correctly', () => {
      render(<HeroDefault {...defaultHeroProps} />);

      // Banner with CTA
      const banner = screen.getByTestId('hero-banner');
      expect(banner).toBeInTheDocument();

      const bannerText = screen.getByTestId('banner-text');
      expect(bannerText).toHaveTextContent('New Collection Available');

      const bannerCTA = screen.getByTestId('banner-cta');
      expect(bannerCTA).toHaveTextContent('Shop Now');
      expect(bannerCTA).toHaveAttribute('href', '/products/new');

      // Search link
      const searchLink = screen.getByTestId('hero-search-link');
      expect(searchLink).toHaveTextContent('Find Store');
      expect(searchLink).toHaveAttribute('href', '/search');
    });

    it('includes localized dictionary content', () => {
      render(<HeroDefault {...defaultHeroProps} />);

      const dictionary = screen.getByTestId('hero-dictionary');
      expect(dictionary).toBeInTheDocument();

      expect(screen.getByTestId('submit-label')).toHaveTextContent('Find Store');
      expect(screen.getByTestId('zip-placeholder')).toHaveTextContent('Enter ZIP code');
    });
  });

  describe('Content Scenarios', () => {
    it('handles empty fields gracefully', () => {
      render(<HeroDefault {...heroPropsNoFields} />);

      expect(screen.getByTestId('hero-default')).toBeInTheDocument();
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('normal');
    });

    it('renders with essential content only', () => {
      render(<HeroDefault {...heroPropsMinimal} />);

      expect(screen.getByTestId('hero-default')).toBeInTheDocument();

      const title = screen.getByTestId('hero-title');
      expect(title).toHaveTextContent('Experience Premium Audio');

      // Image is empty in minimal props to avoid Next.js validation issues
      expect(screen.queryByTestId('hero-image')).not.toBeInTheDocument();
    });

    it('adapts when banner is not configured', () => {
      render(<HeroDefault {...heroPropsWithoutBanner} />);

      expect(screen.getByTestId('hero-default')).toBeInTheDocument();
      expect(screen.getByTestId('hero-title')).toBeInTheDocument();
      expect(screen.getByTestId('hero-description')).toBeInTheDocument();

      // Banner should not be present
      expect(screen.queryByTestId('hero-banner')).not.toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    it('indicates editing state correctly', () => {
      // Test editing mode
      const { unmount: unmountEditing } = render(<HeroDefault {...heroPropsEditing} />);
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('editing');
      unmountEditing();

      // Test normal mode
      render(<HeroDefault {...defaultHeroProps} />);
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('normal');
    });
  });

  describe('Hero Variants', () => {
    it('renders ImageBottom variant correctly', () => {
      render(<ImageBottom {...defaultHeroProps} />);

      expect(screen.getByTestId('hero-image-bottom')).toBeInTheDocument();
      expect(screen.getByTestId('hero-content')).toBeInTheDocument();
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Experience Premium Audio');
      expect(screen.getByTestId('hero-dictionary')).toBeInTheDocument();
      expect(screen.getByTestId('submit-label')).toHaveTextContent('Find Store');
    });

    it('renders ImageBottom variant in editing mode', () => {
      render(<ImageBottom {...heroPropsEditing} />);

      expect(screen.getByTestId('hero-image-bottom')).toBeInTheDocument();
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('editing');
    });

    it('renders ImageBottom variant with no fields', () => {
      render(<ImageBottom {...heroPropsNoFields} />);

      expect(screen.getByTestId('hero-image-bottom')).toBeInTheDocument();
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('normal');
    });

    it('renders ImageBottomInset variant correctly', () => {
      render(<ImageBottomInset {...defaultHeroProps} />);

      expect(screen.getByTestId('hero-image-bottom-inset')).toBeInTheDocument();
      expect(screen.getByTestId('hero-content')).toBeInTheDocument();
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Experience Premium Audio');
      expect(screen.getByTestId('hero-dictionary')).toBeInTheDocument();
      expect(screen.getByTestId('submit-label')).toHaveTextContent('Find Store');
    });

    it('renders ImageBottomInset variant in editing mode', () => {
      render(<ImageBottomInset {...heroPropsEditing} />);

      expect(screen.getByTestId('hero-image-bottom-inset')).toBeInTheDocument();
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('editing');
    });

    it('renders ImageBottomInset variant with no fields', () => {
      render(<ImageBottomInset {...heroPropsNoFields} />);

      expect(screen.getByTestId('hero-image-bottom-inset')).toBeInTheDocument();
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('normal');
    });

    it('renders ImageBackground variant correctly', () => {
      render(<ImageBackground {...defaultHeroProps} />);

      expect(screen.getByTestId('hero-image-background')).toBeInTheDocument();
      expect(screen.getByTestId('hero-content')).toBeInTheDocument();
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Experience Premium Audio');
      expect(screen.getByTestId('hero-dictionary')).toBeInTheDocument();
      expect(screen.getByTestId('submit-label')).toHaveTextContent('Find Store');
    });

    it('renders ImageBackground variant in editing mode', () => {
      render(<ImageBackground {...heroPropsEditing} />);

      expect(screen.getByTestId('hero-image-background')).toBeInTheDocument();
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('editing');
    });

    it('renders ImageBackground variant with no fields', () => {
      render(<ImageBackground {...heroPropsNoFields} />);

      expect(screen.getByTestId('hero-image-background')).toBeInTheDocument();
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('normal');
    });

    it('renders ImageRight variant correctly', () => {
      render(<ImageRight {...defaultHeroProps} />);

      expect(screen.getByTestId('hero-image-right')).toBeInTheDocument();
      expect(screen.getByTestId('hero-content')).toBeInTheDocument();
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Experience Premium Audio');
      expect(screen.getByTestId('hero-dictionary')).toBeInTheDocument();
      expect(screen.getByTestId('submit-label')).toHaveTextContent('Find Store');
    });

    it('renders ImageRight variant in editing mode', () => {
      render(<ImageRight {...heroPropsEditing} />);

      expect(screen.getByTestId('hero-image-right')).toBeInTheDocument();
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('editing');
    });

    it('renders ImageRight variant with no fields', () => {
      render(<ImageRight {...heroPropsNoFields} />);

      expect(screen.getByTestId('hero-image-right')).toBeInTheDocument();
      expect(screen.getByTestId('editing-mode')).toHaveTextContent('normal');
    });

    it('passes dictionary to all variants', () => {
      // Test each variant receives and displays dictionary
      const variants = [
        { Component: ImageBottom, testId: 'hero-image-bottom' },
        { Component: ImageBottomInset, testId: 'hero-image-bottom-inset' },
        { Component: ImageBackground, testId: 'hero-image-background' },
        { Component: ImageRight, testId: 'hero-image-right' },
      ];

      variants.forEach(({ Component, testId }) => {
        const { unmount } = render(<Component {...defaultHeroProps} />);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        expect(screen.getByTestId('hero-dictionary')).toBeInTheDocument();
        unmount();
      });
    });

    it('passes isPageEditing prop to all variants', () => {
      const variants = [
        { Component: ImageBottom, testId: 'hero-image-bottom' },
        { Component: ImageBottomInset, testId: 'hero-image-bottom-inset' },
        { Component: ImageBackground, testId: 'hero-image-background' },
        { Component: ImageRight, testId: 'hero-image-right' },
      ];

      variants.forEach(({ Component, testId }) => {
        const { unmount } = render(<Component {...defaultHeroProps} />);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        expect(screen.getByTestId('editing-mode')).toHaveTextContent('normal');
        unmount();
      });
    });

    it('has all variant exports defined', () => {
      expect(ImageBottom).toBeDefined();
      expect(ImageBottomInset).toBeDefined();
      expect(ImageBackground).toBeDefined();
      expect(ImageRight).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('maintains semantic section structure', () => {
      render(<HeroDefault {...defaultHeroProps} />);

      const hero = screen.getByTestId('hero-default');
      expect(hero.tagName.toLowerCase()).toBe('section');
    });
  });
});
