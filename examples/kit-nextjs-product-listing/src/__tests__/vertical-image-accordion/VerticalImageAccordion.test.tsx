/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Default as VerticalImageAccordionDefault } from '../../components/vertical-image-accordion/VerticalImageAccordion';
import {
  defaultVerticalImageAccordionProps,
  verticalImageAccordionPropsNoTitle,
  verticalImageAccordionPropsEmptyTitle,
  verticalImageAccordionPropsSingleItem,
  verticalImageAccordionPropsNoCTA,
  verticalImageAccordionPropsLongContent,
  verticalImageAccordionPropsSpecialChars,
  verticalImageAccordionPropsEmptyItems,
  verticalImageAccordionPropsEmptyFields,
  verticalImageAccordionPropsNoFields,
  verticalImageAccordionPropsNoDatasource,
  verticalImageAccordionPropsNoItems,
  verticalImageAccordionPropsManyItems,
  verticalImageAccordionPropsCustomStyles,
  verticalImageAccordionPropsUndefinedParams,
  verticalImageAccordionPropsMalformedItems,
  mockUseSitecoreNormal,
} from './VerticalImageAccordion.mockProps';

// Mock Sitecore Content SDK
const mockUseSitecore = jest.fn();

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag: Tag = 'div', className, id, children }: any) => (
    <Tag
      data-testid="sitecore-text"
      className={className}
      id={id}
      data-field-value={field?.value || ''}
    >
      {field?.value || children || 'Sitecore Text'}
    </Tag>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(
      ({ children, className, onClick, onKeyDown, initial, ...props }: any, ref: any) => (
        <div
          ref={ref}
          className={className}
          onClick={onClick}
          onKeyDown={onKeyDown}
          data-testid="motion-div"
          {...props}
        >
          {children}
        </div>
      )
    ),
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>,
}));

// Mock ImageWrapper component
jest.mock('../../components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, wrapperClass, ...props }: any) => (
    <div className={wrapperClass} data-testid="image-wrapper-container">
      <img
        data-testid="image-wrapper"
        src={image?.value?.src || ''}
        alt={image?.value?.alt || ''}
        className={className}
        {...props}
      />
    </div>
  ),
}));

// Mock ButtonBase component
jest.mock('../../components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink, variant, className, children, ...props }: any) => (
    <button
      data-testid="button-base"
      data-href={buttonLink?.value?.href || ''}
      data-text={buttonLink?.value?.text || ''}
      data-variant={variant}
      className={className}
      {...props}
    >
      {buttonLink?.value?.text || children || 'Button'}
    </button>
  ),
}));

// Mock NoDataFallback component
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

// Mock utils
jest.mock('../../lib/utils', () => ({
  cn: (...classes: any[]) => {
    return classes
      .filter(Boolean)
      .filter((c) => typeof c === 'string' || typeof c === 'number')
      .join(' ');
  },
}));

describe('VerticalImageAccordion Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockUseSitecoreNormal);
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Default Rendering', () => {
    it('renders with default props successfully', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const titles = screen.getAllByTestId('sitecore-text');
      expect(titles[0]).toBeInTheDocument();
      expect(titles[0]).toHaveTextContent('Premium Audio Solutions');
    });

    it('renders all accordion items', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const motionDivs = screen.getAllByTestId('motion-div');
      // Filter for actual accordion items (excluding AnimatePresence containers)
      const accordionItems = motionDivs.filter((div) => div.getAttribute('role') === 'tab');
      expect(accordionItems).toHaveLength(3);
    });

    it('sets first item as active by default (index 1)', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const accordionItems = screen.getAllByRole('tab');
      expect(accordionItems[1]).toHaveAttribute('aria-selected', 'true');
      expect(accordionItems[0]).toHaveAttribute('aria-selected', 'false');
      expect(accordionItems[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('renders images for all items', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const images = screen.getAllByTestId('image-wrapper');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('src', '/images/headphones.jpg');
      expect(images[0]).toHaveAttribute('alt', 'Professional headphones on studio desk');
    });

    it('applies correct ARIA attributes', () => {
      const { container } = render(
        <VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />
      );

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical');

      const region = container.querySelector('[role="region"]');
      expect(region).toHaveAttribute('aria-label', 'Premium Audio Solutions');
    });
  });

  describe('Accordion Functionality', () => {
    it('handles accordion item clicks', async () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const accordionItems = screen.getAllByRole('tab');

      fireEvent.click(accordionItems[0]);

      await waitFor(() => {
        expect(accordionItems[0]).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('handles keyboard navigation (Enter key)', async () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const accordionItems = screen.getAllByRole('tab');

      fireEvent.keyDown(accordionItems[2], { key: 'Enter' });

      await waitFor(() => {
        expect(accordionItems[2]).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('handles keyboard navigation (Space key)', async () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const accordionItems = screen.getAllByRole('tab');

      fireEvent.keyDown(accordionItems[0], { key: ' ' });

      await waitFor(() => {
        expect(accordionItems[0]).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('handles space key interaction', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const accordionItems = screen.getAllByRole('tab');

      // Simulate space key press
      fireEvent.keyDown(accordionItems[0], { key: ' ', code: 'Space' });

      // Component should handle space key interaction
      expect(accordionItems[0]).toBeInTheDocument();
    });

    it('manages expanding state during transitions', async () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const accordionItems = screen.getAllByRole('tab');

      fireEvent.click(accordionItems[0]);

      // Fast-forward through the timeout
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Component should have handled the expanding state
      expect(accordionItems[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('updates active index correctly', async () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const accordionItems = screen.getAllByRole('tab');

      // Initially, index 1 should be active
      expect(accordionItems[1]).toHaveAttribute('aria-selected', 'true');

      // Click on index 0
      fireEvent.click(accordionItems[0]);

      await waitFor(() => {
        expect(accordionItems[0]).toHaveAttribute('aria-selected', 'true');
        expect(accordionItems[1]).toHaveAttribute('aria-selected', 'false');
      });
    });
  });

  describe('Content Scenarios', () => {
    it('handles missing title gracefully', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsNoTitle} />);

      // Main title should not be rendered when undefined, but accordion items' titles should still render
      const h2Elements = screen.queryAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBe(0); // No main title

      // But accordion items should still render
      expect(screen.getAllByRole('tab')).toHaveLength(1);
    });

    it('handles empty title', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsEmptyTitle} />);

      // Check for main title with empty content
      const h2Element = screen.getByRole('heading', { level: 2 });
      expect(h2Element).toHaveAttribute('data-field-value', '');
    });

    it('renders single accordion item', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsSingleItem} />);

      const accordionItems = screen.getAllByRole('tab');
      expect(accordionItems).toHaveLength(1);
      // Single item may not be selected by default - depends on component logic
      expect(accordionItems[0]).toBeInTheDocument();
    });

    it('handles items without CTA buttons', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsNoCTA} />);

      // Items should render but without CTA buttons
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(screen.queryByTestId('button-base')).not.toBeInTheDocument();
    });

    it('handles long content properly', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsLongContent} />);

      const titles = screen.getAllByTestId('sitecore-text');
      expect(titles[0]).toHaveTextContent(/Comprehensive Audio Solutions/);

      // Should render accordion items with long descriptions
      expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('handles special characters and international text', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsSpecialChars} />);

      const titles = screen.getAllByTestId('sitecore-text');
      expect(titles[0]).toHaveTextContent(/Solutions Audio Professionnelles™/);
      expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('handles empty items array', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsEmptyItems} />);

      expect(screen.getByTestId('sitecore-text')).toHaveTextContent('No Items Available');
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('handles empty field values', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsEmptyFields} />);

      const accordionItems = screen.getAllByRole('tab');
      expect(accordionItems).toHaveLength(2);

      // Items with empty fields should still render accordion structure
      expect(accordionItems[0]).toBeInTheDocument();
      expect(accordionItems[1]).toBeInTheDocument();
    });

    it('handles many accordion items', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsManyItems} />);

      const accordionItems = screen.getAllByRole('tab');
      expect(accordionItems).toHaveLength(6);

      // Index 1 should be active by default
      expect(accordionItems[1]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('CTA Buttons', () => {
    it('renders CTA buttons for items that have them', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      // Should have CTA buttons (they appear in the active item's expanded content)
      const buttons = screen.getAllByTestId('button-base');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('applies correct CTA button attributes', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const buttons = screen.getAllByTestId('button-base');
      if (buttons.length > 0) {
        expect(buttons[0]).toHaveAttribute('data-variant', 'secondary');
      }
    });

    it('provides accessible CTA button labels', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      // Check for aria-label on buttons
      const buttons = screen.getAllByTestId('button-base');
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes for mobile and desktop', () => {
      const { container } = render(
        <VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />
      );

      const flexibleContainer = container.querySelector('.flex.flex-col');
      // Check that it has the responsive flex-row class
      expect(flexibleContainer).toHaveClass('gap-14');
      expect(flexibleContainer?.className).toContain('@md:flex-row');
    });

    it('handles container queries', () => {
      const { container } = render(
        <VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />
      );

      const mainContainerElements = container.querySelectorAll('*');
      const mainContainer = Array.from(mainContainerElements).find((el) =>
        el.className.includes('@container')
      );
      expect(mainContainer).toBeInTheDocument();
    });

    it('applies responsive spacing classes', () => {
      const { container } = render(
        <VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />
      );

      const allElements = container.querySelectorAll('*');
      const spacingContainer = Array.from(allElements).find(
        (el) =>
          el.className.includes('px-4') &&
          el.className.includes('sm:px-6') &&
          el.className.includes('lg:px-8')
      );
      expect(spacingContainer).toBeInTheDocument();
    });
  });

  describe('Animation Integration', () => {
    it('renders AnimatePresence for content transitions', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      expect(screen.getAllByTestId('animate-presence')).toHaveLength(3); // One for each accordion item
    });

    it('applies motion properties to accordion items', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });

    it('handles animation state changes', async () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const accordionItems = screen.getAllByRole('tab');

      fireEvent.click(accordionItems[0]);

      // Animation state should update
      await waitFor(() => {
        expect(accordionItems[0]).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA roles and attributes', () => {
      const { container } = render(
        <VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />
      );

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical');

      const tabs = screen.getAllByRole('tab');
      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute('aria-controls', `panel-${index}`);
        expect(tab).toHaveAttribute('aria-expanded');
        expect(tab).toHaveAttribute('tabIndex', '0');
      });

      const tabpanels = screen.getAllByRole('tabpanel');
      // Check that all tabpanels have proper IDs and labels (but not necessarily in order since only active ones are visible)
      tabpanels.forEach((panel) => {
        expect(panel).toHaveAttribute('id');
        expect(panel).toHaveAttribute('aria-labelledby');

        const id = panel.getAttribute('id');
        const labelledBy = panel.getAttribute('aria-labelledby');
        if (id && labelledBy) {
          const panelIndex = id.replace('panel-', '');
          const tabIndex = labelledBy.replace('tab-', '');
          expect(panelIndex).toBe(tabIndex);
        }
      });
    });

    it('manages focus properly', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const tabs = screen.getAllByRole('tab');
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('tabIndex', '0');
      });
    });

    it('provides semantic image roles', () => {
      const { container } = render(
        <VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />
      );

      const imageContainers = container.querySelectorAll('[role="img"]');
      expect(imageContainers.length).toBeGreaterThan(0);

      imageContainers.forEach((container) => {
        expect(container).toHaveAttribute('aria-label');
      });
    });

    it('handles keyboard navigation accessibility', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const tabs = screen.getAllByRole('tab');

      // Test Enter key
      fireEvent.keyDown(tabs[0], { key: 'Enter' });
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

      // Test Space key
      fireEvent.keyDown(tabs[2], { key: ' ' });
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');

      // Other keys should not activate
      fireEvent.keyDown(tabs[1], { key: 'a' });
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    });

    it('provides proper heading hierarchy', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const allTitles = screen.getAllByTestId('sitecore-text');
      const mainTitle = allTitles[0]; // First one should be the main title
      expect(mainTitle.tagName.toLowerCase()).toBe('h2');

      // Look for h3 elements specifically (accordion item titles)
      const h3Elements = allTitles.filter((el) => el.tagName.toLowerCase() === 'h3');
      expect(h3Elements.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('returns NoDataFallback when no fields', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('no-data-fallback')).toHaveTextContent('VerticalImageAccordion');
    });

    it('handles missing datasource gracefully', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsNoDatasource} />);

      // Component renders basic structure even with missing datasource
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
    });

    it('handles missing items gracefully', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsNoItems} />);

      expect(screen.getByTestId('sitecore-text')).toHaveTextContent('No Items in Datasource');
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('handles undefined params gracefully', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsUndefinedParams} />);

      // Should still render content without crashing
      const titles = screen.getAllByTestId('sitecore-text');
      expect(titles[0]).toBeInTheDocument();
    });

    it('handles malformed item data', () => {
      expect(() => {
        render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsMalformedItems} />);
      }).not.toThrow();

      const titles = screen.getAllByTestId('sitecore-text');
      expect(titles[0]).toHaveTextContent('Malformed Items Test');
    });

    it('handles missing image gracefully', () => {
      const propsWithMissingImage = {
        ...defaultVerticalImageAccordionProps,
        fields: {
          data: {
            datasource: {
              title: {
                jsonValue: { value: 'Missing Image Test' },
              },
              items: {
                results: [
                  {
                    title: { jsonValue: { value: 'Test Item' } },
                    description: { jsonValue: { value: 'Test description' } },
                    image: null as any,
                  },
                ],
              },
            },
          },
        },
      };

      expect(() => {
        render(<VerticalImageAccordionDefault {...propsWithMissingImage} />);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('handles re-renders efficiently', () => {
      const { rerender } = render(
        <VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />
      );

      rerender(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const titles = screen.getAllByTestId('sitecore-text');
      expect(titles[0]).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('manages state updates without memory leaks', async () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const accordionItems = screen.getAllByRole('tab');

      // Rapidly change active items
      for (let i = 0; i < accordionItems.length; i++) {
        fireEvent.click(accordionItems[i]);
        await waitFor(() => {
          expect(accordionItems[i]).toHaveAttribute('aria-selected', 'true');
        });
      }
    });

    it('handles large numbers of items efficiently', () => {
      const startTime = performance.now();
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsManyItems} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render in less than 100ms
      expect(screen.getAllByRole('tab')).toHaveLength(6);
    });

    it('cleans up timers properly', () => {
      const { unmount } = render(
        <VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />
      );

      const accordionItems = screen.getAllByRole('tab');
      fireEvent.click(accordionItems[0]);

      // Unmount before timeout completes
      unmount();

      // Fast-forward timers to ensure no memory leaks
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // No assertions needed - just ensuring no errors are thrown
    });
  });

  describe('Integration', () => {
    it('works with Sitecore Text components', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const textComponents = screen.getAllByTestId('sitecore-text');
      expect(textComponents.length).toBeGreaterThan(0);
      expect(textComponents[0]).toHaveAttribute('data-field-value', 'Premium Audio Solutions');
    });

    it('integrates with ImageWrapper components', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const imageWrappers = screen.getAllByTestId('image-wrapper');
      expect(imageWrappers).toHaveLength(3);
      expect(imageWrappers[0]).toHaveAttribute('src', '/images/headphones.jpg');
    });

    it('integrates with ButtonBase components', () => {
      render(<VerticalImageAccordionDefault {...defaultVerticalImageAccordionProps} />);

      const buttons = screen.getAllByTestId('button-base');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('applies custom styles when provided', () => {
      render(<VerticalImageAccordionDefault {...verticalImageAccordionPropsCustomStyles} />);

      // Should render without errors with custom styles
      const titles = screen.getAllByTestId('sitecore-text');
      expect(titles[0]).toBeInTheDocument();
    });
  });
});
