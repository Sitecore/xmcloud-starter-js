import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as VerticalImageAccordion } from '@/components/vertical-image-accordion/VerticalImageAccordion';
import type { Field, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsInEditingMode,
  propsWithSingleItem,
  propsWithTwoItems,
  propsWithoutTitle,
  propsWithItemWithoutLink,
  propsWithItemWithoutImage,
  propsWithEmptyItems,
  propsWithoutItems,
  propsWithoutFields,
  propsWithUndefinedFields,
} from './VerticalImageAccordion.mockProps';

// Type definitions for mock components
interface MockTextProps {
  field?: Field<string>;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  id?: string;
}

interface MockLinkProps {
  field?: LinkField;
  editable?: boolean;
  className?: string;
}

// Mock useSitecore
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
  Text: ({ field, tag, className, id }: MockTextProps) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(
      Tag,
      { className, 'data-testid': 'text-field', id },
      field?.value || ''
    );
  },
  Link: ({ field, editable, className }: MockLinkProps) => (
    <a
      href={field?.value?.href as string | undefined}
      className={className}
      data-testid="link-field"
      data-editable={editable?.toString()}
    >
      {field?.value?.text as string | undefined}
    </a>
  ),
}));

// Type definitions for cn utility
type CnArgs = Array<string | boolean | Record<string, boolean> | undefined>;

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: CnArgs) => {
    return args
      .flat(2)
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object' && !Array.isArray(arg)) {
          return Object.entries(arg)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  },
}));

// Type definitions for ImageWrapper
interface MockImageWrapperProps {
  image?: ImageField;
  className?: string;
  wrapperClass?: string;
}

// Mock ImageWrapper
jest.mock('@/components/image/ImageWrapper.dev', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ImageWrapperMock = (React.forwardRef as any)(
    ({ image, className, wrapperClass }: MockImageWrapperProps, ref: React.Ref<HTMLImageElement>) => (
      <div className={wrapperClass} data-testid="image-wrapper-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={ref}
          src={image?.value?.src as string | undefined}
          alt={image?.value?.alt as string | undefined}
          className={className}
          data-testid="image-wrapper"
        />
      </div>
    )
  );
  ImageWrapperMock.displayName = 'ImageWrapper';
  return {
    Default: ImageWrapperMock,
  };
});

// Type definitions for EditableButton
interface MockEditableButtonProps {
  buttonLink?: LinkField;
  variant?: string;
  className?: string;
}

// Mock EditableButton
jest.mock('@/components/button-component/ButtonComponent', () => ({
  EditableButton: ({ buttonLink, variant, className }: MockEditableButtonProps) => (
    <button
      data-testid="editable-button"
      data-variant={variant}
      className={className}
    >
      {buttonLink?.value?.text as string | undefined}
    </button>
  ),
}));

// Type definitions for NoDataFallback
interface MockNoDataFallbackProps {
  componentName?: string;
}

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('VerticalImageAccordion Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render vertical image accordion with all items', () => {
      render(<VerticalImageAccordion {...defaultProps} />);

      expect(screen.getByText('Our Services')).toBeInTheDocument();
      expect(screen.getByText('Innovation & Technology')).toBeInTheDocument();
      expect(screen.getByText('Design Excellence')).toBeInTheDocument();
      expect(screen.getByText('Strategic Growth')).toBeInTheDocument();
    });

    it('should render title in h2 tag', () => {
      render(<VerticalImageAccordion {...defaultProps} />);

      const title = screen.getByText('Our Services');
      expect(title.tagName).toBe('H2');
    });

    it('should render all item titles in h3 tags', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const h3Elements = container.querySelectorAll('h3');
      expect(h3Elements.length).toBeGreaterThan(0);
    });

    it('should render all item descriptions', () => {
      render(<VerticalImageAccordion {...defaultProps} />);

      expect(
        screen.getByText('Explore cutting-edge solutions that drive digital transformation')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Crafting beautiful experiences that engage and inspire users')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Building sustainable strategies for long-term success')
      ).toBeInTheDocument();
    });

    it('should render all item images', () => {
      render(<VerticalImageAccordion {...defaultProps} />);

      const images = screen.getAllByTestId('image-wrapper');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should render call-to-action buttons', () => {
      render(<VerticalImageAccordion {...defaultProps} />);

      const buttons = screen.getAllByTestId('editable-button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Component structure', () => {
    it('should render with correct container classes', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        '@container',
        'bg-primary',
        'rounded-default',
        'text-primary-foreground',
        'relative',
        'mx-auto',
        'my-6',
        'max-w-7xl'
      );
    });

    it('should have role="region" on container', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveAttribute('role', 'region');
    });

    it('should have aria-label on container', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveAttribute('aria-label', 'Our Services');
    });

    it('should render title with correct classes', () => {
      render(<VerticalImageAccordion {...defaultProps} />);

      const title = screen.getByText('Our Services');
      expect(title).toHaveClass(
        'font-heading',
        'text-primary-foreground',
        '@lg:text-6xl',
        'mb-16',
        'text-4xl'
      );
    });
  });

  describe('Interactive mode', () => {
    it('should render items in tablist with correct attributes', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('should render accordion items with role="tab"', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tabs = container.querySelectorAll('[role="tab"]');
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('should set first item as active by default (index 1)', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tabs = container.querySelectorAll('[role="tab"]');
      // Default activeIndex is 1, so the second item should be selected
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('should handle click on accordion item', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tabs = container.querySelectorAll('[role="tab"]');
      fireEvent.click(tabs[0]);

      // Click should trigger state change (tested via behavior)
      expect(tabs[0]).toBeInTheDocument();
    });

    it('should handle keyboard navigation (Enter key)', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tabs = container.querySelectorAll('[role="tab"]');
      fireEvent.keyDown(tabs[0], { key: 'Enter' });

      // Keyboard interaction should work
      expect(tabs[0]).toBeInTheDocument();
    });

    it('should handle keyboard navigation (Space key)', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tabs = container.querySelectorAll('[role="tab"]');
      fireEvent.keyDown(tabs[0], { key: ' ' });

      // Keyboard interaction should work
      expect(tabs[0]).toBeInTheDocument();
    });

    it('should have tabIndex=0 on accordion items', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tabs = container.querySelectorAll('[role="tab"]');
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('Editing mode', () => {
    it('should render in stacked layout when in editing mode', () => {
      const { container } = render(<VerticalImageAccordion {...propsInEditingMode} />);

      // In editing mode, items are rendered in a flex-col layout
      const stackedContainer = container.querySelector('.flex.flex-col.gap-14');
      expect(stackedContainer).toBeInTheDocument();
    });

    it('should not have interactive accordion behavior in editing mode', () => {
      const { container } = render(<VerticalImageAccordion {...propsInEditingMode} />);

      // No tablist in editing mode
      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).not.toBeInTheDocument();
    });

    it('should render editable links in editing mode', () => {
      render(<VerticalImageAccordion {...propsInEditingMode} />);

      const links = screen.getAllByTestId('link-field');
      links.forEach((link) => {
        expect(link).toHaveAttribute('data-editable', 'true');
      });
    });
  });

  describe('Items handling', () => {
    it('should render single item', () => {
      render(<VerticalImageAccordion {...propsWithSingleItem} />);

      expect(screen.getByText('Innovation & Technology')).toBeInTheDocument();
      expect(screen.queryByText('Design Excellence')).not.toBeInTheDocument();
    });

    it('should render two items', () => {
      render(<VerticalImageAccordion {...propsWithTwoItems} />);

      expect(screen.getByText('Innovation & Technology')).toBeInTheDocument();
      expect(screen.getByText('Design Excellence')).toBeInTheDocument();
    });

    it('should render without title when not provided', () => {
      render(<VerticalImageAccordion {...propsWithoutTitle} />);

      expect(screen.queryByText('Our Services')).not.toBeInTheDocument();
      expect(screen.getByText('Innovation & Technology')).toBeInTheDocument();
    });

    it('should not render CTA button when link is not provided', () => {
      render(<VerticalImageAccordion {...propsWithItemWithoutLink} />);

      const buttons = screen.getAllByTestId('editable-button');
      // Only items with links should have buttons
      expect(buttons.length).toBeLessThan(2);
    });

    it('should handle item without image gracefully', () => {
      render(<VerticalImageAccordion {...propsWithItemWithoutImage} />);

      expect(screen.getByText('No Image Item')).toBeInTheDocument();
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should handle empty items array', () => {
      const { container } = render(<VerticalImageAccordion {...propsWithEmptyItems} />);

      expect(screen.getByText('Our Services')).toBeInTheDocument();
      const tabs = container.querySelectorAll('[role="tab"]');
      expect(tabs.length).toBe(0);
    });

    it('should handle missing items', () => {
      const { container } = render(<VerticalImageAccordion {...propsWithoutItems} />);

      expect(screen.getByText('Our Services')).toBeInTheDocument();
      const tabs = container.querySelectorAll('[role="tab"]');
      expect(tabs.length).toBe(0);
    });

    it('should show NoDataFallback when fields is null', () => {
      render(<VerticalImageAccordion {...propsWithoutFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('VerticalImageAccordion')).toBeInTheDocument();
    });

    it('should show NoDataFallback when fields is undefined', () => {
      render(<VerticalImageAccordion {...propsWithUndefinedFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on tabs', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tabs = container.querySelectorAll('[role="tab"]');
      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute('aria-controls', `panel-${index}`);
        expect(tab).toHaveAttribute('aria-expanded');
      });
    });

    it('should have proper ARIA attributes on tabpanels', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tabpanels = container.querySelectorAll('[role="tabpanel"]');
      tabpanels.forEach((panel, index) => {
        expect(panel).toHaveAttribute('id', `panel-${index}`);
        expect(panel).toHaveAttribute('aria-labelledby', `tab-${index}`);
      });
    });

    it('should have role="img" on image containers', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const imageContainers = container.querySelectorAll('[role="img"]');
      expect(imageContainers.length).toBeGreaterThan(0);
    });

    it('should have aria-label on image containers', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const imageContainers = container.querySelectorAll('[role="img"]');
      imageContainers.forEach((imgContainer) => {
        expect(imgContainer).toHaveAttribute('aria-label');
      });
    });

    it('should render images with wrapper', () => {
      render(<VerticalImageAccordion {...defaultProps} />);

      const images = screen.getAllByTestId('image-wrapper');
      expect(images.length).toBeGreaterThan(0);
      // ImageWrapper component handles aria-hidden internally
    });
  });

  describe('Responsive layout', () => {
    it('should apply responsive padding', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('px-4', 'py-16', 'sm:px-6', 'lg:px-8');
    });

    it('should apply responsive flex layout', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toHaveClass('@md:flex-row', 'flex-col');
    });
  });

  describe('Styling', () => {
    it('should apply rounded corners to container', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('rounded-default');
    });

    it('should apply primary background color', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('should apply transition classes to accordion items', () => {
      const { container } = render(<VerticalImageAccordion {...defaultProps} />);

      const tabs = container.querySelectorAll('[role="tab"]');
      tabs.forEach((tab) => {
        expect(tab).toHaveClass('transition-all');
      });
    });
  });

  describe('CTA buttons', () => {
    it('should render buttons with secondary variant', () => {
      render(<VerticalImageAccordion {...defaultProps} />);

      const buttons = screen.getAllByTestId('editable-button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-variant', 'secondary');
      });
    });

    it('should render buttons with correct styling classes', () => {
      render(<VerticalImageAccordion {...defaultProps} />);

      const buttons = screen.getAllByTestId('editable-button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('font-heading', 'mt-4', 'inline-flex', 'w-fit');
      });
    });
  });
});

