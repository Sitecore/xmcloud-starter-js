import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as FAQDefault,
  FAQ1,
  FAQ2,
  FAQ3,
  FAQ4,
  FAQ5,
  FAQ6,
  FAQ7,
  FAQ8,
} from '@/components/component-library/FAQ';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span data-testid="faq-text">{field?.jsonValue?.value}</span>,
  Link: ({ field, children }: any) => (
    <a href={field?.jsonValue?.value?.href} data-testid="faq-link">
      {children}
    </a>
  ),
  NextImage: ({ field }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.jsonValue?.value?.src} data-testid="faq-image" alt="" />
  ),
}));

jest.mock('@/components/content-sdk-rich-text/ContentSdkRichText', () => {
  return function ContentSdkRichText({ field }: any) {
    return <div data-testid="faq-richtext">{field?.jsonValue?.value}</div>;
  };
});

jest.mock('shadcd/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      return <>{children}</>;
    }
    return (
      <button data-testid="faq-button" {...props}>
        {children}
      </button>
    );
  },
}));

jest.mock('shadcd/components/ui/accordion', () => ({
  Accordion: ({ children, ...props }: any) => (
    <div data-testid="faq-accordion" {...props}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, ...props }: any) => (
    <div data-testid="faq-accordion-item" {...props}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, ...props }: any) => (
    <button data-testid="faq-accordion-trigger" {...props}>
      {children}
    </button>
  ),
  AccordionContent: ({ children, ...props }: any) => (
    <div data-testid="faq-accordion-content" {...props}>
      {children}
    </div>
  ),
}));

const defaultProps = {
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        heading: { jsonValue: { value: 'Frequently Asked Questions' } },
        text: { jsonValue: { value: 'Find answers to common questions.' } },
        heading2: { jsonValue: { value: 'Still have questions?' } },
        text2: { jsonValue: { value: 'Contact us for more help.' } },
        link: { jsonValue: { value: { href: '/contact', text: 'Contact Us' } } },
        children: {
          results: [
            {
              id: '1',
              question: { jsonValue: { value: 'What is your return policy?' } },
              answer: { jsonValue: { value: 'We offer 30-day returns.' } },
              image: { jsonValue: { value: { src: '/faq1.jpg', alt: 'FAQ 1' } } },
            },
            {
              id: '2',
              question: { jsonValue: { value: 'How long is shipping?' } },
              answer: { jsonValue: { value: 'Shipping takes 3-5 business days.' } },
              image: { jsonValue: { value: { src: '/faq2.jpg', alt: 'FAQ 2' } } },
            },
          ],
        },
      },
    },
  },
};

describe('FAQDefault', () => {
  it('renders without crashing', () => {
    const { container } = render(<FAQDefault {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders accordion component', () => {
    render(<FAQDefault {...defaultProps} />);
    const accordion = screen.getByTestId('faq-accordion');
    expect(accordion).toBeInTheDocument();
  });

  it('renders accordion items', () => {
    render(<FAQDefault {...defaultProps} />);
    const items = screen.getAllByTestId('faq-accordion-item');
    expect(items.length).toBeGreaterThan(0);
  });

  it('renders accordion triggers', () => {
    render(<FAQDefault {...defaultProps} />);
    const triggers = screen.getAllByTestId('faq-accordion-trigger');
    expect(triggers.length).toBeGreaterThan(0);
  });

  it('renders accordion content', () => {
    render(<FAQDefault {...defaultProps} />);
    const content = screen.getAllByTestId('faq-accordion-content');
    expect(content.length).toBeGreaterThan(0);
  });

  it('renders FAQ link', () => {
    render(<FAQDefault {...defaultProps} />);
    const link = screen.getByTestId('faq-link');
    expect(link).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-faq-style' },
    };
    const { container } = render(<FAQDefault {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-faq-style');
  });

  it('handles empty questions list', () => {
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
    const { container } = render(<FAQDefault {...propsWithEmpty} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

// Test all 8 variants to achieve 75%+ function coverage
describe('FAQ Variants', () => {
  const variants = [
    { component: FAQ1, name: 'FAQ1' },
    { component: FAQ2, name: 'FAQ2' },
    { component: FAQ3, name: 'FAQ3' },
    { component: FAQ4, name: 'FAQ4' },
    { component: FAQ5, name: 'FAQ5' },
    { component: FAQ6, name: 'FAQ6' },
    { component: FAQ7, name: 'FAQ7' },
    { component: FAQ8, name: 'FAQ8' },
  ];

  variants.forEach(({ component: Component, name }) => {
    describe(name, () => {
      it('renders correctly', () => {
        const { container } = render(<Component {...defaultProps} />);
        expect(container.querySelector('section')).toBeInTheDocument();
      });

      it('renders FAQ text', () => {
        render(<Component {...defaultProps} />);
        const textElements = screen.getAllByTestId('faq-text');
        expect(textElements.length).toBeGreaterThan(0);
      });

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
