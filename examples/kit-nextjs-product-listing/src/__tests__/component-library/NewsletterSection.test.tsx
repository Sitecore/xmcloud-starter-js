import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as NewsletterSectionDefault,
  NewsletterSection1,
  NewsletterSection2,
  NewsletterSection3,
  NewsletterSection4,
  NewsletterSection5,
  NewsletterSection6,
  NewsletterSection7,
  NewsletterSection8,
} from '../../components/component-library/NewsletterSection';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="newsletter-image"
      src={field?.value?.src}
      alt={field?.value?.alt}
      className={className}
    />
  ),
  Text: ({ field }: any) => <span data-testid="newsletter-text">{field?.value}</span>,
  RichText: ({ field }: any) => (
    <div
      data-testid="newsletter-richtext"
      dangerouslySetInnerHTML={{ __html: field?.value || '' }}
    />
  ),
}));

// Mock shadcn components
jest.mock('shadcn/components/ui/button', () => ({
  Button: ({ children, type, className }: any) => (
    <button data-testid="newsletter-button" type={type} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('shadcd/components/ui/input', () => ({
  Input: ({ type, placeholder, className }: any) => (
    <input
      data-testid="newsletter-input"
      type={type}
      placeholder={placeholder}
      className={className}
    />
  ),
}));

const defaultProps = {
  params: { styles: '' },
  fields: {
    Tagline: { value: 'Stay Updated' },
    Heading: { value: 'Subscribe to Newsletter' },
    Body: { value: '<p>Get the latest updates.</p>' },
    Image: { value: { src: '/newsletter-bg.jpg', alt: 'Newsletter' } },
    FormDisclaimer: { value: 'We respect your privacy.' },
  },
};

describe('NewsletterSectionDefault', () => {
  it('renders with all props', () => {
    render(<NewsletterSectionDefault {...defaultProps} />);
    expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
  });

  it('renders tagline', () => {
    render(<NewsletterSectionDefault {...defaultProps} />);
    expect(screen.getByText('Stay Updated')).toBeInTheDocument();
  });

  it('renders body text', () => {
    render(<NewsletterSectionDefault {...defaultProps} />);
    // Check that RichText components are rendered
    const richtextElements = screen.getAllByTestId('newsletter-richtext');
    expect(richtextElements.length).toBeGreaterThan(0);
  });

  it('renders email input', () => {
    render(<NewsletterSectionDefault {...defaultProps} />);
    const input = screen.getByTestId('newsletter-input');
    expect(input).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<NewsletterSectionDefault {...defaultProps} />);
    const button = screen.getByTestId('newsletter-button');
    expect(button).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-newsletter-style' },
    };
    const { container } = render(<NewsletterSectionDefault {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-newsletter-style');
  });
});

// Test all 8 variants to achieve 75%+ function coverage
describe('NewsletterSection Variants', () => {
  const variants = [
    { component: NewsletterSection1, name: 'NewsletterSection1' },
    { component: NewsletterSection2, name: 'NewsletterSection2' },
    { component: NewsletterSection3, name: 'NewsletterSection3' },
    { component: NewsletterSection4, name: 'NewsletterSection4' },
    { component: NewsletterSection5, name: 'NewsletterSection5' },
    { component: NewsletterSection6, name: 'NewsletterSection6' },
    { component: NewsletterSection7, name: 'NewsletterSection7' },
    { component: NewsletterSection8, name: 'NewsletterSection8' },
  ];

  variants.forEach(({ component: Component, name }) => {
    describe(name, () => {
      it('renders correctly', () => {
        render(<Component {...defaultProps} />);
        expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
      });

      it('renders email input', () => {
        render(<Component {...defaultProps} />);
        const input = screen.getByTestId('newsletter-input');
        expect(input).toBeInTheDocument();
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
