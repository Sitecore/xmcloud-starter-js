import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccordionBlockDefault } from '@/components/accordion-block/AccordionBlockDefault.dev';
import {
  mockAccordionProps,
  mockAccordionPropsMinimal,
  mockAccordionPropsEditing,
} from './accordion-block.mock.props';

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
}));

// Mock AccordionBlockItem component
jest.mock('@/components/accordion-block/AccordionBlockItem.dev', () => ({
  AccordionBlockItem: ({
    index,
    child,
    valuePrefix = 'accordion-block-item',
  }: {
    index: number;
    child: { heading: { jsonValue: { value?: string } } };
    valuePrefix?: string;
  }) => (
    <div data-testid="accordion-block-item" data-index={index} data-value-prefix={valuePrefix}>
      {child?.heading?.jsonValue?.value}
    </div>
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

describe('AccordionBlockDefault Component', () => {
  it('renders accordion with heading and accordion items', () => {
    render(<AccordionBlockDefault {...mockAccordionProps} />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion-block-item')).toHaveLength(4);
  });

  it('renders description and CTA button when provided', () => {
    render(<AccordionBlockDefault {...mockAccordionProps} />);

    expect(
      screen.getByText('Find answers to common questions about our products and services.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toHaveAttribute('data-variant', 'secondary');
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('handles editing mode by keeping all accordions open', () => {
    render(<AccordionBlockDefault {...mockAccordionPropsEditing} />);

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveAttribute('data-type', 'multiple');
    expect(accordion).toHaveAttribute(
      'data-value',
      'accordion-block-item-1,accordion-block-item-2,accordion-block-item-3,accordion-block-item-4'
    );
  });

  it('renders without description and button when not provided', () => {
    render(<AccordionBlockDefault {...mockAccordionPropsMinimal} />);

    expect(screen.getByText('Basic FAQ')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion-block-item')).toHaveLength(1);
    expect(screen.queryByText('Find answers to common questions')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editable-button')).not.toBeInTheDocument();
  });

  it('applies correct component structure and CSS classes', () => {
    const { container } = render(<AccordionBlockDefault {...mockAccordionProps} />);

    const component = container.querySelector('[data-component="AccordionBlock"]');
    expect(component).toBeInTheDocument();
    expect(component).toHaveClass(
      '@container',
      '@md:py-16',
      '@lg:py-20',
      'border-b-2',
      'border-t-2',
      'py-10'
    );

    const contentWrapper = container.querySelector(
      '[data-component="AccordionBlockContentWrapper"]'
    );
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper).toHaveClass('mx-auto', 'grid', 'max-w-screen-xl', 'gap-6');
  });

  it('applies custom styles from params', () => {
    const propsWithCustomStyles = {
      ...mockAccordionProps,
      params: { styles: 'custom-accordion-class' },
    };

    const { container } = render(<AccordionBlockDefault {...propsWithCustomStyles} />);
    const component = container.querySelector('[data-component="AccordionBlock"]');
    expect(component).toHaveClass('custom-accordion-class');
  });

  it('renders accordion items with correct grid layout', () => {
    render(<AccordionBlockDefault {...mockAccordionProps} />);

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveClass('@md:gap-11', 'grid', 'w-full', 'gap-8', 'p-0');
  });

  it('shows content wrapper in responsive grid layout', () => {
    const { container } = render(<AccordionBlockDefault {...mockAccordionProps} />);

    const gridContainer = container.querySelector(
      '.\\@md\\:grid.\\@md\\:grid-cols-\\[4fr\\,6fr\\]'
    );
    expect(gridContainer).toBeInTheDocument();
  });

  it('handles missing optional datasource properties gracefully', () => {
    const propsWithoutDescription = {
      ...mockAccordionProps,
      fields: {
        data: {
          datasource: {
            heading: mockAccordionProps.fields.data.datasource?.heading,
            link: {
              jsonValue: {
                value: {
                  href: '',
                  text: '',
                  linktype: 'internal',
                  url: '',
                  anchor: '',
                  target: '',
                },
              },
            },
            children: mockAccordionProps.fields.data.datasource?.children,
          },
        },
      },
    };

    expect(() => render(<AccordionBlockDefault {...propsWithoutDescription} />)).not.toThrow();
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });
});
