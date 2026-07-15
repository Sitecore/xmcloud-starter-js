/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as TextBannerDefault,
  TextBanner01,
  TextBanner02,
  TextTop,
  BlueTitleRight,
} from '../../components/text-banner/TextBanner';
import {
  defaultTextBannerProps,
  textBannerPropsMinimal,
  textBannerPropsNoDescription,
  textBannerPropsPositionCenter,
  textBannerPropsPositionRight,
  textBannerPropsLongContent,
  textBannerPropsSpecialChars,
  textBannerPropsEmptyFields,
  textBannerPropsNoFields,
  textBannerPropsUndefinedHeading,
  textBannerPropsNoStyles,
  textBannerPropsCustomTheme,
  textBannerPropsMultipleStyles,
  mockUseSitecoreNormal,
  mockUseSitecoreEditing,
} from './TextBanner.mockProps';
import { mockPageEditing } from '../test-utils/mockPage';

// Mock Sitecore Content SDK
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag: Tag = 'div', className }: any) => (
    <Tag data-testid="sitecore-text" className={className} data-field-value={field?.value || ''}>
      {field?.value || 'Sitecore Text'}
    </Tag>
  ),
}));

// Mock TextBanner variant components
jest.mock('../../components/text-banner/TextBannerDefault.dev', () => ({
  TextBannerDefault: ({ fields, isPageEditing, params }: any) => (
    <div
      data-testid="text-banner-default"
      data-editing={isPageEditing?.toString()}
      data-styles={params?.styles || ''}
      data-theme={params?.theme || ''}
    >
      <div data-testid="banner-heading">{fields?.heading?.value || 'Default Banner'}</div>
      {fields?.description && (
        <div data-testid="banner-description">{fields.description.value}</div>
      )}
    </div>
  ),
}));

jest.mock('../../components/text-banner/TextBannerTextTop.dev', () => ({
  TextBannerTextTop: ({ fields, isPageEditing, params }: any) => (
    <div
      data-testid="text-banner-text-top"
      data-editing={isPageEditing?.toString()}
      data-styles={params?.styles || ''}
    >
      <div data-testid="banner-heading">{fields?.heading?.value || 'Text Top Banner'}</div>
      {fields?.description && (
        <div data-testid="banner-description">{fields.description.value}</div>
      )}
    </div>
  ),
}));

jest.mock('../../components/text-banner/TextBannerBlueTitleRight.dev', () => ({
  TextBannerBlueTitleRight: ({ fields, isPageEditing, params }: any) => (
    <div
      data-testid="text-banner-blue-title-right"
      data-editing={isPageEditing?.toString()}
      data-styles={params?.styles || ''}
    >
      <div data-testid="banner-heading">{fields?.heading?.value || 'Blue Title Right Banner'}</div>
      {fields?.description && (
        <div data-testid="banner-description">{fields.description.value}</div>
      )}
    </div>
  ),
}));

jest.mock('../../components/text-banner/TextBanner01.dev', () => ({
  TextBanner01: ({ fields, isPageEditing, params }: any) => (
    <div
      data-testid="text-banner-01"
      data-editing={isPageEditing?.toString()}
      data-styles={params?.styles || ''}
    >
      <div data-testid="banner-heading">{fields?.heading?.value || 'Banner Variant 01'}</div>
      {fields?.description && (
        <div data-testid="banner-description">{fields.description.value}</div>
      )}
    </div>
  ),
}));

jest.mock('../../components/text-banner/TextBanner02.dev', () => ({
  TextBanner02: ({ fields, isPageEditing, params }: any) => (
    <div
      data-testid="text-banner-02"
      data-editing={isPageEditing?.toString()}
      data-styles={params?.styles || ''}
    >
      <div data-testid="banner-heading">{fields?.heading?.value || 'Banner Variant 02'}</div>
      {fields?.description && (
        <div data-testid="banner-description">{fields.description.value}</div>
      )}
    </div>
  ),
}));

describe('TextBanner Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockUseSitecoreNormal);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Default Variant', () => {
    it('renders default text banner with complete content', () => {
      render(<TextBannerDefault {...defaultTextBannerProps} />);

      expect(screen.getByTestId('text-banner-default')).toBeInTheDocument();
      expect(screen.getByText('Transform Your Audio Experience')).toBeInTheDocument();
      expect(screen.getByText(/Discover the pinnacle of sound engineering/)).toBeInTheDocument();
    });

    it('passes correct props to variant component', () => {
      render(<TextBannerDefault {...defaultTextBannerProps} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute('data-editing', 'false');
      expect(bannerElement).toHaveAttribute(
        'data-styles',
        'position-left custom-text-banner-styles'
      );
      expect(bannerElement).toHaveAttribute('data-theme', 'primary');
    });

    it('handles minimal props configuration', () => {
      render(<TextBannerDefault {...textBannerPropsMinimal} />);

      expect(screen.getByText('Professional Audio Equipment')).toBeInTheDocument();
      expect(screen.queryByTestId('banner-description')).not.toBeInTheDocument();
    });

    it('handles missing description gracefully', () => {
      render(<TextBannerDefault {...textBannerPropsNoDescription} />);

      expect(screen.getByText('Quality Sound Solutions')).toBeInTheDocument();
      expect(screen.queryByTestId('banner-description')).not.toBeInTheDocument();
    });

    it('passes editing state correctly', () => {
      render(<TextBannerDefault {...defaultTextBannerProps} page={mockPageEditing} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute('data-editing', 'true');
    });
  });

  describe('TextBanner01 Variant', () => {
    it('renders TextBanner01 variant with complete content', () => {
      render(<TextBanner01 {...defaultTextBannerProps} />);

      expect(screen.getByTestId('text-banner-01')).toBeInTheDocument();
      expect(screen.getByText('Transform Your Audio Experience')).toBeInTheDocument();
      expect(screen.getByText(/Discover the pinnacle of sound engineering/)).toBeInTheDocument();
    });

    it('passes correct props to TextBanner01 component', () => {
      render(<TextBanner01 {...textBannerPropsPositionCenter} />);

      const bannerElement = screen.getByTestId('text-banner-01');
      expect(bannerElement).toHaveAttribute('data-editing', 'false');
      expect(bannerElement).toHaveAttribute(
        'data-styles',
        'position-center premium-styling bg-dark'
      );
    });

    it('handles editing state correctly in TextBanner01', () => {
      render(<TextBanner01 {...defaultTextBannerProps} page={mockPageEditing} />);

      const bannerElement = screen.getByTestId('text-banner-01');
      expect(bannerElement).toHaveAttribute('data-editing', 'true');
    });
  });

  describe('TextBanner02 Variant', () => {
    it('renders TextBanner02 variant with complete content', () => {
      render(<TextBanner02 {...defaultTextBannerProps} />);

      expect(screen.getByTestId('text-banner-02')).toBeInTheDocument();
      expect(screen.getByText('Transform Your Audio Experience')).toBeInTheDocument();
    });

    it('passes correct props to TextBanner02 component', () => {
      render(<TextBanner02 {...textBannerPropsPositionRight} />);

      const bannerElement = screen.getByTestId('text-banner-02');
      expect(bannerElement).toHaveAttribute(
        'data-styles',
        'position-right text-light custom-theme'
      );
    });
  });

  describe('TextTop Variant', () => {
    it('renders TextTop variant with complete content', () => {
      render(<TextTop {...defaultTextBannerProps} />);

      expect(screen.getByTestId('text-banner-text-top')).toBeInTheDocument();
      expect(screen.getByText('Transform Your Audio Experience')).toBeInTheDocument();
    });

    it('passes correct props to TextTop component', () => {
      render(<TextTop {...textBannerPropsMultipleStyles} />);

      const bannerElement = screen.getByTestId('text-banner-text-top');
      expect(bannerElement).toHaveAttribute(
        'data-styles',
        'position-left bg-primary text-white border-accent custom-padding responsive-layout'
      );
    });
  });

  describe('BlueTitleRight Variant', () => {
    it('renders BlueTitleRight variant with complete content', () => {
      render(<BlueTitleRight {...defaultTextBannerProps} />);

      expect(screen.getByTestId('text-banner-blue-title-right')).toBeInTheDocument();
      expect(screen.getByText('Transform Your Audio Experience')).toBeInTheDocument();
    });

    it('passes correct props to BlueTitleRight component', () => {
      render(<BlueTitleRight {...textBannerPropsCustomTheme} />);

      const bannerElement = screen.getByTestId('text-banner-blue-title-right');
      expect(bannerElement).toHaveAttribute('data-styles', 'theme-secondary position-center');
    });
  });

  describe('Content Scenarios', () => {
    it('handles long content gracefully across variants', () => {
      render(<TextBannerDefault {...textBannerPropsLongContent} />);

      expect(
        screen.getByText(/SYNC Audio - Revolutionizing Professional Sound Engineering/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Experience the ultimate in professional audio excellence/)
      ).toBeInTheDocument();
    });

    it('handles special characters in content across variants', () => {
      render(<TextBannerDefault {...textBannerPropsSpecialChars} />);

      expect(
        screen.getByText('SYNC™ Àudio - Équipement Professionnel & Spëcialisé')
      ).toBeInTheDocument();
      expect(screen.getByText(/Découvrez l'excellence acoustique/)).toBeInTheDocument();
    });

    it('handles empty field values across variants', () => {
      render(<TextBannerDefault {...textBannerPropsEmptyFields} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toBeInTheDocument();

      // Should render heading with empty content or fallback text
      const heading = screen.getByTestId('banner-heading');
      expect(heading).toBeInTheDocument();
      // The mock renders "Default Banner" as fallback when field value is empty
    });

    it('handles missing heading field', () => {
      render(<TextBannerDefault {...textBannerPropsUndefinedHeading} />);

      expect(screen.getByText('Description without heading')).toBeInTheDocument();
    });
  });

  describe('Styling and Parameters', () => {
    it('handles multiple CSS classes in styles parameter', () => {
      render(<TextBannerDefault {...textBannerPropsMultipleStyles} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute(
        'data-styles',
        'position-left bg-primary text-white border-accent custom-padding responsive-layout'
      );
    });

    it('handles missing styles parameter', () => {
      render(<TextBannerDefault {...textBannerPropsNoStyles} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute('data-styles', '');
    });

    it('handles custom theme parameter', () => {
      render(<TextBannerDefault {...textBannerPropsCustomTheme} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute('data-theme', 'secondary');
    });

    it('applies position-based styling variations', () => {
      render(<TextBannerDefault {...textBannerPropsPositionCenter} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute(
        'data-styles',
        'position-center premium-styling bg-dark'
      );
    });
  });

  describe('Editing Mode', () => {
    it('passes editing state to all variants', () => {
      const { rerender } = render(<TextBannerDefault {...defaultTextBannerProps} page={mockPageEditing} />);
      expect(screen.getByTestId('text-banner-default')).toHaveAttribute('data-editing', 'true');

      rerender(<TextBanner01 {...defaultTextBannerProps} page={mockPageEditing} />);
      expect(screen.getByTestId('text-banner-01')).toHaveAttribute('data-editing', 'true');

      rerender(<TextBanner02 {...defaultTextBannerProps} page={mockPageEditing} />);
      expect(screen.getByTestId('text-banner-02')).toHaveAttribute('data-editing', 'true');

      rerender(<TextTop {...defaultTextBannerProps} page={mockPageEditing} />);
      expect(screen.getByTestId('text-banner-text-top')).toHaveAttribute('data-editing', 'true');

      rerender(<BlueTitleRight {...defaultTextBannerProps} page={mockPageEditing} />);
      expect(screen.getByTestId('text-banner-blue-title-right')).toHaveAttribute(
        'data-editing',
        'true'
      );
    });

    it('handles non-editing state correctly', () => {
      mockUseSitecore.mockReturnValue(mockUseSitecoreNormal);
      render(<TextBannerDefault {...defaultTextBannerProps} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute('data-editing', 'false');
    });
  });

  describe('Component Integration', () => {
    it('integrates with page prop correctly', () => {
      render(<TextBannerDefault {...defaultTextBannerProps} page={mockPageEditing} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute('data-editing', 'true');
    });

    it('passes all props correctly to child components', () => {
      const customProps = {
        ...defaultTextBannerProps,
        params: {
          styles: 'test-styles',
          theme: 'test-theme' as any,
          customParam: 'custom-value',
        },
      };

      render(<TextBannerDefault {...customProps} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute('data-styles', 'test-styles');
      expect(bannerElement).toHaveAttribute('data-theme', 'test-theme');
    });
  });

  describe('Error Handling', () => {
    it('handles null fields gracefully', () => {
      expect(() => {
        render(<TextBannerDefault {...textBannerPropsNoFields} />);
      }).not.toThrow();
    });

    it('handles undefined params gracefully', () => {
      const propsWithoutParams = {
        ...defaultTextBannerProps,
        params: undefined as any,
      };

      expect(() => {
        render(<TextBannerDefault {...propsWithoutParams} />);
      }).not.toThrow();
    });

    it('handles malformed field data', () => {
      const propsWithMalformedFields = {
        ...defaultTextBannerProps,
        fields: {
          heading: { value: null } as any,
          description: undefined as any,
        },
      };

      expect(() => {
        render(<TextBannerDefault {...propsWithMalformedFields} />);
      }).not.toThrow();
    });

    it('handles missing rendering prop', () => {
      const propsWithoutRendering = {
        ...defaultTextBannerProps,
        rendering: undefined as any,
      };

      expect(() => {
        render(<TextBannerDefault {...propsWithoutRendering} />);
      }).not.toThrow();
    });
  });

  describe('Variant Comparison', () => {
    it('renders different testids for different variants', () => {
      const { rerender } = render(<TextBannerDefault {...defaultTextBannerProps} />);
      expect(screen.getByTestId('text-banner-default')).toBeInTheDocument();

      rerender(<TextBanner01 {...defaultTextBannerProps} />);
      expect(screen.getByTestId('text-banner-01')).toBeInTheDocument();
      expect(screen.queryByTestId('text-banner-default')).not.toBeInTheDocument();

      rerender(<TextBanner02 {...defaultTextBannerProps} />);
      expect(screen.getByTestId('text-banner-02')).toBeInTheDocument();
      expect(screen.queryByTestId('text-banner-01')).not.toBeInTheDocument();

      rerender(<TextTop {...defaultTextBannerProps} />);
      expect(screen.getByTestId('text-banner-text-top')).toBeInTheDocument();
      expect(screen.queryByTestId('text-banner-02')).not.toBeInTheDocument();

      rerender(<BlueTitleRight {...defaultTextBannerProps} />);
      expect(screen.getByTestId('text-banner-blue-title-right')).toBeInTheDocument();
      expect(screen.queryByTestId('text-banner-text-top')).not.toBeInTheDocument();
    });

    it('maintains consistent prop passing across variants', () => {
      const testProps = {
        ...defaultTextBannerProps,
        params: { styles: 'consistent-styles', theme: 'consistent-theme' as any },
      };

      const variants = [
        { component: TextBannerDefault, testId: 'text-banner-default' },
        { component: TextBanner01, testId: 'text-banner-01' },
        { component: TextBanner02, testId: 'text-banner-02' },
        { component: TextTop, testId: 'text-banner-text-top' },
        { component: BlueTitleRight, testId: 'text-banner-blue-title-right' },
      ];

      variants.forEach(({ component: Component, testId }) => {
        const { unmount } = render(<Component {...testProps} />);

        const element = screen.getByTestId(testId);
        expect(element).toHaveAttribute('data-styles', 'consistent-styles');
        expect(element).toHaveAttribute('data-editing', 'false');

        unmount();
      });
    });
  });

  describe('Performance', () => {
    it('handles re-renders efficiently', () => {
      const { rerender } = render(<TextBannerDefault {...defaultTextBannerProps} />);

      rerender(<TextBannerDefault {...defaultTextBannerProps} />);

      const rerenderElement = screen.getByTestId('text-banner-default');
      expect(rerenderElement).toBeInTheDocument();
    });

    it('handles variant switching efficiently', () => {
      const { rerender } = render(<TextBannerDefault {...defaultTextBannerProps} />);

      expect(screen.getByTestId('text-banner-default')).toBeInTheDocument();

      rerender(<TextBanner01 {...defaultTextBannerProps} />);
      expect(screen.getByTestId('text-banner-01')).toBeInTheDocument();

      rerender(<TextBanner02 {...defaultTextBannerProps} />);
      expect(screen.getByTestId('text-banner-02')).toBeInTheDocument();
    });

    it('handles rapid prop changes efficiently', () => {
      const { rerender } = render(<TextBannerDefault {...defaultTextBannerProps} />);

      for (let i = 0; i < 10; i++) {
        const dynamicProps = {
          ...defaultTextBannerProps,
          params: { styles: `dynamic-style-${i}` },
        };

        rerender(<TextBannerDefault {...dynamicProps} />);

        const element = screen.getByTestId('text-banner-default');
        expect(element).toHaveAttribute('data-styles', `dynamic-style-${i}`);
      }
    });
  });

  describe('Accessibility', () => {
    it('maintains proper component structure across variants', () => {
      const variants = [TextBannerDefault, TextBanner01, TextBanner02, TextTop, BlueTitleRight];

      variants.forEach((Component) => {
        const { unmount } = render(<Component {...defaultTextBannerProps} />);

        expect(screen.getByTestId('banner-heading')).toBeInTheDocument();
        expect(screen.getByTestId('banner-description')).toBeInTheDocument();

        unmount();
      });
    });

    it('provides content structure for screen readers', () => {
      render(<TextBannerDefault {...defaultTextBannerProps} />);

      const heading = screen.getByTestId('banner-heading');
      const description = screen.getByTestId('banner-description');

      expect(heading).toHaveTextContent('Transform Your Audio Experience');
      expect(description).toHaveTextContent(/Discover the pinnacle of sound engineering/);
    });
  });

  describe('Responsive Design', () => {
    it('passes responsive style classes to variants', () => {
      const responsiveProps = {
        ...defaultTextBannerProps,
        params: {
          styles: '@md:text-center @lg:text-left @xl:text-right responsive-grid',
        },
      };

      render(<TextBannerDefault {...responsiveProps} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute(
        'data-styles',
        '@md:text-center @lg:text-left @xl:text-right responsive-grid'
      );
    });

    it('handles container query classes', () => {
      const containerQueryProps = {
        ...defaultTextBannerProps,
        params: {
          styles: '@container/banner:md:grid-cols-2 @container/banner:lg:gap-8',
        },
      };

      render(<TextBannerDefault {...containerQueryProps} />);

      const bannerElement = screen.getByTestId('text-banner-default');
      expect(bannerElement).toHaveAttribute(
        'data-styles',
        '@container/banner:md:grid-cols-2 @container/banner:lg:gap-8'
      );
    });
  });
});
