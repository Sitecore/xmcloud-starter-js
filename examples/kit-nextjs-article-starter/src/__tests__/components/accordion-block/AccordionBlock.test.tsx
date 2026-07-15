import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as AccordionBlock } from '@/components/accordion-block/AccordionBlock';
import { AccordionBlockDefault } from '@/components/accordion-block/AccordionBlockDefault.dev';
import {
  defaultProps,
  propsWithoutDescription,
  propsWithoutLink,
  propsWithEmptyChildren,
  propsWithoutStyles,
  propsEditing,
  propsWithoutDatasource,
  propsWithoutFields,
  mockPageData,
} from './AccordionBlock.mockProps';
import type { Field, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { AccordionFields, AccordionItemProps } from '@/components/accordion-block/accordion-block.props';

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => {
    return args
      .flat()
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object' && arg !== null) {
          return Object.keys(arg)
            .filter((key) => (arg as Record<string, unknown>)[key])
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
  Text: ({ field, tag, className }: { field?: Field<string>; tag?: string; className?: string }) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className }, field?.value || '');
  },
  RichText: ({ field, tag, className }: { field?: RichTextField; tag?: string; className?: string }) => {
    const Tag = (tag || 'div') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, {
      className,
      dangerouslySetInnerHTML: { __html: field?.value || '' },
    });
  },
}));

// Mock the Button component
jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink }: { buttonLink?: { value?: { href?: string; text?: string } } }) => (
    <a href={buttonLink?.value?.href || '#'} data-testid="accordion-button">
      {buttonLink?.value?.text || 'Button'}
    </a>
  ),
}));

// Mock the Accordion components
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, type, className, value, onValueChange }: { children?: React.ReactNode; type?: string; className?: string; value?: string[]; onValueChange?: (value: string[]) => void }) => (
    <div
      className={className}
      data-testid="accordion"
      data-type={type}
      data-value={value ? JSON.stringify(value) : undefined}
      data-has-value-change={onValueChange ? 'true' : 'false'}
    >
      {children}
    </div>
  ),
  AccordionItem: ({ children, value, className }: { children?: React.ReactNode; value?: string; className?: string }) => (
    <div className={className} data-testid="accordion-item" data-value={value}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <button className={className} data-testid="accordion-trigger">
      {children}
    </button>
  ),
  AccordionContent: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="accordion-content">
      {children}
    </div>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName?: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('AccordionBlock Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockPageData);
  });

  describe('Default export with useSitecore', () => {
    it('should render accordion block with all fields in normal mode', () => {
      render(<AccordionBlock {...defaultProps} />);

      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByText('Find answers to common questions')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-button')).toBeInTheDocument();
      expect(screen.getByText('What is this product?')).toBeInTheDocument();
      expect(screen.getByText('How do I use it?')).toBeInTheDocument();
    });

    it('should pass isPageEditing from useSitecore to AccordionBlockDefault', () => {
      render(<AccordionBlock {...propsEditing} />);

      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveAttribute('data-has-value-change', 'true');
    });
  });

  describe('AccordionBlockDefault Component', () => {
    describe('Basic rendering', () => {
      it('should render accordion block with all fields', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
        expect(screen.getByText('Find answers to common questions')).toBeInTheDocument();
        expect(screen.getByTestId('accordion-button')).toBeInTheDocument();
        expect(screen.getByTestId('accordion')).toBeInTheDocument();
      });

      it('should render correct number of accordion items', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        const accordionItems = screen.getAllByTestId('accordion-item');
        expect(accordionItems).toHaveLength(3);
      });

      it('should render accordion items with correct content', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        expect(screen.getByText('What is this product?')).toBeInTheDocument();
        expect(screen.getByText('How do I use it?')).toBeInTheDocument();
        expect(screen.getByText('What is the pricing?')).toBeInTheDocument();
      });

      it('should render heading as h2 tag', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        const heading = screen.getByText('Frequently Asked Questions');
        expect(heading.tagName).toBe('H2');
      });

      it('should render description as p tag', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        const description = screen.getByText('Find answers to common questions');
        expect(description.tagName).toBe('P');
      });
    });

    describe('Optional fields handling', () => {
      it('should render without description field', () => {
        render(<AccordionBlockDefault {...propsWithoutDescription} />);

        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
        expect(screen.queryByText('Find answers to common questions')).not.toBeInTheDocument();
        expect(screen.getByTestId('accordion-button')).toBeInTheDocument();
      });

      it('should render without link field', () => {
        render(<AccordionBlockDefault {...propsWithoutLink} />);

        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
        expect(screen.getByText('Find answers to common questions')).toBeInTheDocument();
        expect(screen.queryByTestId('accordion-button')).not.toBeInTheDocument();
      });

      it('should render with empty children array', () => {
        render(<AccordionBlockDefault {...propsWithEmptyChildren} />);

        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
        expect(screen.queryAllByTestId('accordion-item')).toHaveLength(0);
      });
    });

    describe('Editing mode behavior', () => {
      it('should open all accordion items in editing mode', () => {
        render(<AccordionBlockDefault {...propsEditing} />);

        const accordion = screen.getByTestId('accordion');
        const valueAttr = accordion.getAttribute('data-value');
        
        expect(valueAttr).toBeTruthy();
        const values = JSON.parse(valueAttr as string);
        expect(values).toEqual([
          'accordion-block-item-1',
          'accordion-block-item-2',
          'accordion-block-item-3',
        ]);
      });

      it('should prevent accordion items from closing in editing mode', () => {
        render(<AccordionBlockDefault {...propsEditing} />);

        const accordion = screen.getByTestId('accordion');
        expect(accordion).toHaveAttribute('data-has-value-change', 'true');
      });

      it('should allow accordion interaction in normal mode', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        const accordion = screen.getByTestId('accordion');
        // In normal mode, value is undefined so data-value attribute won't be set
        expect(accordion).not.toHaveAttribute('data-value');
        expect(accordion).toHaveAttribute('data-has-value-change', 'false');
      });
    });

    describe('Component structure', () => {
      it('should render correct DOM structure', () => {
        const { container } = render(<AccordionBlockDefault {...defaultProps} />);

        const mainDiv = container.querySelector('[data-component="AccordionBlock"]');
        expect(mainDiv).toBeInTheDocument();
        expect(mainDiv).toHaveClass('bg-secondary', 'text-secondary-foreground', 'rounded-3xl');
      });

      it('should apply custom styles from params', () => {
        const { container } = render(<AccordionBlockDefault {...defaultProps} />);

        const mainDiv = container.querySelector('[data-component="AccordionBlock"]');
        expect(mainDiv).toHaveClass('custom-accordion-style');
      });

      it('should render without custom styles when not provided', () => {
        const { container } = render(<AccordionBlockDefault {...propsWithoutStyles} />);

        const mainDiv = container.querySelector('[data-component="AccordionBlock"]');
        expect(mainDiv).toBeInTheDocument();
        expect(mainDiv).not.toHaveClass('custom-accordion-style');
      });

      it('should set accordion type to multiple', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        const accordion = screen.getByTestId('accordion');
        expect(accordion).toHaveAttribute('data-type', 'multiple');
      });
    });

    describe('Button component integration', () => {
      it('should pass correct link field to Button component', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        const button = screen.getByTestId('accordion-button');
        expect(button).toHaveAttribute('href', '/contact-us');
        expect(button).toHaveTextContent('Contact Us');
      });
    });

    describe('Edge cases and fallbacks', () => {
      it('should render NoDataFallback when fields is null', () => {
        render(<AccordionBlockDefault {...propsWithoutFields} />);

        const fallback = screen.getByTestId('no-data-fallback');
        expect(fallback).toBeInTheDocument();
        expect(fallback).toHaveTextContent('Accordion Block');
      });

      it('should render NoDataFallback when fields is undefined', () => {
        const propsWithUndefinedFields = {
          ...defaultProps,
          fields: undefined as AccordionFields['fields'] | undefined,
        };

        render(<AccordionBlockDefault {...propsWithUndefinedFields} />);

        const fallback = screen.getByTestId('no-data-fallback');
        expect(fallback).toBeInTheDocument();
      });

      it('should handle missing datasource gracefully', () => {
        render(<AccordionBlockDefault {...propsWithoutDatasource} />);

        expect(screen.queryByText('Frequently Asked Questions')).not.toBeInTheDocument();
        expect(screen.queryAllByTestId('accordion-item')).toHaveLength(0);
      });

      it('should handle undefined children.results', () => {
        const propsWithUndefinedChildren = {
          ...defaultProps,
          fields: {
            data: {
              datasource: {
                heading: defaultProps.fields.data.datasource.heading,
                description: defaultProps.fields.data.datasource.description,
                link: defaultProps.fields.data.datasource.link,
                children: {} as { results?: AccordionItemProps[] },
              },
            },
          },
        };

        render(<AccordionBlockDefault {...propsWithUndefinedChildren} />);

        expect(screen.queryAllByTestId('accordion-item')).toHaveLength(0);
      });
    });

    describe('CSS classes and styling', () => {
      it('should apply container query classes', () => {
        const { container } = render(<AccordionBlockDefault {...defaultProps} />);

        const mainDiv = container.querySelector('[data-component="AccordionBlock"]');
        expect(mainDiv).toHaveClass('@container');
      });

      it('should apply correct heading classes', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        const heading = screen.getByText('Frequently Asked Questions');
        expect(heading).toHaveClass(
          'font-heading',
          'text-primary',
          'text-5xl',
          'font-normal',
          'tracking-tighter'
        );
      });

      it('should apply correct description classes', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        const description = screen.getByText('Find answers to common questions');
        expect(description).toHaveClass('font-body', 'text-base', 'font-normal');
      });
    });

    describe('Accordion item rendering', () => {
      it('should render accordion items in correct order', () => {
        render(<AccordionBlockDefault {...defaultProps} />);

        const accordionItems = screen.getAllByTestId('accordion-item');
        expect(accordionItems[0]).toHaveAttribute('data-value', 'accordion-block-item-1');
        expect(accordionItems[1]).toHaveAttribute('data-value', 'accordion-block-item-2');
        expect(accordionItems[2]).toHaveAttribute('data-value', 'accordion-block-item-3');
      });

      it('should render accordion item descriptions as HTML', () => {
        const { container } = render(<AccordionBlockDefault {...defaultProps} />);

        const descriptions = container.querySelectorAll('[data-testid="accordion-content"] div');
        expect(descriptions[0].innerHTML).toContain(
          '<p>This is a detailed description of the product.</p>'
        );
      });
    });
  });
});

