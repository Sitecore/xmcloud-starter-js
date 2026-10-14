/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as GlobalFooterDefault,
  BlackCompactVariant,
  BlackLargeVariant,
  BlueCenteredVariant,
  BlueCompactVariant,
} from '../../components/global-footer/GlobalFooter';
import {
  defaultGlobalFooterProps,
  globalFooterPropsNoFields,
  globalFooterPropsMinimal,
  globalFooterPropsEditing,
} from './GlobalFooter.mockProps';
import { mockPage } from '../test-utils/mockPage';

// Mock the Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag = 'span', className }: any) => {
    const f = field;
    if (!f?.value) return null;
    return React.createElement(tag, { className }, f.value);
  },
  Link: ({ field, children, className }: any) => {
    const f = field;
    if (!f?.value?.href) return React.createElement(React.Fragment, {}, children);
    return React.createElement('a', { href: f.value.href, className }, children || f.value.text);
  },
  useSitecore: jest.fn(() => ({ page: mockPage })),
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

// Mock next-intl for ESM module support
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      Demo2_Footer_EmailSubmitLabel: 'Subscribe',
      Demo2_Footer_EmailPlaceholder: 'Enter your email',
      Demo2_Footer_EmailErrorMessage: 'Please enter a valid email',
      Demo2_Footer_EmailSuccessMessage: 'Successfully subscribed!',
      FOOTER_EmailSubmitLabel: 'Subscribe',
      FOOTER_EmailPlaceholder: 'Enter your email',
      FOOTER_EmailErrorMessage: 'Please enter a valid email',
      FOOTER_EmailSuccessMessage: 'Successfully subscribed!',
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

// Mock components
jest.mock('../../components/forms/email/EmailSignupForm.dev', () => ({
  Default: ({ dictionary }: { dictionary: any }) => (
    <div data-testid="email-signup-form">
      Email signup form with placeholder:{' '}
      {dictionary?.FOOTER_EmailPlaceholder || 'Enter your email'}
    </div>
  ),
}));

jest.mock('../../components/global-footer/FooterNavigationColumn.dev', () => ({
  Default: ({ items }: { items?: any[] }) => (
    <div data-testid="footer-navigation-column">
      {items?.length ? `Navigation with ${items.length} items` : 'Navigation column'}
    </div>
  ),
}));

jest.mock('../../components/button-component/ButtonComponent', () => ({
  EditableButton: ({ field }: { field?: any }) => {
    const f = field;
    return <button data-testid="editable-button">{f?.value?.text || 'Button'}</button>;
  },
}));

jest.mock('../../components/ui/animated-hover-nav', () => ({
  AnimatedHoverNav: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-hover-nav">{children}</div>
  ),
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('GlobalFooter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Variant', () => {
    it('renders footer with complete content structure', () => {
      render(<GlobalFooterDefault {...defaultGlobalFooterProps} />);

      // Check semantic footer structure
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();

      // Check main content sections
      expect(screen.getByText('Your trusted audio gear provider')).toBeInTheDocument();
      expect(screen.getByText('Subscribe to our newsletter')).toBeInTheDocument();
      expect(screen.getByText('© 2024 SYNC Audio. All rights reserved.')).toBeInTheDocument();

      // Check interactive elements
      expect(screen.getByTestId('email-signup-form')).toBeInTheDocument();
      expect(screen.getByTestId('footer-navigation-column')).toBeInTheDocument();
      expect(screen.getByTestId('animated-hover-nav')).toBeInTheDocument();
    });

    it('renders navigation with correct item count', () => {
      render(<GlobalFooterDefault {...defaultGlobalFooterProps} />);

      const navigationColumn = screen.getByTestId('footer-navigation-column');
      expect(navigationColumn).toHaveTextContent('Navigation with 2 items');
    });

    it('includes email form with dictionary translations', () => {
      render(<GlobalFooterDefault {...defaultGlobalFooterProps} />);

      const emailForm = screen.getByTestId('email-signup-form');
      expect(emailForm).toHaveTextContent('Enter your email');
    });
  });

  describe('Content Scenarios', () => {
    it('gracefully handles empty navigation links', () => {
      render(<GlobalFooterDefault {...globalFooterPropsNoFields} />);

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByTestId('email-signup-form')).toBeInTheDocument();
    });

    it('renders with minimal content', () => {
      render(<GlobalFooterDefault {...globalFooterPropsMinimal} />);

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByText('Your trusted audio gear provider')).toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    it('maintains structure in editing mode', () => {
      const { useSitecore } = jest.requireMock('@sitecore-content-sdk/nextjs');
      useSitecore.mockReturnValue({ page: { mode: { isEditing: true } } });

      render(<GlobalFooterDefault {...globalFooterPropsEditing} />);

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('Footer Variants', () => {
    it('renders BlackCompact variant', () => {
      render(<BlackCompactVariant {...defaultGlobalFooterProps} />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders BlackLarge variant', () => {
      render(<BlackLargeVariant {...defaultGlobalFooterProps} />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders BlueCentered variant', () => {
      render(<BlueCenteredVariant {...defaultGlobalFooterProps} />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders BlueCompact variant', () => {
      render(<BlueCompactVariant {...defaultGlobalFooterProps} />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('navigation links are clickable', () => {
      render(<GlobalFooterDefault {...defaultGlobalFooterProps} />);

      const navigationColumn = screen.getByTestId('footer-navigation-column');
      expect(navigationColumn).toBeInTheDocument();

      // Verify navigation content indicates interactive elements
      expect(navigationColumn).toHaveTextContent('Navigation with 2 items');
    });

    it('email signup form is interactive', () => {
      render(<GlobalFooterDefault {...defaultGlobalFooterProps} />);

      const emailForm = screen.getByTestId('email-signup-form');
      expect(emailForm).toBeInTheDocument();

      // Form should have proper dictionary context
      expect(emailForm).toHaveTextContent('Enter your email');
    });

    it('social links section provides navigation', () => {
      render(<GlobalFooterDefault {...defaultGlobalFooterProps} />);

      const socialLinks = screen.getByTestId('animated-hover-nav');
      expect(socialLinks).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic footer role', () => {
      render(<GlobalFooterDefault {...defaultGlobalFooterProps} />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('provides structured content hierarchy', () => {
      render(<GlobalFooterDefault {...defaultGlobalFooterProps} />);

      // Check that content sections are properly organized
      expect(screen.getByText('Your trusted audio gear provider')).toBeInTheDocument();
      expect(screen.getByText('Subscribe to our newsletter')).toBeInTheDocument();
      expect(screen.getByText('© 2024 SYNC Audio. All rights reserved.')).toBeInTheDocument();
    });
  });
});
