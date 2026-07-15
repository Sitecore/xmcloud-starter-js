import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion5050TitleAbove } from '@/components/accordion-block/Accordion5050TitleAbove.dev';
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
    // Handle custom Sitecore elements by defaulting to div
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

describe('Accordion5050TitleAbove Component', () => {
  it('renders accordion with heading and splits items into two columns', () => {
    render(<Accordion5050TitleAbove {...mockAccordionProps} />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion')).toHaveLength(2); // Two column layout
    expect(screen.getAllByTestId('accordion-block-item')).toHaveLength(4);
  });

  it('splits accordion items correctly between left and right columns', () => {
    render(<Accordion5050TitleAbove {...mockAccordionProps} />);

    const accordionItems = screen.getAllByTestId('accordion-block-item');

    // Check left column items (first 2 items)
    expect(accordionItems[0]).toHaveAttribute('data-value-prefix', 'left-item');
    expect(accordionItems[1]).toHaveAttribute('data-value-prefix', 'left-item');

    // Check right column items (last 2 items)
    expect(accordionItems[2]).toHaveAttribute('data-value-prefix', 'right-item');
    expect(accordionItems[3]).toHaveAttribute('data-value-prefix', 'right-item');
  });

  it('handles editing mode by keeping both columns open', () => {
    render(<Accordion5050TitleAbove {...mockAccordionPropsEditing} />);

    const accordions = screen.getAllByTestId('accordion');
    expect(accordions[0]).toHaveAttribute('data-value', 'left-item-1,left-item-2');
    expect(accordions[1]).toHaveAttribute('data-value', 'right-item-1,right-item-2');
  });

  it('renders description and CTA button in primary background section', () => {
    render(<Accordion5050TitleAbove {...mockAccordionProps} />);

    expect(
      screen.getByText('Find answers to common questions about our products and services.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toHaveAttribute('data-variant', 'secondary');
  });

  it('handles odd number of items correctly', () => {
    render(<Accordion5050TitleAbove {...mockAccordionPropsMinimal} />);

    const accordions = screen.getAllByTestId('accordion');
    expect(accordions).toHaveLength(2); // Still two columns

    const accordionItems = screen.getAllByTestId('accordion-block-item');
    expect(accordionItems).toHaveLength(1); // Only one item total
    expect(accordionItems[0]).toHaveAttribute('data-value-prefix', 'left-item'); // Goes to left column
  });

  it('applies correct component structure and CSS classes', () => {
    const { container } = render(<Accordion5050TitleAbove {...mockAccordionProps} />);

    const component = container.querySelector('[data-component="Accordion5050TitleAbove"]');
    expect(component).toBeInTheDocument();
    expect(component).toHaveClass(
      '@container',
      '@md:py-16',
      '@lg:py-20',
      'bg-background',
      'text-foreground'
    );

    const contentWrapper = container.querySelector(
      '[data-component="AccordionBlockContentWrapper"]'
    );
    expect(contentWrapper).toBeInTheDocument();
  });

  it('renders responsive grid layout for columns', () => {
    const { container } = render(<Accordion5050TitleAbove {...mockAccordionProps} />);

    const twoColumnGrid = container.querySelector('.\\@md\\:grid.\\@md\\:grid-cols-2');
    expect(twoColumnGrid).toBeInTheDocument();
  });

  it('shows primary section with correct styling', () => {
    const { container } = render(<Accordion5050TitleAbove {...mockAccordionProps} />);

    const primarySection = container.querySelector('.bg-primary');
    expect(primarySection).toBeInTheDocument();
    expect(primarySection).toHaveClass('text-center', 'p-7', 'flex', 'flex-col');
  });

  it('renders heading with proper typography classes', () => {
    render(<Accordion5050TitleAbove {...mockAccordionProps} />);

    const heading = screen
      .getAllByTestId('sitecore-text')
      .find((el) => el.textContent === 'Frequently Asked Questions');
    expect(heading).toHaveClass(
      'font-heading',
      '@md:text-6xl',
      '@lg:text-7xl',
      'text-5xl',
      'font-light'
    );
  });

  it('does not render description/button section when not in editing mode and no content', () => {
    const propsWithoutDescriptionAndLink = {
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
      isPageEditing: false,
    };

    const { container } = render(<Accordion5050TitleAbove {...propsWithoutDescriptionAndLink} />);
    const primarySection = container.querySelector('.bg-primary');
    expect(primarySection).not.toBeInTheDocument();
  });
});
