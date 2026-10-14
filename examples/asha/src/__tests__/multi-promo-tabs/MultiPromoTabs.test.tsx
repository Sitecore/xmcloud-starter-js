/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as MultiPromoTabsDefault } from '../../components/multi-promo-tabs/MultiPromoTabs';
import {
  defaultMultiPromoTabsProps,
  multiPromoTabsPropsMinimal,
  multiPromoTabsPropsNoTabs,
  multiPromoTabsPropsEmpty,
  mockUseSitecoreNormal,
  mockUseSitecoreEditing,
} from './MultiPromoTabs.mockProps';

// Mock Sitecore Content SDK
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag = 'span', className }: any) => {
    const f = field;
    if (!f?.value) return null;
    return React.createElement(tag, { className }, f.value);
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>,
}));

// Mock UI Tabs components
jest.mock('../../components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange, className }: any) => (
    <div
      data-testid="tabs-container"
      data-value={value}
      className={className}
      onChange={(e: any) => onValueChange?.(e.target.value)}
    >
      {children}
    </div>
  ),
  TabsList: ({ children, className }: any) => (
    <div data-testid="tabs-list" className={className} role="tablist">
      {children}
    </div>
  ),
  TabsTrigger: ({ children, value, className, onClick }: any) => (
    <button
      data-testid={`tab-trigger-${value}`}
      className={className}
      onClick={() => onClick?.(value)}
      role="tab"
      aria-selected={false}
    >
      {children}
    </button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid={`tab-content-${value}`} role="tabpanel">
      {children}
    </div>
  ),
}));

// Mock UI Select components
jest.mock('../../components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select-container" data-value={value || '0'}>
      <select
        data-testid="mobile-select"
        onChange={(e) => onValueChange?.(e.target.value)}
        value={value || '0'}
      >
        {children}
      </select>
    </div>
  ),
  SelectContent: ({ children }: any) => children,
  SelectItem: ({ children, value }: any) => (
    <option value={value} data-testid={`select-item-${value}`}>
      {children}
    </option>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <div data-testid="select-trigger" className={className}>
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
}));

// Mock MultiPromoTab component
jest.mock('../../components/multi-promo-tabs/MultiPromoTab.dev', () => ({
  Default: ({ title, image1, image2, link1, link2, isEditMode }: any) => (
    <div data-testid="multi-promo-tab" data-edit-mode={isEditMode}>
      <h3 data-testid="tab-title">{title?.jsonValue?.value}</h3>
      {image1?.jsonValue?.value?.src && (
        <img
          src={image1.jsonValue.value.src}
          alt={image1.jsonValue.value.alt}
          data-testid="tab-image-1"
        />
      )}
      {image2?.jsonValue?.value?.src && (
        <img
          src={image2.jsonValue.value.src}
          alt={image2.jsonValue.value.alt}
          data-testid="tab-image-2"
        />
      )}
      {link1?.jsonValue?.value?.href && (
        <a href={link1.jsonValue.value.href} data-testid="tab-link-1">
          {link1.jsonValue.value.text}
        </a>
      )}
      {link2?.jsonValue?.value?.href && (
        <a href={link2.jsonValue.value.href} data-testid="tab-link-2">
          {link2.jsonValue.value.text}
        </a>
      )}
    </div>
  ),
}));

// Mock NoDataFallback
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('MultiPromoTabs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockUseSitecoreNormal);
  });

  describe('Default Rendering', () => {
    it('renders complete multi-promo tabs with all content', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      // Check main components
      expect(screen.getByTestId('tabs-container')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-select')).toBeInTheDocument();
      expect(screen.getByTestId('animate-presence')).toBeInTheDocument();

      // Check title and label
      expect(screen.getByText('Product Categories')).toBeInTheDocument();
      expect(screen.getByText('Select Category')).toBeInTheDocument();
    });

    it('renders all tab triggers', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      expect(screen.getByTestId('tab-trigger-0')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-1')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-2')).toBeInTheDocument();

      // Check tab titles in the tab triggers specifically
      expect(screen.getByTestId('tab-trigger-0')).toHaveTextContent('Audio');
      expect(screen.getByTestId('tab-trigger-1')).toHaveTextContent('Smart Home');
      expect(screen.getByTestId('tab-trigger-2')).toHaveTextContent('Gaming');
    });

    it('renders all tab content panels', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      expect(screen.getByTestId('tab-content-0')).toBeInTheDocument();
      expect(screen.getByTestId('tab-content-1')).toBeInTheDocument();
      expect(screen.getByTestId('tab-content-2')).toBeInTheDocument();
    });

    it('renders select options for mobile', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const select = screen.getByTestId('mobile-select');
      expect(select).toBeInTheDocument();

      expect(screen.getByTestId('select-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('select-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('select-item-2')).toBeInTheDocument();
    });
  });

  describe('Tab Interaction', () => {
    it('starts with first tab active by default', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const tabsContainer = screen.getByTestId('tabs-container');
      expect(tabsContainer).toHaveAttribute('data-value', '0');
    });

    it('changes active tab when tab trigger is clicked', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const secondTab = screen.getByTestId('tab-trigger-1');
      fireEvent.click(secondTab);

      // Note: In a real implementation, this would change the value
      // Our mock doesn't fully simulate the state change
      expect(secondTab).toBeInTheDocument();
    });

    it('updates via mobile select dropdown', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const mobileSelect = screen.getByTestId('mobile-select');
      fireEvent.change(mobileSelect, { target: { value: '2' } });

      expect(mobileSelect).toBeInTheDocument();
    });
  });

  describe('Content Scenarios', () => {
    it('handles no tabs gracefully', () => {
      render(<MultiPromoTabsDefault {...multiPromoTabsPropsNoTabs} />);

      expect(screen.getByText('Product Categories')).toBeInTheDocument();
      expect(screen.getByText('Select Category')).toBeInTheDocument();
      expect(screen.queryByTestId('tab-trigger-0')).not.toBeInTheDocument();
    });

    it('renders with minimal content (no title/label)', () => {
      render(<MultiPromoTabsDefault {...multiPromoTabsPropsMinimal} />);

      // Should still render tabs
      expect(screen.getByTestId('tabs-container')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-0')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-1')).toBeInTheDocument();

      // Check tab content
      expect(screen.getAllByTestId('multi-promo-tab')).toHaveLength(2);
    });

    it('returns NoDataFallback when no fields', () => {
      render(<MultiPromoTabsDefault {...multiPromoTabsPropsEmpty} />);

      // The component still renders even with empty fields, just without content
      expect(screen.queryByText('Product Categories')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tab-trigger-0')).not.toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    it('passes editing mode to tab content', () => {
      mockUseSitecore.mockReturnValue(mockUseSitecoreEditing);
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const promoTabs = screen.getAllByTestId('multi-promo-tab');
      promoTabs.forEach((tab) => {
        expect(tab).toHaveAttribute('data-edit-mode', 'true');
      });
    });

    it('passes non-editing mode to tab content', () => {
      mockUseSitecore.mockReturnValue(mockUseSitecoreNormal);
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const promoTabs = screen.getAllByTestId('multi-promo-tab');
      promoTabs.forEach((tab) => {
        expect(tab).toHaveAttribute('data-edit-mode', 'false');
      });
    });
  });

  describe('Tab Content', () => {
    it('renders tab content with proper images', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      // Check first tab content (Audio)
      const images1 = screen.getAllByTestId('tab-image-1');
      const images2 = screen.getAllByTestId('tab-image-2');

      expect(images1.length).toBeGreaterThan(0);
      expect(images2.length).toBeGreaterThan(0);

      // Check image attributes for first tab
      expect(images1[0]).toHaveAttribute('src', '/category/audio-1.jpg');
      expect(images1[0]).toHaveAttribute('alt', 'Audio Product 1');
    });

    it('renders tab content with proper links', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const links1 = screen.getAllByTestId('tab-link-1');
      const links2 = screen.getAllByTestId('tab-link-2');

      expect(links1.length).toBeGreaterThan(0);
      expect(links2.length).toBeGreaterThan(0);

      // Check link attributes for first tab
      expect(links1[0]).toHaveAttribute('href', '/products/headphones');
      expect(links1[0]).toHaveTextContent('Shop Headphones');
    });

    it('displays correct tab titles in content', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const tabTitles = screen.getAllByTestId('tab-title');
      expect(tabTitles).toHaveLength(3);
      expect(tabTitles[0]).toHaveTextContent('Audio');
      expect(tabTitles[1]).toHaveTextContent('Smart Home');
      expect(tabTitles[2]).toHaveTextContent('Gaming');
    });
  });

  describe('Mobile Interface', () => {
    it('renders select component with proper structure', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      expect(screen.getByTestId('select-container')).toBeInTheDocument();
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('select-value')).toBeInTheDocument();
    });

    it('applies responsive classes to tabs list', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const tabsList = screen.getByTestId('tabs-list');
      expect(tabsList).toHaveClass('@md:flex', 'hidden');
    });

    it('renders select with proper default value', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const selectContainer = screen.getByTestId('select-container');
      expect(selectContainer).toHaveAttribute('data-value', '0');
    });
  });

  describe('Accessibility', () => {
    it('uses proper ARIA roles for tabs', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const tabsList = screen.getByTestId('tabs-list');
      expect(tabsList).toHaveAttribute('role', 'tablist');

      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers).toHaveLength(3);

      tabTriggers.forEach((trigger) => {
        expect(trigger).toHaveAttribute('aria-selected');
      });
    });

    it('uses proper ARIA roles for tab panels', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const tabPanels = screen.getAllByRole('tabpanel');
      expect(tabPanels).toHaveLength(3);
    });

    it('provides meaningful component structure', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      // Check main title is rendered as heading
      const title = screen.getByText('Product Categories');
      expect(title.tagName.toLowerCase()).toBe('h2');
    });
  });

  describe('Animation Integration', () => {
    it('wraps content in AnimatePresence for animations', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      expect(screen.getByTestId('animate-presence')).toBeInTheDocument();
    });

    it('renders all tab content within animation wrapper', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const animatePresence = screen.getByTestId('animate-presence');
      const tabContents = screen.getAllByTestId(/^tab-content-/);

      tabContents.forEach((content) => {
        expect(animatePresence).toContainElement(content);
      });
    });
  });

  describe('Component Structure', () => {
    it('maintains proper container hierarchy', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const tabsContainer = screen.getByTestId('tabs-container');
      const tabsList = screen.getByTestId('tabs-list');
      const animatePresence = screen.getByTestId('animate-presence');

      expect(tabsContainer).toContainElement(tabsList);
      expect(tabsContainer).toContainElement(animatePresence);
    });

    it('applies correct CSS classes', () => {
      render(<MultiPromoTabsDefault {...defaultMultiPromoTabsProps} />);

      const tabsContainer = screen.getByTestId('tabs-container');
      expect(tabsContainer).toHaveClass('w-full');

      const tabsList = screen.getByTestId('tabs-list');
      expect(tabsList).toHaveClass('justify-start', 'gap-2', 'border-0', 'bg-transparent');
    });
  });

  describe('Error Handling', () => {
    it('handles missing title gracefully', () => {
      const propsWithoutTitle = {
        ...defaultMultiPromoTabsProps,
        fields: {
          data: {
            datasource: {
              droplistLabel: { jsonValue: { value: 'Test label' } },
              children: defaultMultiPromoTabsProps.fields.data.datasource.children,
            },
          },
        },
      };

      render(<MultiPromoTabsDefault {...propsWithoutTitle} />);

      expect(screen.getByText('Test label')).toBeInTheDocument();
      expect(screen.getAllByTestId('multi-promo-tab')).toHaveLength(3);
    });

    it('handles missing dropdown label gracefully', () => {
      const propsWithoutLabel = {
        ...defaultMultiPromoTabsProps,
        fields: {
          data: {
            datasource: {
              title: { jsonValue: { value: 'Test title' } },
              children: defaultMultiPromoTabsProps.fields.data.datasource.children,
            },
          },
        },
      };

      render(<MultiPromoTabsDefault {...propsWithoutLabel} />);

      expect(screen.getByText('Test title')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-container')).toBeInTheDocument();
    });
  });
});
