import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as GlobalFooter,
  BlackCompactVariant,
  BlackLargeVariant,
  BlueCenteredVariant,
  BlueCompactVariant,
} from '@/components/global-footer/GlobalFooter';
import { mockGlobalFooterProps } from './global-footer.mock.props';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock page object for editing mode
const mockPageEditing = {
  mode: {
    isEditing: true,
    isPreview: false,
    isNormal: false,
    name: 'edit' as const,
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

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
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
    },
  })),
  Text: ({ field, tag = 'span', className }: Record<string, unknown>) => {
    const TextTag = tag as keyof JSX.IntrinsicElements;
    const fieldValue = (field as { value?: string })?.value || '';
    return React.createElement(TextTag, { className: className as string }, fieldValue);
  },
  Link: ({ field }: Record<string, unknown>) => {
    const linkField = field as { value?: { text?: string; href?: string } };
    return <a href={linkField?.value?.href}>{linkField?.value?.text}</a>;
  },
  Image: ({ field }: Record<string, unknown>) => {
    const imageField = field as { value?: { src?: string; alt?: string } };
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageField?.value?.src} alt={imageField?.value?.alt} />;
  },
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

// Mock dictionary keys
jest.mock('@/variables/dictionary', () => ({
  dictionaryKeys: {
    FOOTER_EmailSubmitLabel: 'FOOTER_EmailSubmitLabel',
    FOOTER_EmailPlaceholder: 'FOOTER_EmailPlaceholder',
    FOOTER_EmailErrorMessage: 'FOOTER_EmailErrorMessage',
    FOOTER_EmailSuccessMessage: 'FOOTER_EmailSuccessMessage',
  },
}));

// Mock child components
jest.mock('@/components/global-footer/GlobalFooterDefault.dev', () => ({
  GlobalFooterDefault: jest.fn(({ isPageEditing }: { isPageEditing: boolean }) => (
    <div data-testid="global-footer-default">
      Default Footer - {isPageEditing ? 'Editing' : 'Normal'}
    </div>
  )),
}));

jest.mock('@/components/global-footer/GlobalFooterBlackCompact.dev', () => ({
  GlobalFooterBlackCompact: jest.fn(({ isPageEditing }: { isPageEditing: boolean }) => (
    <div data-testid="global-footer-black-compact">
      Black Compact Footer - {isPageEditing ? 'Editing' : 'Normal'}
    </div>
  )),
}));

jest.mock('@/components/global-footer/GlobalFooterBlackLarge.dev', () => ({
  GlobalFooterBlackLarge: jest.fn(({ isPageEditing }: { isPageEditing: boolean }) => (
    <div data-testid="global-footer-black-large">
      Black Large Footer - {isPageEditing ? 'Editing' : 'Normal'}
    </div>
  )),
}));

jest.mock('@/components/global-footer/GlobalFooterBlueCentered.dev', () => ({
  GlobalFooterBlueCentered: jest.fn(({ isPageEditing }: { isPageEditing: boolean }) => (
    <div data-testid="global-footer-blue-centered">
      Blue Centered Footer - {isPageEditing ? 'Editing' : 'Normal'}
    </div>
  )),
}));

jest.mock('@/components/global-footer/GlobalFooterBlueCompact.dev', () => ({
  GlobalFooterBlueCompact: jest.fn(({ isPageEditing }: { isPageEditing: boolean }) => (
    <div data-testid="global-footer-blue-compact">
      Blue Compact Footer - {isPageEditing ? 'Editing' : 'Normal'}
    </div>
  )),
}));

describe('GlobalFooter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Variant', () => {
    it('renders without crashing', () => {
      const { container } = render(<GlobalFooter {...mockGlobalFooterProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the default footer variant', () => {
      render(<GlobalFooter {...mockGlobalFooterProps} />);
      expect(screen.getByTestId('global-footer-default')).toBeInTheDocument();
    });

    it('passes isPageEditing prop correctly in normal mode', () => {
      render(<GlobalFooter {...mockGlobalFooterProps} />);
      expect(screen.getByText(/Normal/)).toBeInTheDocument();
    });

    it('passes isPageEditing prop correctly in editing mode', () => {
      render(
        <GlobalFooter
          {...mockGlobalFooterProps}
          page={mockPageEditing}
        />
      );
      expect(screen.getByText(/Editing/)).toBeInTheDocument();
    });

    it('adds dictionary to props', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GlobalFooterDefault } = require('@/components/global-footer/GlobalFooterDefault.dev');
      render(<GlobalFooter {...mockGlobalFooterProps} />);

      const callArgs = GlobalFooterDefault.mock.calls[0][0];
      expect(callArgs.fields.dictionary).toEqual({
        FOOTER_EmailSubmitLabel: 'FOOTER_EmailSubmitLabel',
        FOOTER_EmailPlaceholder: 'FOOTER_EmailPlaceholder',
        FOOTER_EmailErrorMessage: 'FOOTER_EmailErrorMessage',
        FOOTER_EmailSuccessMessage: 'FOOTER_EmailSuccessMessage',
      });
    });
  });

  describe('BlackCompactVariant', () => {
    it('renders without crashing', () => {
      const { container } = render(<BlackCompactVariant {...mockGlobalFooterProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the black compact footer variant', () => {
      render(<BlackCompactVariant {...mockGlobalFooterProps} />);
      expect(screen.getByTestId('global-footer-black-compact')).toBeInTheDocument();
    });

    it('passes isPageEditing prop correctly', () => {
      render(
        <BlackCompactVariant
          {...mockGlobalFooterProps}
          page={mockPageEditing}
        />
      );
      expect(screen.getByText(/Editing/)).toBeInTheDocument();
    });
  });

  describe('BlackLargeVariant', () => {
    it('renders without crashing', () => {
      const { container } = render(<BlackLargeVariant {...mockGlobalFooterProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the black large footer variant', () => {
      render(<BlackLargeVariant {...mockGlobalFooterProps} />);
      expect(screen.getByTestId('global-footer-black-large')).toBeInTheDocument();
    });

    it('passes isPageEditing prop correctly', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useSitecore } = require('@sitecore-content-sdk/nextjs');
      useSitecore.mockReturnValue({
        page: {
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
        },
      });

      render(<BlackLargeVariant {...mockGlobalFooterProps} />);
      expect(screen.getByText(/Normal/)).toBeInTheDocument();
    });
  });

  describe('BlueCenteredVariant', () => {
    it('renders without crashing', () => {
      const { container } = render(<BlueCenteredVariant {...mockGlobalFooterProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the blue centered footer variant', () => {
      render(<BlueCenteredVariant {...mockGlobalFooterProps} />);
      expect(screen.getByTestId('global-footer-blue-centered')).toBeInTheDocument();
    });

    it('adds dictionary translations to props', () => {
      const {
        GlobalFooterBlueCentered,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
      } = require('@/components/global-footer/GlobalFooterBlueCentered.dev');
      render(<BlueCenteredVariant {...mockGlobalFooterProps} />);

      const callArgs = GlobalFooterBlueCentered.mock.calls[0][0];
      expect(callArgs.fields.dictionary).toBeDefined();
      expect(typeof callArgs.fields.dictionary).toBe('object');
    });
  });

  describe('BlueCompactVariant', () => {
    it('renders without crashing', () => {
      const { container } = render(<BlueCompactVariant {...mockGlobalFooterProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the blue compact footer variant', () => {
      render(<BlueCompactVariant {...mockGlobalFooterProps} />);
      expect(screen.getByTestId('global-footer-blue-compact')).toBeInTheDocument();
    });

    it('passes isPageEditing prop correctly', () => {
      render(
        <BlueCompactVariant
          {...mockGlobalFooterProps}
          page={mockPageEditing}
        />
      );
      expect(screen.getByText(/Editing/)).toBeInTheDocument();
    });
  });

  describe('Dictionary Handling', () => {
    it('uses i18n translations for dictionary values', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useTranslations } = require('next-intl');
      const mockT = jest.fn((key) => `translated_${key}`);
      useTranslations.mockReturnValue(mockT);

      render(<GlobalFooter {...mockGlobalFooterProps} />);

      expect(mockT).toHaveBeenCalledWith('FOOTER_EmailSubmitLabel');
      expect(mockT).toHaveBeenCalledWith('FOOTER_EmailPlaceholder');
      expect(mockT).toHaveBeenCalledWith('FOOTER_EmailErrorMessage');
      expect(mockT).toHaveBeenCalledWith('FOOTER_EmailSuccessMessage');
    });

    it('passes translated dictionary to child component', () => {
      jest.clearAllMocks();

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useTranslations } = require('next-intl');
      const mockT = jest.fn((key: string) => `translated_${key}`);
      useTranslations.mockReturnValue(mockT);

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GlobalFooterDefault } = require('@/components/global-footer/GlobalFooterDefault.dev');
      render(<GlobalFooter {...mockGlobalFooterProps} />);

      const callArgs = GlobalFooterDefault.mock.calls[0][0];
      expect(callArgs.fields.dictionary).toEqual({
        FOOTER_EmailSubmitLabel: 'translated_FOOTER_EmailSubmitLabel',
        FOOTER_EmailPlaceholder: 'translated_FOOTER_EmailPlaceholder',
        FOOTER_EmailErrorMessage: 'translated_FOOTER_EmailErrorMessage',
        FOOTER_EmailSuccessMessage: 'translated_FOOTER_EmailSuccessMessage',
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing fields gracefully', () => {
      const propsWithoutFields = {
        ...mockGlobalFooterProps,
        fields: {
          ...mockGlobalFooterProps.fields,
          data: {
            datasource: {
              footerNavLinks: { results: [] },
              socialLinks: { results: [] },
            },
          },
        },
      };

      expect(() => render(<GlobalFooter {...propsWithoutFields} />)).not.toThrow();
    });

    it('renders all variants without errors', () => {
      const variants = [
        GlobalFooter,
        BlackCompactVariant,
        BlackLargeVariant,
        BlueCenteredVariant,
        BlueCompactVariant,
      ];

      variants.forEach((Variant) => {
        const { container } = render(<Variant {...mockGlobalFooterProps} />);
        expect(container).toBeInTheDocument();
      });
    });
  });
});
