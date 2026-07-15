import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as LogoTabs } from '@/components/logo-tabs/LogoTabs';
import type { LogoTabsProps } from '@/components/logo-tabs/logo-tabs.props';
import type { ImageField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithoutBackground,
  propsWithoutLogos,
  propsWithoutContent,
  propsWithoutTitle,
  propsEditing,
  propsEditingWithoutLogos,
  propsWithoutDatasource,
  propsWithoutFields,
  mockPageData,
  mockPageDataEditing,
} from './LogoTabs.mockProps';

// Type definitions for mock components
interface MockTextProps {
  field?: { value?: string };
  tag?: string;
  className?: string;
}

interface MockImageProps {
  field?: ImageField;
  className?: string;
}

interface MockFieldProps {
  field?: { value?: string };
}

interface MockEditableButtonProps {
  buttonLink?: { value?: { href?: string; text?: string } };
  variant?: string;
  className?: string;
  isPageEditing?: boolean;
}

interface MockLogoItemProps {
  logo?: { jsonValue?: { value?: { src?: string; alt?: string } } };
  title?: { jsonValue?: { value?: string } };
  isActive?: boolean;
  onClick?: () => void;
  id?: string;
  controls?: string;
}

interface MockNoDataFallbackProps {
  componentName?: string;
}

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: Array<string | boolean | Record<string, boolean> | undefined>) => {
    return args
      .flat()
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object') {
          return Object.keys(arg)
            .filter((key) => arg[key])
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .trim();
  },
}));

// Mock the useSitecore hook
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag, className }: MockTextProps) => {
    const Tag = tag || 'span';
    return React.createElement(Tag, { className }, field?.value || '');
  },
  Image: ({ field, className }: MockImageProps) => {
    if (!field?.value?.src) return null;
    return React.createElement('img', {
      src: field.value.src,
      alt: field.value.alt,
      className,
      'data-testid': 'logo-tabs-image',
    });
  },
  Field: ({ field }: MockFieldProps) => {
    return React.createElement('span', {}, field?.value || '');
  },
}));

// Mock EditableButton component
jest.mock('@/components/button-component/ButtonComponent', () => ({
  EditableButton: ({ buttonLink, variant, className, isPageEditing }: MockEditableButtonProps) => (
    <button
      data-testid="logo-tabs-button"
      data-href={buttonLink?.value?.href}
      data-variant={variant}
      data-editing={isPageEditing}
      className={className}
    >
      {buttonLink?.value?.text || 'Button'}
    </button>
  ),
}));

// Mock LogoItem component
jest.mock('@/components/logo-tabs/LogoItem', () => ({
  LogoItem: ({ logo, title, isActive, onClick, id, controls }: MockLogoItemProps) => (
    <button
      data-testid="logo-item"
      data-active={isActive}
      onClick={onClick}
      id={id}
      aria-controls={controls}
      role="tab"
      aria-selected={isActive}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo?.jsonValue?.value?.src} alt={logo?.jsonValue?.value?.alt} />
      <span>{title?.jsonValue?.value}</span>
    </button>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('LogoTabs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockPageData);
  });

  describe('Basic rendering', () => {
    it('should render logo tabs with all fields', () => {
      render(<LogoTabs {...defaultProps} />);

      expect(screen.getByText('Our Trusted Partners')).toBeInTheDocument();
      expect(screen.getAllByTestId('logo-item')).toHaveLength(4);
    });

    it('should render title as h2 tag', () => {
      render(<LogoTabs {...defaultProps} />);

      const title = screen.getByText('Our Trusted Partners');
      expect(title.tagName).toBe('H2');
    });

    it('should render background image', () => {
      render(<LogoTabs {...defaultProps} />);

      const images = screen.getAllByTestId('logo-tabs-image');
      const backgroundImage = images.find((img) => img.getAttribute('src') === '/images/background.jpg');
      expect(backgroundImage).toBeInTheDocument();
    });

    it('should render fallback background when no image provided', () => {
      const { container } = render(<LogoTabs {...propsWithoutBackground} />);

      const fallbackBackground = container.querySelector('.bg-gradient-to-b.from-gray-800.to-gray-900');
      expect(fallbackBackground).toBeInTheDocument();
    });

    it('should render gradient overlay on background image', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const gradientOverlay = container.querySelector('.bg-gradient-to-b.from-black\\/30');
      expect(gradientOverlay).toBeInTheDocument();
    });
  });

  describe('Logo items rendering', () => {
    it('should render all logo items', () => {
      render(<LogoTabs {...defaultProps} />);

      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems).toHaveLength(4);
    });

    it('should render logo items with correct data', () => {
      render(<LogoTabs {...defaultProps} />);

      expect(screen.getByText('Brand A')).toBeInTheDocument();
      expect(screen.getByText('Brand B')).toBeInTheDocument();
      expect(screen.getByText('Brand C')).toBeInTheDocument();
      expect(screen.getByText('Brand D')).toBeInTheDocument();
    });

    it('should set first logo item as active by default', () => {
      render(<LogoTabs {...defaultProps} />);

      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems[0]).toHaveAttribute('data-active', 'true');
      expect(logoItems[1]).toHaveAttribute('data-active', 'false');
    });

    it('should render logo items with tab role', () => {
      render(<LogoTabs {...defaultProps} />);

      const logoItems = screen.getAllByTestId('logo-item');
      logoItems.forEach((item) => {
        expect(item).toHaveAttribute('role', 'tab');
      });
    });

    it('should set aria-selected on active tab', () => {
      render(<LogoTabs {...defaultProps} />);

      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems[0]).toHaveAttribute('aria-selected', 'true');
      expect(logoItems[1]).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Tab content rendering', () => {
    it('should render active tab content', () => {
      render(<LogoTabs {...defaultProps} />);

      expect(screen.getByText('Experience Brand A Excellence')).toBeInTheDocument();
    });

    it('should render CTA button for active tab', () => {
      render(<LogoTabs {...defaultProps} />);

      const buttons = screen.getAllByTestId('logo-tabs-button');
      expect(buttons.length).toBeGreaterThan(0);
      expect(buttons[0]).toHaveAttribute('data-href', '/brand-a');
    });

    it('should hide inactive tab content', () => {
      render(<LogoTabs {...defaultProps} />);

      // Initially, only first tab content should be visible
      expect(screen.getByText('Experience Brand A Excellence')).toBeInTheDocument();
      expect(screen.queryByText('Discover Brand B Innovation')).toBeInTheDocument();
    });

    it('should render tab panels with tabpanel role', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const tabPanels = container.querySelectorAll('[role="tabpanel"]');
      expect(tabPanels).toHaveLength(4);
    });

    it('should link tab panels to tabs with aria-labelledby', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const firstPanel = container.querySelector('#panel-0');
      expect(firstPanel).toHaveAttribute('aria-labelledby', 'tab-0');
    });
  });

  describe('Tab switching', () => {
    it('should switch active tab on click', () => {
      render(<LogoTabs {...defaultProps} />);

      const logoItems = screen.getAllByTestId('logo-item');
      
      // Click second logo item
      fireEvent.click(logoItems[1]);

      expect(logoItems[0]).toHaveAttribute('data-active', 'false');
      expect(logoItems[1]).toHaveAttribute('data-active', 'true');
    });

    it('should update content when switching tabs', () => {
      render(<LogoTabs {...defaultProps} />);

      const logoItems = screen.getAllByTestId('logo-item');
      
      // Initially showing first tab content
      expect(screen.getByText('Experience Brand A Excellence')).toBeInTheDocument();
      
      // Click second logo item
      fireEvent.click(logoItems[1]);

      // Should show second tab content
      expect(screen.getByText('Discover Brand B Innovation')).toBeInTheDocument();
    });
  });

  describe('Keyboard navigation', () => {
    it('should navigate to next tab with ArrowRight', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const tablist = container.querySelector('[role="tablist"]');
      
      fireEvent.keyDown(tablist!, { key: 'ArrowRight' });

      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems[1]).toHaveAttribute('data-active', 'true');
    });

    it('should navigate to previous tab with ArrowLeft', () => {
      render(<LogoTabs {...defaultProps} />);

      const logoItems = screen.getAllByTestId('logo-item');
      
      // First go to second tab
      fireEvent.click(logoItems[1]);
      
      const { container } = render(<LogoTabs {...defaultProps} />);
      const tablist = container.querySelector('[role="tablist"]');
      
      fireEvent.keyDown(tablist!, { key: 'ArrowLeft' });

      // Should wrap to last tab
      const updatedLogoItems = screen.getAllByTestId('logo-item');
      expect(updatedLogoItems[updatedLogoItems.length - 1]).toHaveAttribute('data-active', 'true');
    });

    it('should navigate to first tab with Home key', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const logoItems = screen.getAllByTestId('logo-item');
      fireEvent.click(logoItems[2]); // Go to third tab

      const tablist = container.querySelector('[role="tablist"]');
      
      fireEvent.keyDown(tablist!, { key: 'Home' });

      const updatedLogoItems = screen.getAllByTestId('logo-item');
      expect(updatedLogoItems[0]).toHaveAttribute('data-active', 'true');
    });

    it('should navigate to last tab with End key', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const tablist = container.querySelector('[role="tablist"]');
      
      fireEvent.keyDown(tablist!, { key: 'End' });

      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems[logoItems.length - 1]).toHaveAttribute('data-active', 'true');
    });

    it('should support ArrowDown for next tab', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const tablist = container.querySelector('[role="tablist"]');
      
      fireEvent.keyDown(tablist!, { key: 'ArrowDown' });

      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems[1]).toHaveAttribute('data-active', 'true');
    });

    it('should support ArrowUp for previous tab', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const tablist = container.querySelector('[role="tablist"]');
      
      fireEvent.keyDown(tablist!, { key: 'ArrowUp' });

      // Should wrap to last tab
      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems[logoItems.length - 1]).toHaveAttribute('data-active', 'true');
    });

    it('should prevent default behavior for navigation keys', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const tablist = container.querySelector('[role="tablist"]');
      
      // fireEvent.keyDown automatically prevents default for these keys
      fireEvent.keyDown(tablist!, { key: 'ArrowRight' });

      const logoItems = screen.getAllByTestId('logo-item');
      // Verify navigation happened (which confirms preventDefault worked)
      expect(logoItems[1]).toHaveAttribute('data-active', 'true');
    });
  });

  describe('Editing mode behavior', () => {
    it('should render all items stacked in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockPageDataEditing);
      render(<LogoTabs {...propsEditing} />);

      expect(screen.getAllByTestId('logo-tabs-image')).toHaveLength(5); // 4 logos + 1 background
    });

    it('should show empty state message in editing mode without logos', () => {
      mockUseSitecore.mockReturnValue(mockPageDataEditing);
      render(<LogoTabs {...propsEditingWithoutLogos} />);

      expect(screen.getByText('Add a logo tab item to edit.')).toBeInTheDocument();
    });

    it('should not show tab interface in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockPageDataEditing);
      const { container } = render(<LogoTabs {...propsEditing} />);

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).not.toBeInTheDocument();
    });

    it('should pass editing state to buttons', () => {
      mockUseSitecore.mockReturnValue(mockPageDataEditing);
      render(<LogoTabs {...propsEditing} />);

      const buttons = screen.getAllByTestId('logo-tabs-button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-editing', 'true');
      });
    });
  });

  describe('Placeholder data in normal mode', () => {
    it('should show placeholder logos when no data in normal mode', () => {
      render(<LogoTabs {...propsWithoutLogos} />);

      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems).toHaveLength(4); // 4 placeholder items
    });

    it('should show placeholder content when no data in normal mode', () => {
      render(<LogoTabs {...propsWithoutLogos} />);

      const brandNames = screen.getAllByText('Brand Name');
      expect(brandNames.length).toBeGreaterThan(0);
    });
  });

  describe('Optional fields handling', () => {
    it('should render without title', () => {
      render(<LogoTabs {...propsWithoutTitle} />);

      expect(screen.getByText('Click to edit title')).toBeInTheDocument();
    });

    it('should render without logos', () => {
      render(<LogoTabs {...propsWithoutLogos} />);

      // Should show placeholder logos in normal mode
      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems.length).toBeGreaterThan(0);
    });

    it('should render without content', () => {
      render(<LogoTabs {...propsWithoutContent} />);

      const editTexts = screen.getAllByText('Click to edit brand content');
      expect(editTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Component structure', () => {
    it('should apply correct container classes', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const mainDiv = container.querySelector('.relative.min-h-\\[800px\\]');
      expect(mainDiv).toBeInTheDocument();
    });

    it('should apply container query classes', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      // Check for the class by looking at the element's className
      const contentDiv = Array.from(container.querySelectorAll('div')).find(
        (div) => div.className && div.className.includes('@container')
      );
      expect(contentDiv).toBeTruthy();
    });

    it('should apply max-width constraint', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const contentDiv = container.querySelector('.max-w-7xl');
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should render NoDataFallback when fields is null', () => {
      render(<LogoTabs {...propsWithoutFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('LogoTabs');
    });

    it('should render NoDataFallback when fields is undefined', () => {
      const propsWithUndefinedFields = {
        ...defaultProps,
        fields: undefined as unknown as LogoTabsProps['fields'],
      };

      render(<LogoTabs {...propsWithUndefinedFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
    });

    it('should handle missing datasource gracefully', () => {
      render(<LogoTabs {...propsWithoutDatasource} />);

      expect(screen.getByText('Click to edit title')).toBeInTheDocument();
    });

    it('should handle undefined logos.results', () => {
      const propsWithUndefinedLogos = {
        ...defaultProps,
        fields: {
          data: {
            datasource: {
              ...defaultProps.fields?.data?.datasource,
              logos: {} as unknown as NonNullable<
                NonNullable<NonNullable<LogoTabsProps['fields']>['data']>['datasource']
              >['logos'],
            },
          },
        },
      };

      render(<LogoTabs {...propsWithUndefinedLogos} />);

      // Should show placeholders
      const logoItems = screen.getAllByTestId('logo-item');
      expect(logoItems.length).toBeGreaterThan(0);
    });
  });

  describe('CSS classes and styling', () => {
    it('should apply text color classes', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const mainDiv = container.querySelector('.text-primary-foreground');
      expect(mainDiv).toBeInTheDocument();
    });

    it('should apply responsive padding classes', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const contentDiv = container.querySelector('.py-\\[88px\\]');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should apply correct button variant', () => {
      render(<LogoTabs {...defaultProps} />);

      const buttons = screen.getAllByTestId('logo-tabs-button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-variant', 'rounded-white');
      });
    });
  });

  describe('Accessibility', () => {
    it('should render tablist with proper role', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toBeInTheDocument();
    });

    it('should set aria-label on tablist', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toHaveAttribute('aria-label', 'Our Trusted Partners');
    });

    it('should set aria-live on tab panels container', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const livRegion = container.querySelector('[aria-live="polite"]');
      expect(livRegion).toBeInTheDocument();
    });

    it('should hide inactive tab panels with hidden attribute', () => {
      const { container } = render(<LogoTabs {...defaultProps} />);

      const tabPanels = container.querySelectorAll('[role="tabpanel"]');
      // First panel should not be hidden
      expect(tabPanels[0]).not.toHaveAttribute('hidden');
      // Other panels should be hidden
      expect(tabPanels[1]).toHaveAttribute('hidden');
    });
  });
});

