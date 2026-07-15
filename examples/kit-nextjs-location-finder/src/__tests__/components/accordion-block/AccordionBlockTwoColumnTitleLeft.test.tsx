import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccordionBlockTwoColumnTitleLeft } from '@/components/accordion-block/AccordionBlockTwoColumnTitleLeft.dev';
import {
  mockAccordionProps,
  mockAccordionPropsMany,
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

describe('AccordionBlockTwoColumnTitleLeft Component', () => {
  it('renders accordion with three-column layout and vertical title', () => {
    render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionProps} />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion')).toHaveLength(2); // Two accordion columns
    expect(screen.getAllByTestId('accordion-block-item')).toHaveLength(4);
  });

  it('splits accordion items correctly between two columns', () => {
    render(<AccordionBlockTwoColumnTitleLeft {...(mockAccordionPropsMany as unknown as React.ComponentProps<typeof AccordionBlockTwoColumnTitleLeft>)} />);

    const accordions = screen.getAllByTestId('accordion');
    expect(accordions).toHaveLength(2);

    // With 5 items, first column should have 3 items, second column should have 2
    const accordionItems = screen.getAllByTestId('accordion-block-item');
    expect(accordionItems).toHaveLength(5);
  });

  it('renders vertical heading with special styling', () => {
    render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionProps} />);

    const heading = screen
      .getAllByTestId('sitecore-text')
      .find((el) => el.textContent === 'Frequently Asked Questions');
    expect(heading).toHaveClass(
      '@md:text-5xl',
      '@md:vertical-text',
      'max-h-[420px]',
      'text-pretty',
      'text-4xl',
      'font-light',
      'leading-[1.1]',
      'tracking-tighter',
      'antialiased'
    );
  });

  it('handles editing mode by keeping both columns open with correct values', () => {
    render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionPropsEditing} />);

    const accordions = screen.getAllByTestId('accordion');

    // First column should have items 1-2
    expect(accordions[0]).toHaveAttribute(
      'data-value',
      'accordion-block-item-1,accordion-block-item-2'
    );

    // Second column should have items 3-4
    expect(accordions[1]).toHaveAttribute(
      'data-value',
      'accordion-block-item-3,accordion-block-item-4'
    );
  });

  it('renders description and CTA button in correct column position', () => {
    render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionProps} />);

    expect(
      screen.getByText('Find answers to common questions about our products and services.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toHaveAttribute('data-variant', 'secondary');
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('applies correct component structure and CSS classes', () => {
    const { container } = render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionProps} />);

    const component = container.querySelector('[data-component="AccordionBlock"]');
    expect(component).toBeInTheDocument();
    expect(component).toHaveClass(
      '@container',
      '@md:py-16',
      '@lg:py-20',
      'bg-background',
      'text-foreground',
      'border-b-2',
      'border-t-2',
      'py-10'
    );
  });

  it('renders three-column grid layout', () => {
    const { container } = render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionProps} />);

    const threeColumnGrid = container.querySelector('.\\@md\\:grid-cols-\\[0\\.5fr\\,4fr\\,4fr\\]');
    expect(threeColumnGrid).toBeInTheDocument();
  });

  it('positions heading in first column with correct CSS grid classes', () => {
    const { container } = render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionProps} />);

    const headingColumn = container.querySelector(
      '.\\@md\\:col-start-\\[1\\].\\@md\\:col-end-\\[2\\]'
    );
    expect(headingColumn).toBeInTheDocument();
    expect(headingColumn).toHaveClass('flex', 'flex-col');
  });

  it('positions accordion content in spanning columns with container query', () => {
    const { container } = render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionProps} />);

    const accordionSection = container.querySelector(
      '.\\@md\\:col-start-\\[2\\].\\@md\\:col-end-\\[4\\]'
    );
    expect(accordionSection).toBeInTheDocument();
    expect(accordionSection).toHaveClass('@container');
  });

  it('renders both accordion columns with different styling', () => {
    render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionProps} />);

    const accordions = screen.getAllByTestId('accordion');

    // First accordion
    expect(accordions[0]).toHaveClass(
      '@md:gap-11',
      'flex',
      'w-full',
      'flex-col',
      'items-stretch',
      'justify-start',
      'gap-8',
      'p-0'
    );

    // Second accordion
    expect(accordions[1]).toHaveClass(
      '@md:gap-11',
      '@md:mt-0',
      'mt-8',
      'flex',
      'w-full',
      'grid-cols-1',
      'flex-col',
      'items-stretch',
      'justify-start',
      'gap-8',
      'p-0'
    );
  });

  it('positions description/button section in correct grid column', () => {
    const { container } = render(<AccordionBlockTwoColumnTitleLeft {...mockAccordionProps} />);

    const descriptionSection = container.querySelector(
      '.\\@md\\:col-start-\\[2\\].\\@md\\:col-end-\\[3\\]'
    );
    expect(descriptionSection).toBeInTheDocument();
  });

  it('does not render description/button section when not in editing mode and no content', () => {
    const propsWithoutDescriptionAndLink = {
      ...mockAccordionProps,
      fields: {
        data: {
          datasource: {
            heading: mockAccordionProps.fields.data.datasource!.heading,
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
            children: mockAccordionProps.fields.data.datasource!.children,
          },
        },
      },
      isPageEditing: false,
    };

    const { container } = render(
      <AccordionBlockTwoColumnTitleLeft {...propsWithoutDescriptionAndLink} />
    );
    const primarySection = container.querySelector('.bg-primary');
    expect(primarySection).not.toBeInTheDocument();
  });

  it('renders fallback when no fields provided', () => {
    const propsWithoutFields = {
      fields: undefined,
      params: {},
      rendering: { componentName: 'AccordionBlock' },
      isPageEditing: false,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<AccordionBlockTwoColumnTitleLeft {...(propsWithoutFields as any)} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for Accordion Block')).toBeInTheDocument();
  });
});
