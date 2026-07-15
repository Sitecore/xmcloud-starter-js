import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccordionBlockOneColumnTitleLeft } from '@/components/accordion-block/AccordionBlockOneColumnTitleLeft.dev';
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

describe('AccordionBlockOneColumnTitleLeft Component', () => {
  it('renders accordion with two-column layout and title on left', () => {
    render(<AccordionBlockOneColumnTitleLeft {...mockAccordionProps} />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion-block-item')).toHaveLength(4);
  });

  it('renders heading with correct styling classes', () => {
    render(<AccordionBlockOneColumnTitleLeft {...mockAccordionProps} />);

    const heading = screen
      .getAllByTestId('sitecore-text')
      .find((el) => el.textContent === 'Frequently Asked Questions');
    expect(heading).toHaveClass(
      'max-w-screen-sm',
      'text-pretty',
      'font-light',
      'leading-tight',
      'tracking-tighter',
      'antialiased'
    );
  });

  it('renders description and CTA button below accordion items', () => {
    render(<AccordionBlockOneColumnTitleLeft {...mockAccordionProps} />);

    expect(
      screen.getByText('Find answers to common questions about our products and services.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toHaveAttribute('data-variant', 'secondary');
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('handles editing mode by keeping all accordions open', () => {
    render(<AccordionBlockOneColumnTitleLeft {...mockAccordionPropsEditing} />);

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveAttribute('data-type', 'multiple');
    expect(accordion).toHaveAttribute(
      'data-value',
      'accordion-block-item-1,accordion-block-item-2,accordion-block-item-3,accordion-block-item-4'
    );
  });

  it('applies correct component structure and CSS classes', () => {
    const { container } = render(<AccordionBlockOneColumnTitleLeft {...mockAccordionProps} />);

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

    const contentWrapper = container.querySelector(
      '[data-component="AccordionBlockContentWrapper"]'
    );
    expect(contentWrapper).toBeInTheDocument();
  });

  it('renders two-column grid layout on desktop', () => {
    const { container } = render(<AccordionBlockOneColumnTitleLeft {...mockAccordionProps} />);

    const twoColumnGrid = container.querySelector('.\\@md\\:grid.\\@md\\:grid-cols-2');
    expect(twoColumnGrid).toBeInTheDocument();
  });

  it('shows primary section with correct responsive styling', () => {
    const { container } = render(<AccordionBlockOneColumnTitleLeft {...mockAccordionProps} />);

    const primarySection = container.querySelector('.bg-primary');
    expect(primarySection).toBeInTheDocument();
    expect(primarySection).toHaveClass(
      '@sm:flex-row',
      '@sm:text-start',
      '@md:flex-col',
      '@md:text-center',
      '@lg:flex-row',
      '@lg:text-start',
      'mt-6',
      'flex',
      'flex-col',
      'flex-nowrap',
      'items-center',
      'gap-4',
      'p-7',
      'text-center'
    );
  });

  it('renders accordion with correct grid classes', () => {
    render(<AccordionBlockOneColumnTitleLeft {...mockAccordionProps} />);

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveClass('@md:gap-11', 'grid', 'w-full', 'gap-8', 'p-0');
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
      <AccordionBlockOneColumnTitleLeft {...propsWithoutDescriptionAndLink} />
    );
    const primarySection = container.querySelector('.bg-primary');
    expect(primarySection).not.toBeInTheDocument();
  });

  it('applies custom styles from params', () => {
    const propsWithCustomStyles = {
      ...mockAccordionProps,
      params: { styles: 'custom-one-column-class' },
    };

    const { container } = render(<AccordionBlockOneColumnTitleLeft {...propsWithCustomStyles} />);
    const component = container.querySelector('[data-component="AccordionBlock"]');
    expect(component).toHaveClass('custom-one-column-class');
  });

  it('renders minimal content correctly', () => {
    render(<AccordionBlockOneColumnTitleLeft {...mockAccordionPropsMinimal} />);

    expect(screen.getByText('Basic FAQ')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion-block-item')).toHaveLength(1);
  });

  it('renders fallback when no fields provided', () => {
    const propsWithoutFields = {
      fields: undefined,
      params: {},
      rendering: { componentName: 'AccordionBlock' },
      isPageEditing: false,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<AccordionBlockOneColumnTitleLeft {...(propsWithoutFields as any)} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for Accordion Block')).toBeInTheDocument();
  });
});
