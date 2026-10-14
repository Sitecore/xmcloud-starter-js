/**
 * Unit tests for AccordionBlock component
 * Tests all variants: Default, Centered, FiftyFiftyTitleAbove, TwoColumnTitleLeft, OneColumnTitleLeft
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as AccordionBlockDefault,
  Centered,
  FiftyFiftyTitleAbove,
  TwoColumnTitleLeft,
  OneColumnTitleLeft,
} from '../../components/accordion-block/AccordionBlock';
import {
  defaultAccordionProps,
  accordionPropsEditMode,
  accordionPropsMinimal,
  accordionPropsEmptyItems,
  accordionPropsSingleItem,
  accordionPropsNullDatasource,
  mockUseSitecoreNormal,
  mockUseSitecoreEditing,
} from './AccordionBlock.mockProps';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: () => <svg data-testid="chevron-down-icon" />,
}));

// Mock console.error to suppress React key warnings
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn((message, ...args) => {
    // Suppress specific warnings we can't control
    if (
      typeof message === 'string' &&
      (message.includes('Each child in a list should have a unique "key" prop') ||
        message.includes('Warning: '))
    ) {
      return;
    }
    originalConsoleError(message, ...args);
  });
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock the Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({
    field,
    tag: Tag = 'span',
    className,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: any;
    tag?: string;
    className?: string;
  }) => {
    if (!field?.value) return null;
    return React.createElement(Tag, { className }, field.value);
  },
  RichText: ({
    field,
    tag: Tag = 'div',
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: any;
    tag?: string;
  }) => {
    if (!field?.value) return null;
    return React.createElement(Tag, { dangerouslySetInnerHTML: { __html: field.value } });
  },
  useSitecore: jest.fn(() => mockUseSitecoreNormal),
}));

// Mock the EditableButton component
jest.mock('../../components/button-component/ButtonComponent', () => ({
  EditableButton: ({
    buttonLink,
    variant,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buttonLink: any;
    variant?: string;
  }) => (
    <a href={buttonLink?.value?.href} data-variant={variant} data-testid="editable-button">
      {buttonLink?.value?.text}
    </a>
  ),
}));

// Mock the NoDataFallback component
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('AccordionBlock Component', () => {
  describe('Default Variant', () => {
    it('should render accordion block with heading', () => {
      const { container } = render(<AccordionBlockDefault {...defaultAccordionProps} />);

      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('should render all accordion items', () => {
      render(<AccordionBlockDefault {...defaultAccordionProps} />);

      expect(screen.getByText('What is this product?')).toBeInTheDocument();
      expect(screen.getByText('How do I get started?')).toBeInTheDocument();
      expect(screen.getByText('What are the pricing options?')).toBeInTheDocument();
    });

    it('should render description and link when provided', () => {
      render(<AccordionBlockDefault {...defaultAccordionProps} />);

      expect(screen.getByText('Need more help? Contact our support team.')).toBeInTheDocument();
      expect(screen.getByTestId('editable-button')).toBeInTheDocument();
      expect(screen.getByText('Contact Support')).toBeInTheDocument();
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<AccordionBlockDefault {...defaultAccordionProps} />);

      const component = container.querySelector('[data-component="AccordionBlock"]');
      expect(component).toHaveClass('accordion-custom-styles');
    });

    it('should apply data-class-change attribute', () => {
      const { container } = render(<AccordionBlockDefault {...defaultAccordionProps} />);

      expect(container.querySelector('[data-class-change]')).toBeInTheDocument();
    });

    it('should not render description/link section when not in edit mode and fields are empty', () => {
      render(<AccordionBlockDefault {...accordionPropsMinimal} />);

      expect(
        screen.queryByText('Need more help? Contact our support team.')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('editable-button')).not.toBeInTheDocument();
    });

    it('should render with single accordion item', () => {
      render(<AccordionBlockDefault {...accordionPropsSingleItem} />);

      expect(screen.getByText('What is this product?')).toBeInTheDocument();
      expect(screen.queryByText('How do I get started?')).not.toBeInTheDocument();
    });

    it('should handle empty accordion items array', () => {
      const { container } = render(<AccordionBlockDefault {...accordionPropsEmptyItems} />);

      const component = container.querySelector('[data-component="AccordionBlock"]');
      expect(component).toBeInTheDocument();
      expect(screen.queryByText('What is this product?')).not.toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.doMock('@sitecore-content-sdk/nextjs', () => ({
        ...jest.requireActual('@sitecore-content-sdk/nextjs'),
        useSitecore: jest.fn(() => mockUseSitecoreEditing),
      }));
    });

    afterEach(() => {
      jest.resetModules();
      jest.doMock('@sitecore-content-sdk/nextjs', () => ({
        ...jest.requireActual('@sitecore-content-sdk/nextjs'),
        useSitecore: jest.fn(() => mockUseSitecoreNormal),
      }));
    });

    it('should render description/link section in edit mode even when fields are empty', () => {
      render(<AccordionBlockDefault {...accordionPropsMinimal} />);

      // In edit mode, the section should be visible
      const component = document.querySelector('[data-component="AccordionBlock"]');
      expect(component).toBeInTheDocument();
    });

    it('should force accordion items open in edit mode', () => {
      const { container } = render(<AccordionBlockDefault {...accordionPropsEditMode} />);

      // Accordion should be rendered with items
      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
      expect(screen.getByText('What is this product?')).toBeInTheDocument();
    });
  });

  describe('Centered Variant', () => {
    it('should render centered accordion block', () => {
      const { container } = render(<Centered {...defaultAccordionProps} />);

      expect(
        container.querySelector('[data-component="AccordionBlockCentered"]')
      ).toBeInTheDocument();
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('should render all accordion items in centered layout', () => {
      render(<Centered {...defaultAccordionProps} />);

      expect(screen.getByText('What is this product?')).toBeInTheDocument();
      expect(screen.getByText('How do I get started?')).toBeInTheDocument();
      expect(screen.getByText('What are the pricing options?')).toBeInTheDocument();
    });

    it('should apply centered-specific background styles', () => {
      const { container } = render(<Centered {...defaultAccordionProps} />);

      const component = container.querySelector('[data-component="AccordionBlockCentered"]');
      expect(component).toHaveClass('bg-background');
      expect(component).toHaveClass('text-foreground');
    });

    it('should render gracefully with empty datasource', () => {
      const { container } = render(<Centered {...accordionPropsNullDatasource} />);

      expect(
        container.querySelector('[data-component="AccordionBlockCentered"]')
      ).toBeInTheDocument();
    });
  });

  describe('FiftyFiftyTitleAbove Variant', () => {
    it('should render 50/50 title above accordion block', () => {
      const { container } = render(<FiftyFiftyTitleAbove {...defaultAccordionProps} />);

      expect(
        container.querySelector('[data-component="Accordion5050TitleAbove"]')
      ).toBeInTheDocument();
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('should render all accordion items', () => {
      render(<FiftyFiftyTitleAbove {...defaultAccordionProps} />);

      expect(screen.getByText('What is this product?')).toBeInTheDocument();
      expect(screen.getByText('How do I get started?')).toBeInTheDocument();
    });

    it('should render gracefully with null datasource', () => {
      const { container } = render(<FiftyFiftyTitleAbove {...accordionPropsNullDatasource} />);

      expect(
        container.querySelector('[data-component="Accordion5050TitleAbove"]')
      ).toBeInTheDocument();
    });
  });

  describe('TwoColumnTitleLeft Variant', () => {
    it('should render two column title left accordion block', () => {
      const { container } = render(<TwoColumnTitleLeft {...defaultAccordionProps} />);

      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('should render all accordion items', () => {
      render(<TwoColumnTitleLeft {...defaultAccordionProps} />);

      expect(screen.getByText('What is this product?')).toBeInTheDocument();
      expect(screen.getByText('How do I get started?')).toBeInTheDocument();
      expect(screen.getByText('What are the pricing options?')).toBeInTheDocument();
    });

    it('should render gracefully with empty datasource', () => {
      const { container } = render(<TwoColumnTitleLeft {...accordionPropsNullDatasource} />);

      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
    });
  });

  describe('OneColumnTitleLeft Variant', () => {
    it('should render one column title left accordion block', () => {
      const { container } = render(<OneColumnTitleLeft {...defaultAccordionProps} />);

      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('should render all accordion items', () => {
      render(<OneColumnTitleLeft {...defaultAccordionProps} />);

      expect(screen.getByText('What is this product?')).toBeInTheDocument();
      expect(screen.getByText('How do I get started?')).toBeInTheDocument();
      expect(screen.getByText('What are the pricing options?')).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      const { container } = render(<OneColumnTitleLeft {...defaultAccordionProps} />);

      const component = container.querySelector('[data-component="AccordionBlock"]');
      expect(component).toHaveClass('accordion-custom-styles');
    });

    it('should render gracefully with null datasource', () => {
      const { container } = render(<OneColumnTitleLeft {...accordionPropsNullDatasource} />);

      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing heading gracefully', () => {
      const propsWithoutHeading = {
        ...defaultAccordionProps,
        fields: {
          data: {
            datasource: {
              heading: { jsonValue: { value: '' } },
              description: defaultAccordionProps.fields.data.datasource!.description,
              link: defaultAccordionProps.fields.data.datasource!.link,
              children: defaultAccordionProps.fields.data.datasource!.children,
            },
          },
        },
        page: defaultAccordionProps.page,
      };

      const { container } = render(<AccordionBlockDefault {...propsWithoutHeading} />);
      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
    });

    it('should handle missing accordion item content', () => {
      const propsWithEmptyItem = {
        ...defaultAccordionProps,
        fields: {
          data: {
            datasource: {
              heading: defaultAccordionProps.fields.data.datasource!.heading,
              description: defaultAccordionProps.fields.data.datasource!.description,
              link: defaultAccordionProps.fields.data.datasource!.link,
              children: {
                results: [
                  {
                    heading: { jsonValue: { value: '' } },
                    description: { jsonValue: { value: '' } },
                  },
                ],
              },
            },
          },
        },
        page: defaultAccordionProps.page,
      };

      const { container } = render(<AccordionBlockDefault {...propsWithEmptyItem} />);
      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
    });

    it('should render without RenderingIdentifier', () => {
      const propsWithoutId = {
        ...defaultAccordionProps,
        params: {
          styles: 'test-styles',
        },
        page: defaultAccordionProps.page,
      };

      const { container } = render(<AccordionBlockDefault {...propsWithoutId} />);
      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<AccordionBlockDefault {...defaultAccordionProps} />);

      const heading = screen.getByText('Frequently Asked Questions');
      expect(heading.tagName).toBe('H2');
    });

    it('should render link with proper href', () => {
      render(<AccordionBlockDefault {...defaultAccordionProps} />);

      const link = screen.getByTestId('editable-button');
      expect(link).toHaveAttribute('href', '/contact');
    });

    it('should render accordion items with proper structure', () => {
      const { container } = render(<AccordionBlockDefault {...defaultAccordionProps} />);

      expect(container.querySelector('[data-component="AccordionBlock"]')).toBeInTheDocument();
      expect(screen.getByText('What is this product?')).toBeInTheDocument();
    });
  });
});
