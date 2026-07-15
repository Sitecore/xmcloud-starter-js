import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccordionBlockCentered } from '@/components/accordion-block/AccordionBlockCentered.dev';
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

describe('AccordionBlockCentered Component', () => {
  it('renders accordion with centered layout', () => {
    render(<AccordionBlockCentered {...mockAccordionProps} />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion-block-item')).toHaveLength(4);
  });

  it('renders heading with centered styling and large text classes', () => {
    render(<AccordionBlockCentered {...mockAccordionProps} />);

    const heading = screen
      .getAllByTestId('sitecore-text')
      .find((el) => el.textContent === 'Frequently Asked Questions');
    expect(heading).toHaveClass(
      'font-heading',
      '@md:text-6xl',
      '@lg:text-7xl',
      'mx-auto',
      'max-w-screen-md',
      'text-pretty',
      'text-5xl',
      'font-light',
      'leading-[1.1]',
      'tracking-tighter',
      'antialiased'
    );
  });

  it('renders description and CTA button below centered accordion', () => {
    render(<AccordionBlockCentered {...mockAccordionProps} />);

    expect(
      screen.getByText('Find answers to common questions about our products and services.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toBeInTheDocument();
    expect(screen.getByTestId('editable-button')).toHaveAttribute('data-variant', 'secondary');
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('handles editing mode by keeping all accordions open', () => {
    render(<AccordionBlockCentered {...mockAccordionPropsEditing} />);

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveAttribute('data-type', 'multiple');
    expect(accordion).toHaveAttribute(
      'data-value',
      'accordion-block-item-1,accordion-block-item-2,accordion-block-item-3,accordion-block-item-4'
    );
  });

  it('applies correct component structure with centered data attribute', () => {
    const { container } = render(<AccordionBlockCentered {...mockAccordionProps} />);

    const component = container.querySelector('[data-component="AccordionBlockCentered"]');
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

  it('renders centered heading section with correct spacing', () => {
    const { container } = render(<AccordionBlockCentered {...mockAccordionProps} />);

    const headingSection = container.querySelector('.mb-12');
    expect(headingSection).toBeInTheDocument();
  });

  it('shows primary section with centered and responsive styling', () => {
    const { container } = render(<AccordionBlockCentered {...mockAccordionProps} />);

    const primarySection = container.querySelector('.bg-primary');
    expect(primarySection).toBeInTheDocument();
    expect(primarySection).toHaveClass(
      '@sm:flex-row',
      '@sm:text-start',
      '@md:flex-col',
      '@md:text-center',
      '@lg:flex-row',
      '@lg:text-start',
      'mx-auto',
      'mt-6',
      'flex',
      'w-full',
      'flex-col',
      'flex-nowrap',
      'items-center',
      'gap-4',
      'p-7',
      'text-center'
    );
  });

  it('renders accordion with correct gap and grid classes', () => {
    render(<AccordionBlockCentered {...mockAccordionProps} />);

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveClass('@md:gap-11', 'grid', 'w-full', 'gap-8', 'p-0');
  });

  it('applies custom styles from params', () => {
    const propsWithCustomStyles = {
      ...mockAccordionProps,
      params: { styles: 'custom-centered-class' },
    };

    const { container } = render(<AccordionBlockCentered {...propsWithCustomStyles} />);
    const component = container.querySelector('[data-component="AccordionBlockCentered"]');
    expect(component).toHaveClass('custom-centered-class');
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

    const { container } = render(<AccordionBlockCentered {...propsWithoutDescriptionAndLink} />);
    const primarySection = container.querySelector('.bg-primary');
    expect(primarySection).not.toBeInTheDocument();
  });

  it('renders minimal content correctly', () => {
    render(<AccordionBlockCentered {...mockAccordionPropsMinimal} />);

    expect(screen.getByText('Basic FAQ')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion-block-item')).toHaveLength(1);
  });

  it('renders fallback with correct component name when no fields provided', () => {
    const propsWithoutFields = {
      fields: undefined,
      params: {},
      rendering: { componentName: 'AccordionBlock' },
      isPageEditing: false,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<AccordionBlockCentered {...(propsWithoutFields as any)} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for Accordion Block Centered')).toBeInTheDocument();
  });

  it('renders content wrapper with correct responsive padding classes', () => {
    const { container } = render(<AccordionBlockCentered {...mockAccordionProps} />);

    const contentWrapper = container.querySelector(
      '[data-component="AccordionBlockContentWrapper"]'
    );
    expect(contentWrapper).toHaveClass(
      '@xl:px-0',
      'mx-auto',
      'grid',
      'max-w-screen-xl',
      'gap-6',
      'px-0'
    );
  });
});
