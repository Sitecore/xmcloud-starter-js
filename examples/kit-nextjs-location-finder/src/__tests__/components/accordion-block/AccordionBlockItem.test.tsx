import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccordionBlockItem } from '@/components/accordion-block/AccordionBlockItem.dev';
import { mockAccordionProps } from './accordion-block.mock.props';

// Mock Sitecore SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, className }: { field?: { value?: string }; className?: string }) => (
    <span data-testid="sitecore-text" className={className}>
      {field?.value}
    </span>
  ),
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
}));

// Mock accordion UI components
jest.mock('@/components/ui/accordion', () => ({
  AccordionItem: ({
    children,
    value,
    className,
  }: React.PropsWithChildren<{ value: string; className?: string }>) => (
    <div data-testid="accordion-item" data-value={value} className={className}>
      {children}
    </div>
  ),
  AccordionTrigger: ({
    children,
    className,
    onClick,
  }: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) => (
    <button data-testid="accordion-trigger" className={className} onClick={onClick}>
      {children}
    </button>
  ),
  AccordionContent: ({ children }: React.PropsWithChildren) => (
    <div data-testid="accordion-content">{children}</div>
  ),
}));

describe('AccordionBlockItem Component', () => {
  const mockChild = mockAccordionProps.fields.data.datasource!.children.results[0]; // First FAQ item
  const defaultProps = {
    child: mockChild,
    index: 0,
  };

  it('renders accordion item with heading and content', () => {
    render(<AccordionBlockItem {...defaultProps} />);

    expect(screen.getByTestId('accordion-item')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-content')).toBeInTheDocument();
    expect(screen.getByText('What is our return policy?')).toBeInTheDocument();
  });

  it('generates correct value with default prefix', () => {
    render(<AccordionBlockItem {...defaultProps} />);

    const accordionItem = screen.getByTestId('accordion-item');
    expect(accordionItem).toHaveAttribute('data-value', 'accordion-block-item-1');
  });

  it('generates correct value with custom prefix', () => {
    render(<AccordionBlockItem {...defaultProps} valuePrefix="custom-prefix" />);

    const accordionItem = screen.getByTestId('accordion-item');
    expect(accordionItem).toHaveAttribute('data-value', 'custom-prefix-1');
  });

  it('handles different index values correctly', () => {
    render(<AccordionBlockItem {...defaultProps} index={5} />);

    const accordionItem = screen.getByTestId('accordion-item');
    expect(accordionItem).toHaveAttribute('data-value', 'accordion-block-item-6'); // index + 1
  });

  it('renders rich text content with HTML', () => {
    render(<AccordionBlockItem {...defaultProps} />);

    const richTextContent = screen.getByTestId('sitecore-richtext');
    expect(richTextContent).toBeInTheDocument();
    expect(richTextContent.innerHTML).toContain('We offer a 30-day return policy');
  });

  it('applies correct CSS classes to accordion item', () => {
    render(<AccordionBlockItem {...defaultProps} />);

    const accordionItem = screen.getByTestId('accordion-item');
    expect(accordionItem).toHaveClass('border-foreground', 'border-b', 'p-0');
  });

  it('applies correct CSS classes to accordion trigger', () => {
    render(<AccordionBlockItem {...defaultProps} />);

    const accordionTrigger = screen.getByTestId('accordion-trigger');
    expect(accordionTrigger).toHaveClass(
      'font-heading',
      'flex',
      'w-full',
      'justify-between',
      'py-4',
      'text-left',
      'text-base',
      'font-medium'
    );
  });

  it('applies correct CSS classes to text component', () => {
    render(<AccordionBlockItem {...defaultProps} />);

    const textComponent = screen.getByTestId('sitecore-text');
    expect(textComponent).toHaveClass('font-heading', 'text-left', 'text-base', 'font-medium');
  });

  it('applies correct CSS classes to content section', () => {
    const { container } = render(<AccordionBlockItem {...defaultProps} />);

    const contentDiv = container.querySelector('.font-body.py-4.pt-2.text-base.font-medium');
    expect(contentDiv).toBeInTheDocument();
  });

  it('handles missing description gracefully', () => {
    const childWithoutDescription = {
      ...mockChild,
      description: { jsonValue: { value: undefined } },
    };

    expect(() =>
      render(<AccordionBlockItem child={childWithoutDescription} index={0} />)
    ).not.toThrow();
  });

  it('renders multiple accordion items with different content', () => {
    const { rerender } = render(<AccordionBlockItem {...defaultProps} />);

    // First item
    expect(screen.getByText('What is our return policy?')).toBeInTheDocument();

    // Second item
    const secondChild = mockAccordionProps.fields.data.datasource!.children.results[1];
    rerender(<AccordionBlockItem child={secondChild} index={1} />);

    expect(screen.getByText('How do I track my order?')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item')).toHaveAttribute(
      'data-value',
      'accordion-block-item-2'
    );
  });

  it('handles accordion trigger interaction', () => {
    // Mock the AccordionTrigger to accept onClick
    jest.clearAllMocks();

    render(<AccordionBlockItem {...defaultProps} />);

    const trigger = screen.getByTestId('accordion-trigger');
    fireEvent.click(trigger);

    // Just verify the trigger is clickable (actual functionality would be handled by the Accordion component)
    expect(trigger).toBeInTheDocument();
  });

  it('renders correct structure for accessibility', () => {
    render(<AccordionBlockItem {...defaultProps} />);

    // Check that the structure follows expected accordion pattern
    const accordionItem = screen.getByTestId('accordion-item');
    const trigger = screen.getByTestId('accordion-trigger');
    const content = screen.getByTestId('accordion-content');

    expect(accordionItem).toContainElement(trigger);
    expect(accordionItem).toContainElement(content);
  });
});
