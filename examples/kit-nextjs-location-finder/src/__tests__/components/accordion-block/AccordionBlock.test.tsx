import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as AccordionBlock,
  Centered as AccordionBlockCentered,
  FiftyFiftyTitleAbove as AccordionBlockFiftyFifty,
  OneColumnTitleLeft as AccordionBlockOneColumn,
} from '@/components/accordion-block/AccordionBlock';
import { mockAccordionProps } from './accordion-block.mock.props';

// Mock Sitecore SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({
    field,
    tag = 'div',
    className,
  }: {
    field?: { value?: string };
    tag?: string;
    className?: string;
  }) => {
    const validTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const TagName = validTags.includes(tag) ? tag : 'div';

    return React.createElement(
      TagName,
      {
        'data-testid': 'sitecore-text',
        className,
      },
      field?.value
    );
  },
  RichText: ({
    field,
    tag = 'div',
    className,
  }: {
    field?: { value?: string };
    tag?: string;
    className?: string;
  }) => {
    const validTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const TagName = validTags.includes(tag) ? tag : 'div';

    return React.createElement(TagName, {
      'data-testid': 'sitecore-richtext',
      className,
      dangerouslySetInnerHTML: { __html: field?.value || '' },
    });
  },
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
}));

// Mock accordion UI components
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({
    children,
    className,
    type,
    value,
  }: React.PropsWithChildren<{
    className?: string;
    type?: string;
    value?: string[];
    onValueChange?: () => void;
  }>) => (
    <div
      data-testid="accordion"
      data-type={type}
      data-value={value?.join(',')}
      className={className}
    >
      {children}
    </div>
  ),
  AccordionItem: ({
    children,
    value,
    className,
  }: React.PropsWithChildren<{ value: string; className?: string }>) => (
    <div data-testid="accordion-item" data-value={value} className={className}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <button data-testid="accordion-trigger" className={className}>
      {children}
    </button>
  ),
  AccordionContent: ({ children }: React.PropsWithChildren) => (
    <div data-testid="accordion-content">{children}</div>
  ),
}));

// Mock EditableButton component
jest.mock('@/components/button-component/ButtonComponent', () => ({
  EditableButton: ({
    buttonLink,
    variant,
    isPageEditing,
  }: {
    buttonLink?: { value?: { text?: string; href?: string } };
    variant?: string;
    isPageEditing?: boolean;
  }) => (
    <button data-testid="editable-button" data-variant={variant} data-editing={isPageEditing}>
      {buttonLink?.value?.text}
    </button>
  ),
}));

describe('AccordionBlock Components', () => {
  describe('Default AccordionBlock', () => {
    it('renders accordion with heading and items', () => {
      render(<AccordionBlock {...mockAccordionProps} />);

      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.getAllByTestId('accordion-item')).toHaveLength(4);
    });

    it('renders description and link when provided', () => {
      render(<AccordionBlock {...mockAccordionProps} />);

      expect(
        screen.getByText('Find answers to common questions about our products and services.')
      ).toBeInTheDocument();
      expect(screen.getByTestId('editable-button')).toBeInTheDocument();
      expect(screen.getByText('Contact Support')).toBeInTheDocument();
    });

    it('applies correct CSS classes and data attributes', () => {
      const { container } = render(<AccordionBlock {...mockAccordionProps} />);

      const componentDiv = container.querySelector('[data-component="AccordionBlock"]');
      expect(componentDiv).toBeInTheDocument();
      expect(componentDiv).toHaveClass('@container', '@md:py-16', '@lg:py-20');
    });
  });

  describe('Centered AccordionBlock', () => {
    it('renders centered variant with correct structure', () => {
      render(<AccordionBlockCentered {...mockAccordionProps} />);

      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.getAllByTestId('accordion-item')).toHaveLength(4);
    });
  });

  describe('FiftyFifty AccordionBlock', () => {
    it('renders fifty-fifty layout with split columns', () => {
      render(<AccordionBlockFiftyFifty {...mockAccordionProps} />);

      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getAllByTestId('accordion')).toHaveLength(2); // Two columns
      expect(screen.getAllByTestId('accordion-item')).toHaveLength(4);
    });
  });

  describe('OneColumn AccordionBlock', () => {
    it('renders one-column layout', () => {
      render(<AccordionBlockOneColumn {...mockAccordionProps} />);

      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.getAllByTestId('accordion-item')).toHaveLength(4);
    });
  });
});
