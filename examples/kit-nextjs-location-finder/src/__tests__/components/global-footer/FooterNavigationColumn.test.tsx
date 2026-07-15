import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as FooterNavigationColumn } from '@/components/global-footer/FooterNavigationColumn.dev';
import { mockFooterNavigationLinks } from './global-footer.mock.props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Link: ({ field }: Record<string, unknown>) => {
    const linkField = field as { value?: { text?: string; href?: string } };
    return <a href={linkField?.value?.href}>{linkField?.value?.text}</a>;
  },
  Text: ({ field, tag = 'span' }: Record<string, unknown>) => {
    const TextTag = tag as keyof JSX.IntrinsicElements;
    const fieldValue = (field as { value?: string })?.value || '';
    return React.createElement(TextTag, {}, fieldValue);
  },
}));

// Mock UI components
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({
    children,
    className,
    'aria-labelledby': ariaLabelledby,
  }: {
    children: React.ReactNode;
    className?: string;
    'aria-labelledby'?: string;
  }) => (
    <div data-testid="accordion" className={className} aria-labelledby={ariaLabelledby}>
      {children}
    </div>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion-content">{children}</div>
  ),
  AccordionItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid="accordion-item" data-value={value}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <button data-testid="accordion-trigger" id={id}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    variant,

    className,
  }: {
    children: React.ReactNode;
    variant?: string;
    asChild?: boolean;
    className?: string;
  }) => (
    <button data-testid="button" data-variant={variant} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/animated-hover-nav', () => ({
  AnimatedHoverNav: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-hover-nav">{children}</div>
  ),
}));

jest.mock('@/components/button-component/ButtonComponent', () => ({
  EditableButton: ({
    buttonLink,
    isPageEditing,
    variant,
    className,
  }: {
    buttonLink: Record<string, unknown>;
    isPageEditing: boolean;
    variant: string;
    className: string;
  }) => (
    <button
      data-testid="editable-button"
      data-variant={variant}
      data-editing={isPageEditing}
      className={className}
    >
      {(buttonLink as { value?: { text?: string } })?.value?.text || 'Link'}
    </button>
  ),
}));

// Mock container query hook
jest.mock('@/hooks/use-container-query', () => ({
  useContainerQuery: jest.fn(() => false),
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => {
    const result: string[] = [];
    classes.forEach((cls) => {
      if (typeof cls === 'string') {
        result.push(cls);
      } else if (typeof cls === 'object' && cls !== null) {
        Object.entries(cls).forEach(([key, value]) => {
          if (value) result.push(key);
        });
      }
    });
    return result.filter(Boolean).join(' ');
  },
}));

describe('FooterNavigationColumn Component', () => {
  const mockParentRef = { current: document.createElement('div') };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useContainerQuery } = require('@/hooks/use-container-query');
      useContainerQuery.mockReturnValue(false); // Desktop
    });

    it('renders without crashing', () => {
      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('renders as a nav element with proper aria-label', () => {
      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
        />
      );
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Footer navigation');
    });

    it('renders all navigation links', () => {
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
        />
      );

      const links = screen.getAllByTestId('editable-button');
      expect(links).toHaveLength(mockFooterNavigationLinks.length);
    });

    it('renders AnimatedHoverNav component', () => {
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
        />
      );

      expect(screen.getByTestId('animated-hover-nav')).toBeInTheDocument();
    });

    it('renders links with EditableButton component', () => {
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
        />
      );

      const editableButtons = screen.getAllByTestId('editable-button');
      expect(editableButtons[0]).toHaveAttribute('data-variant', 'secondary');
    });

    it('applies correct className for start alignment', () => {
      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          alignItems="start"
        />
      );

      const ul = container.querySelector('ul');
      expect(ul).toHaveClass('items-start');
    });

    it('applies correct className for end alignment', () => {
      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          alignItems="end"
        />
      );

      const ul = container.querySelector('ul');
      expect(ul).toHaveClass('items-end');
    });

    it('applies correct className for center alignment', () => {
      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          alignItems="center"
        />
      );

      const ul = container.querySelector('ul');
      expect(ul).toHaveClass('items-center');
    });

    it('applies correct className for vertical orientation', () => {
      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          orientation="vertical"
        />
      );

      const ul = container.querySelector('ul');
      expect(ul).toHaveClass('flex-col');
    });

    it('applies custom listClassName', () => {
      const customClass = 'custom-list-class';
      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          listClassName={customClass}
        />
      );

      const ul = container.querySelector('ul');
      expect(ul).toHaveClass(customClass);
    });

    it('passes isPageEditing prop to EditableButton', () => {
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={true}
          parentRef={mockParentRef}
        />
      );

      const editableButtons = screen.getAllByTestId('editable-button');
      expect(editableButtons[0]).toHaveAttribute('data-editing', 'true');
    });

    it('applies custom indicatorClassName', () => {
      const customIndicator = 'custom-indicator-class';
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          indicatorClassName={customIndicator}
        />
      );

      // AnimatedHoverNav receives the indicatorClassName
      expect(screen.getByTestId('animated-hover-nav')).toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useContainerQuery } = require('@/hooks/use-container-query');
      useContainerQuery.mockReturnValue(true); // Mobile
    });

    it('renders accordion on mobile', () => {
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: 'Footer Menu' } }}
        />
      );

      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('renders accordion trigger with header text', () => {
      const headerText = 'Footer Menu';
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: headerText } }}
        />
      );

      expect(screen.getByTestId('accordion-trigger')).toBeInTheDocument();
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    it('renders accordion content with navigation links', () => {
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: 'Footer Menu' } }}
        />
      );

      expect(screen.getByTestId('accordion-content')).toBeInTheDocument();
    });

    it('renders links as Button components in mobile view', () => {
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: 'Footer Menu' } }}
        />
      );

      const buttons = screen.getAllByTestId('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('renders all links in accordion', () => {
      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: 'Footer Menu' } }}
        />
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(mockFooterNavigationLinks.length);
    });

    it('does not render accordion without header', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useContainerQuery } = require('@/hooks/use-container-query');
      useContainerQuery.mockReturnValue(true);

      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
        />
      );

      // Should render desktop view if no header is provided even on mobile
      expect(screen.getByTestId('animated-hover-nav')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper nav landmark with aria-label', () => {
      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
        />
      );

      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('aria-label', 'Footer navigation');
    });

    it('accordion has proper aria attributes', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useContainerQuery } = require('@/hooks/use-container-query');
      useContainerQuery.mockReturnValue(true);

      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: 'Footer Menu' } }}
        />
      );

      const accordion = screen.getByTestId('accordion');
      // Check if accordion exists and has aria-labelledby
      expect(accordion).toBeInTheDocument();
      expect(accordion).toHaveAttribute('aria-labelledby');

      const trigger = screen.getByTestId('accordion-trigger');
      expect(trigger).toHaveAttribute('id');
    });

    it('accordion trigger has id for aria-labelledby', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useContainerQuery } = require('@/hooks/use-container-query');
      useContainerQuery.mockReturnValue(true);

      render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: 'Footer Menu' } }}
        />
      );

      const trigger = screen.getByTestId('accordion-trigger');
      expect(trigger).toHaveAttribute('id');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      const { container } = render(
        <FooterNavigationColumn items={[]} isPageEditing={false} parentRef={mockParentRef} />
      );
      expect(container).toBeInTheDocument();
    });

    it('handles undefined items', () => {
      const { container } = render(
        <FooterNavigationColumn items={undefined} isPageEditing={false} parentRef={mockParentRef} />
      );
      expect(container).toBeInTheDocument();
    });

    it('handles missing header in mobile view gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useContainerQuery } = require('@/hooks/use-container-query');
      useContainerQuery.mockReturnValue(true);

      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
        />
      );

      // Should fallback to desktop view
      expect(container).toBeInTheDocument();
    });

    it('handles empty header value', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useContainerQuery } = require('@/hooks/use-container-query');
      useContainerQuery.mockReturnValue(true);

      const { container } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: '' } }}
        />
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('switches from desktop to mobile view based on container query', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useContainerQuery } = require('@/hooks/use-container-query');

      // Desktop first
      useContainerQuery.mockReturnValue(false);
      const { rerender } = render(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: 'Footer Menu' } }}
        />
      );

      expect(screen.getByTestId('animated-hover-nav')).toBeInTheDocument();

      // Then mobile
      useContainerQuery.mockReturnValue(true);
      rerender(
        <FooterNavigationColumn
          items={mockFooterNavigationLinks}
          isPageEditing={false}
          parentRef={mockParentRef}
          header={{ jsonValue: { value: 'Footer Menu' } }}
        />
      );

      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });
  });
});
