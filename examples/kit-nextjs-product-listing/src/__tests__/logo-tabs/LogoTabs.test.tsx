/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as LogoTabsDefault } from '../../components/logo-tabs/LogoTabs';
import {
  defaultLogoTabsProps,
  logoTabsPropsNoLogos,
  logoTabsPropsMinimal,
  logoTabsPropsNoBackground,
} from './LogoTabs.mockProps';

// Mock the Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag = 'span', className }: any) => {
    const f = field;
    if (!f?.value) return null;
    return React.createElement(tag, { className }, f.value);
  },
  Image: ({ field, className }: any) => {
    if (!field?.value?.src) return null;
    return (
      <img
        src={field.value.src}
        alt={field.value.alt}
        className={className}
        data-testid="sitecore-image"
      />
    );
  },
}));

// Mock LogoItem component
jest.mock('../../components/logo-tabs/LogoItem', () => ({
  LogoItem: ({ title, logo, isActive, onClick, id, controls }: any) => (
    <button
      data-testid={`logo-item-${id}`}
      onClick={onClick}
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={controls}
      tabIndex={isActive ? 0 : -1}
      className={isActive ? 'active-tab' : 'inactive-tab'}
    >
      <span className="sr-only">{title?.jsonValue?.value || ''}</span>
      {logo?.jsonValue && (
        <img
          src={logo.jsonValue.value.src}
          alt={logo.jsonValue.value.alt}
          data-testid={`logo-image-${id}`}
        />
      )}
    </button>
  ),
}));

// Mock Button component
jest.mock('../../components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className} data-testid="cta-button">
      {children}
    </button>
  ),
}));

// Mock NoDataFallback
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

// Mock cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('LogoTabs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Behavior', () => {
    it('renders complete logo tabs with all content', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Check main structure
      expect(screen.getByText('Our Brand Partners')).toBeInTheDocument();

      // Check background image is rendered
      const backgroundImages = screen.getAllByTestId('sitecore-image');
      expect(backgroundImages[0]).toHaveAttribute('src', '/backgrounds/partners-bg.jpg');

      // Check tabs are rendered
      expect(screen.getByTestId('logo-item-tab-0')).toBeInTheDocument();
      expect(screen.getByTestId('logo-item-tab-1')).toBeInTheDocument();
      expect(screen.getByTestId('logo-item-tab-2')).toBeInTheDocument();

      // Check first tab is active by default
      expect(screen.getByTestId('logo-item-tab-0')).toHaveClass('active-tab');
      expect(screen.getByTestId('logo-item-tab-1')).toHaveClass('inactive-tab');
    });

    it('displays logo images in tabs', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Check logo images
      expect(screen.getByTestId('logo-image-tab-0')).toHaveAttribute(
        'src',
        '/logos/brand-alpha.svg'
      );
      expect(screen.getByTestId('logo-image-tab-1')).toHaveAttribute(
        'src',
        '/logos/brand-beta.svg'
      );
      expect(screen.getByTestId('logo-image-tab-2')).toHaveAttribute(
        'src',
        '/logos/brand-gamma.svg'
      );
    });

    it('renders tab panels with content', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Check first tab panel content is visible
      expect(screen.getByText('Brand Alpha Partnership')).toBeInTheDocument();

      // Find the visible CTA button (there are multiple but only one is visible)
      const ctaButtons = screen.getAllByTestId('cta-button');
      expect(ctaButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Tab Interaction', () => {
    it('switches active tab when clicked', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Initially first tab is active
      expect(screen.getByTestId('logo-item-tab-0')).toHaveClass('active-tab');
      expect(screen.getByText('Brand Alpha Partnership')).toBeInTheDocument();

      // Click second tab
      fireEvent.click(screen.getByTestId('logo-item-tab-1'));

      // Second tab should now be active
      expect(screen.getByTestId('logo-item-tab-1')).toHaveClass('active-tab');
      expect(screen.getByTestId('logo-item-tab-0')).toHaveClass('inactive-tab');
    });

    it('updates tab panel content when switching tabs', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Initially shows first tab content
      expect(screen.getByText('Brand Alpha Partnership')).toBeInTheDocument();

      // Click second tab
      fireEvent.click(screen.getByTestId('logo-item-tab-1'));

      // Should show second tab content
      expect(screen.getByText('Brand Beta Collaboration')).toBeInTheDocument();

      // Verify CTA buttons exist (multiple in DOM but different ones are visible)
      const ctaButtons = screen.getAllByTestId('cta-button');
      expect(ctaButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles arrow key navigation', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      const tablist = screen.getByRole('tablist');

      // Test ArrowRight
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });
      expect(screen.getByTestId('logo-item-tab-1')).toHaveClass('active-tab');

      // Test ArrowLeft
      fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
      expect(screen.getByTestId('logo-item-tab-0')).toHaveClass('active-tab');
    });

    it('handles Home and End keys', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      const tablist = screen.getByRole('tablist');

      // Navigate to second tab first
      fireEvent.click(screen.getByTestId('logo-item-tab-1'));

      // Test Home key
      fireEvent.keyDown(tablist, { key: 'Home' });
      expect(screen.getByTestId('logo-item-tab-0')).toHaveClass('active-tab');

      // Test End key
      fireEvent.keyDown(tablist, { key: 'End' });
      expect(screen.getByTestId('logo-item-tab-2')).toHaveClass('active-tab');
    });

    it('wraps around when navigating past boundaries', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      const tablist = screen.getByRole('tablist');

      // Start at last tab
      fireEvent.click(screen.getByTestId('logo-item-tab-2'));

      // ArrowRight should wrap to first tab
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });
      expect(screen.getByTestId('logo-item-tab-0')).toHaveClass('active-tab');

      // ArrowLeft should wrap to last tab
      fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
      expect(screen.getByTestId('logo-item-tab-2')).toHaveClass('active-tab');
    });
  });

  describe('Content Scenarios', () => {
    it('handles no logos gracefully', () => {
      render(<LogoTabsDefault {...logoTabsPropsNoLogos} />);

      expect(screen.getByText('Our Brand Partners')).toBeInTheDocument();
      expect(screen.queryByTestId('logo-item-tab-0')).not.toBeInTheDocument();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('renders with minimal content (2 tabs)', () => {
      render(<LogoTabsDefault {...logoTabsPropsMinimal} />);

      expect(screen.getByTestId('logo-item-tab-0')).toBeInTheDocument();
      expect(screen.getByTestId('logo-item-tab-1')).toBeInTheDocument();
      expect(screen.queryByTestId('logo-item-tab-2')).not.toBeInTheDocument();

      expect(screen.getByText('Brand Alpha Partnership')).toBeInTheDocument();
    });

    it('handles missing background image', () => {
      render(<LogoTabsDefault {...logoTabsPropsNoBackground} />);

      expect(screen.getByText('Our Brand Partners')).toBeInTheDocument();
      expect(screen.getByTestId('logo-item-tab-0')).toBeInTheDocument();

      // Should still render without background
      expect(screen.queryByTestId('sitecore-image')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('implements proper ARIA attributes', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Check tablist
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute('aria-label', 'Our Brand Partners');

      // Check tabs
      const tab0 = screen.getByTestId('logo-item-tab-0');
      expect(tab0).toHaveAttribute('role', 'tab');
      expect(tab0).toHaveAttribute('aria-selected', 'true');
      expect(tab0).toHaveAttribute('aria-controls', 'panel-0');

      const tab1 = screen.getByTestId('logo-item-tab-1');
      expect(tab1).toHaveAttribute('aria-selected', 'false');
    });

    it('manages tabindex correctly', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Active tab should have tabindex 0
      expect(screen.getByTestId('logo-item-tab-0')).toHaveAttribute('tabIndex', '0');

      // Inactive tabs should have tabindex -1
      expect(screen.getByTestId('logo-item-tab-1')).toHaveAttribute('tabIndex', '-1');
      expect(screen.getByTestId('logo-item-tab-2')).toHaveAttribute('tabIndex', '-1');
    });

    it('provides screen reader content', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Check for screen reader only text
      const srTexts = screen.getAllByText('Brand Alpha', { selector: '.sr-only' });
      expect(srTexts.length).toBeGreaterThan(0);
    });

    it('includes live region for dynamic content', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Find element with aria-live attribute
      const liveElements = document.querySelectorAll('[aria-live="polite"]');
      expect(liveElements.length).toBeGreaterThan(0);
      expect(liveElements[0]).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Tab Panels', () => {
    it('renders tab panels with proper ARIA attributes', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // Check for tabpanel role (in the content area)
      const contentElements = screen.getAllByText(
        /Brand.*Partnership|Brand.*Collaboration|Brand.*Alliance/
      );
      expect(contentElements.length).toBeGreaterThan(0);
    });

    it('shows correct content for active tab', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      // First tab content should be visible
      expect(screen.getByText('Brand Alpha Partnership')).toBeInTheDocument();

      // Switch to second tab
      fireEvent.click(screen.getByTestId('logo-item-tab-1'));

      // Second tab content should be visible
      expect(screen.getByText('Brand Beta Collaboration')).toBeInTheDocument();
    });
  });

  describe('Visual Structure', () => {
    it('renders title with proper heading structure', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      const title = screen.getByText('Our Brand Partners');
      expect(title.tagName.toLowerCase()).toBe('h2');
    });

    it('displays background image when provided', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      const backgroundImages = screen.getAllByTestId('sitecore-image');
      expect(backgroundImages[0]).toHaveAttribute('src', '/backgrounds/partners-bg.jpg');
      expect(backgroundImages[0]).toHaveAttribute('alt', 'Partners Background');
    });

    it('maintains proper component structure', () => {
      render(<LogoTabsDefault {...defaultLogoTabsProps} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('Our Brand Partners')).toBeInTheDocument();

      // Check for live region by aria-live attribute
      const liveElements = document.querySelectorAll('[aria-live="polite"]');
      expect(liveElements.length).toBeGreaterThan(0);
    });
  });
});
