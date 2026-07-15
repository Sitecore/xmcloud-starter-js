import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as HeaderDefault,
  Header1,
  Header2,
  Header3,
  Header4,
  Header5,
  Header6,
  Header7,
  Header8,
  Header9,
  Header10,
} from '@/components/component-library/Header';

// Mock dependencies
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span data-testid="header-text">{field?.value}</span>,
  RichText: ({ field }: any) => <div data-testid="header-richtext">{field?.value}</div>,
  Link: ({ field, children }: any) => (
    <a href={field?.value?.href} data-testid="header-link">
      {children}
    </a>
  ),
  // eslint-disable-next-line @next/next/no-img-element
  NextImage: ({ field }: any) => <img src={field?.value?.src} data-testid="header-image" alt="" />,
}));

jest.mock('shadcn/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      return <>{children}</>;
    }
    return (
      <button data-testid="header-button" {...props}>
        {children}
      </button>
    );
  },
}));

jest.mock('shadcd/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="header-input" {...props} />,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

jest.mock('@/hooks/useVisibility', () => ({
  __esModule: true,
  default: () => [true, { current: null }],
}));

const defaultProps = {
  params: { styles: '' },
  fields: {
    Tagline: { value: 'Welcome' },
    Heading: { value: 'Our Amazing Header' },
    Body: { value: 'This is the body text.' },
    Link1: { value: { href: '/link1', text: 'Link 1' } },
    Link2: { value: { href: '/link2', text: 'Link 2' } },
    Image: { value: { src: '/header.jpg', alt: 'Header' } },
    FormDisclaimer: { value: 'Form disclaimer text' },
  },
};

describe('HeaderDefault', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeaderDefault {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders header text elements', () => {
    render(<HeaderDefault {...defaultProps} />);
    const textElements = screen.getAllByTestId('header-text');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('renders header links', () => {
    render(<HeaderDefault {...defaultProps} />);
    const links = screen.getAllByTestId('header-link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-header-style' },
    };
    const { container } = render(<HeaderDefault {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-header-style');
  });

  it('handles missing fields', () => {
    const propsWithoutFields = {
      params: { styles: '' },
      fields: null as any,
    };
    const { container } = render(<HeaderDefault {...propsWithoutFields} />);
    expect(container.firstChild).toBeNull();
  });
});

// Test all 10 variants to achieve 75%+ function coverage
describe('Header Variants', () => {
  const variants = [
    { component: Header1, name: 'Header1' },
    { component: Header2, name: 'Header2' },
    { component: Header3, name: 'Header3' },
    { component: Header4, name: 'Header4' },
    { component: Header5, name: 'Header5' },
    { component: Header6, name: 'Header6' },
    { component: Header7, name: 'Header7' },
    { component: Header8, name: 'Header8' },
    { component: Header9, name: 'Header9' },
    { component: Header10, name: 'Header10' },
  ];

  variants.forEach(({ component: Component, name }) => {
    describe(name, () => {
      it('renders correctly', () => {
        const { container } = render(<Component {...defaultProps} />);
        expect(container.querySelector('section')).toBeInTheDocument();
      });

      it('renders header text', () => {
        render(<Component {...defaultProps} />);
        const textElements = screen.getAllByTestId('header-text');
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
