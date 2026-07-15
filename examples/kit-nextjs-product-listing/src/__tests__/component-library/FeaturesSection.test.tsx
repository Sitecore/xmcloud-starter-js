import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as FeaturesSectionDefault,
  FeaturesSection1,
  FeaturesSection2,
  FeaturesSection3,
  FeaturesSection4,
  FeaturesSection5,
  FeaturesSection6,
  FeaturesSection7,
  FeaturesSection8,
  FeaturesSection9,
  FeaturesSection10,
  FeaturesSection11,
  FeaturesSection12,
  FeaturesSection13,
  FeaturesSection14,
  FeaturesSection15,
  FeaturesSection16,
  FeaturesSection17,
  FeaturesSection18,
  FeaturesSection19,
  FeaturesSection20,
  FeaturesSection21,
  FeaturesSection22,
  FeaturesSection23,
  FeaturesSection24,
  FeaturesSection25,
} from '@/components/component-library/FeaturesSection';
import type { Page } from '@sitecore-content-sdk/nextjs';

/**
 * Mock page object for normal mode
 */
const mockPageNormal = {
  mode: {
    isEditing: false,
    isNormal: true,
    isPreview: false,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

// Mock Intersection Observer API
/* eslint-disable @typescript-eslint/no-explicit-any */
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.IntersectionObserver = MockIntersectionObserver as any;

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span data-testid="features-text">{field?.jsonValue?.value}</span>,
  RichText: ({ field }: any) => (
    <div data-testid="features-richtext">{field?.jsonValue?.value}</div>
  ),
  Link: ({ field, children }: any) => (
    <a href={field?.jsonValue?.value?.href} data-testid="features-link">
      {children}
    </a>
  ),
  NextImage: ({ field }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.jsonValue?.value?.src} data-testid="features-image" alt="" />
  ),
  useSitecore: () => ({
    sitecoreContext: {
      pageEditing: false,
    },
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
}));

jest.mock('shadcd/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      return <>{children}</>;
    }
    return (
      <button data-testid="features-button" {...props}>
        {children}
      </button>
    );
  },
}));

jest.mock('shadcd/components/ui/accordion', () => ({
  Accordion: ({ children, ...props }: any) => (
    <div data-testid="features-accordion" {...props}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, ...props }: any) => (
    <div data-testid="features-accordion-item" {...props}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, ...props }: any) => (
    <button data-testid="features-accordion-trigger" {...props}>
      {children}
    </button>
  ),
  AccordionContent: ({ children, ...props }: any) => (
    <div data-testid="features-accordion-content" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('shadcd/components/ui/tabs', () => ({
  Tabs: ({ children, ...props }: any) => (
    <div data-testid="features-tabs" {...props}>
      {children}
    </div>
  ),
  TabsList: ({ children, ...props }: any) => (
    <div data-testid="features-tabs-list" {...props}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, ...props }: any) => (
    <button data-testid="features-tabs-trigger" {...props}>
      {children}
    </button>
  ),
  TabsContent: ({ children, ...props }: any) => (
    <div data-testid="features-tabs-content" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('shadcd/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: any) => (
    <div data-testid="features-carousel" {...props}>
      {children}
    </div>
  ),
  CarouselContent: ({ children, ...props }: any) => (
    <div data-testid="features-carousel-content" {...props}>
      {children}
    </div>
  ),
  CarouselItem: ({ children, ...props }: any) => (
    <div data-testid="features-carousel-item" {...props}>
      {children}
    </div>
  ),
  CarouselNext: () => <button data-testid="features-carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="features-carousel-prev">Previous</button>,
}));

jest.mock('lucide-react', () => ({
  ChevronRight: () => <span data-testid="chevron-right" />,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

jest.mock('@/hooks/useVisibility', () => ({
  __esModule: true,
  default: jest.fn(() => [true, { current: null }]),
}));

const defaultProps = {
  rendering: {
    componentName: 'FeaturesSection',
    params: {},
  },
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        heading: { jsonValue: { value: 'Our Features' } },
        tagLine: { jsonValue: { value: 'Discover What We Offer' } },
        body: { jsonValue: { value: 'Explore our amazing features.' } },
        image: { jsonValue: { value: { src: '/features.jpg', alt: 'Features' } } },
        link1: { jsonValue: { value: { href: '/learn-more', text: 'Learn More' } } },
        link2: { jsonValue: { value: { href: '/get-started', text: 'Get Started' } } },
        children: {
          results: [
            {
              id: '1',
              featureTagLine: { jsonValue: { value: 'Fast' } },
              featureHeading: { jsonValue: { value: 'Lightning Speed' } },
              featureDescription: { jsonValue: { value: 'Fast description' } },
              featureIcon: { jsonValue: { value: { src: '/icon1.jpg', alt: 'Icon 1' } } },
              featureImage: { jsonValue: { value: { src: '/feature1.jpg', alt: 'Feature 1' } } },
              featureLink1: { jsonValue: { value: { href: '/feature1' } } },
              featureLink2: { jsonValue: { value: { href: '/feature1-2' } } },
            },
            {
              id: '2',
              featureTagLine: { jsonValue: { value: 'Reliable' } },
              featureHeading: { jsonValue: { value: 'Rock Solid' } },
              featureDescription: { jsonValue: { value: 'Reliable description' } },
              featureIcon: { jsonValue: { value: { src: '/icon2.jpg', alt: 'Icon 2' } } },
              featureImage: { jsonValue: { value: { src: '/feature2.jpg', alt: 'Feature 2' } } },
              featureLink1: { jsonValue: { value: { href: '/feature2' } } },
              featureLink2: { jsonValue: { value: { href: '/feature2-2' } } },
            },
          ],
        },
      },
    },
  },
  page: mockPageNormal,
};

describe('FeaturesSectionDefault', () => {
  it('renders without crashing', () => {
    const { container } = render(<FeaturesSectionDefault {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders feature images', () => {
    render(<FeaturesSectionDefault {...defaultProps} />);
    const images = screen.getAllByTestId('features-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders feature text elements', () => {
    render(<FeaturesSectionDefault {...defaultProps} />);
    const textElements = screen.getAllByTestId('features-text');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('renders feature links', () => {
    render(<FeaturesSectionDefault {...defaultProps} />);
    const links = screen.getAllByTestId('features-link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-features-style' },
    };
    const { container } = render(<FeaturesSectionDefault {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-features-style');
  });

  it('handles empty features list', () => {
    const propsWithEmpty = {
      ...defaultProps,
      fields: {
        data: {
          datasource: {
            ...defaultProps.fields.data.datasource,
            children: {
              results: [],
            },
          },
        },
      },
    };
    const { container } = render(<FeaturesSectionDefault {...propsWithEmpty} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

// Test all 25 variants to achieve 75%+ function coverage
describe('FeaturesSection Variants', () => {
  // Variants that require at least one item (tabs/accordions)
  const variantsRequiringData = new Set([
    'FeaturesSection12',
    'FeaturesSection13',
    'FeaturesSection17',
    'FeaturesSection18',
    'FeaturesSection19',
    'FeaturesSection20',
    'FeaturesSection21',
  ]);

  const variants = [
    { component: FeaturesSection1, name: 'FeaturesSection1' },
    { component: FeaturesSection2, name: 'FeaturesSection2' },
    { component: FeaturesSection3, name: 'FeaturesSection3' },
    { component: FeaturesSection4, name: 'FeaturesSection4' },
    { component: FeaturesSection5, name: 'FeaturesSection5' },
    { component: FeaturesSection6, name: 'FeaturesSection6' },
    { component: FeaturesSection7, name: 'FeaturesSection7' },
    { component: FeaturesSection8, name: 'FeaturesSection8' },
    { component: FeaturesSection9, name: 'FeaturesSection9' },
    { component: FeaturesSection10, name: 'FeaturesSection10' },
    { component: FeaturesSection11, name: 'FeaturesSection11' },
    { component: FeaturesSection12, name: 'FeaturesSection12' },
    { component: FeaturesSection13, name: 'FeaturesSection13' },
    { component: FeaturesSection14, name: 'FeaturesSection14' },
    { component: FeaturesSection15, name: 'FeaturesSection15' },
    { component: FeaturesSection16, name: 'FeaturesSection16' },
    { component: FeaturesSection17, name: 'FeaturesSection17' },
    { component: FeaturesSection18, name: 'FeaturesSection18' },
    { component: FeaturesSection19, name: 'FeaturesSection19' },
    { component: FeaturesSection20, name: 'FeaturesSection20' },
    { component: FeaturesSection21, name: 'FeaturesSection21' },
    { component: FeaturesSection22, name: 'FeaturesSection22' },
    { component: FeaturesSection23, name: 'FeaturesSection23' },
    { component: FeaturesSection24, name: 'FeaturesSection24' },
    { component: FeaturesSection25, name: 'FeaturesSection25' },
  ];

  variants.forEach(({ component: Component, name }) => {
    describe(name, () => {
      it('renders correctly', () => {
        const { container } = render(<Component {...defaultProps} />);
        expect(container.querySelector('section')).toBeInTheDocument();
      });

      // Skip empty features test for variants that require data
      if (!variantsRequiringData.has(name)) {
        it('handles empty features', () => {
          const emptyProps = {
            ...defaultProps,
            fields: {
              data: {
                datasource: {
                  ...defaultProps.fields.data.datasource,
                  children: { results: [] },
                },
              },
            },
          };
          const { container } = render(<Component {...emptyProps} />);
          expect(container.querySelector('section')).toBeInTheDocument();
        });
      }

      it('applies custom styles', () => {
        const styledProps = {
          ...defaultProps,
          params: { styles: `custom-${name}` },
        };
        const { container } = render(<Component {...styledProps} />);
        expect(container.querySelector('section')).toHaveClass(`custom-${name}`);
      });
    });
  });
});
