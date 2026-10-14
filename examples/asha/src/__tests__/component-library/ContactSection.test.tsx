import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as ContactSectionDefault,
  ContactSection1,
  ContactSection2,
  ContactSection3,
  ContactSection4,
  ContactSection5,
  ContactSection6,
} from '@/components/component-library/ContactSection';
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

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span data-testid="contact-text">{field?.jsonValue?.value}</span>,
  RichText: ({ field }: any) => <div data-testid="contact-richtext">{field?.jsonValue?.value}</div>,
  Link: ({ field, children }: any) => (
    <a href={field?.jsonValue?.value?.href} data-testid="contact-link">
      {children}
    </a>
  ),
  NextImage: ({ field }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.jsonValue?.value?.src} data-testid="contact-image" alt="" />
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
  Button: ({ children, ...props }: any) => (
    <button data-testid="contact-button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

const defaultProps = {
  rendering: {
    componentName: 'ContactSection',
    params: {},
  },
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        tagLine: { jsonValue: { value: 'Get in Touch' } },
        heading: { jsonValue: { value: 'Contact Us' } },
        body: { jsonValue: { value: 'We are here to help you.' } },
        image: { jsonValue: { value: { src: '/contact.jpg', alt: 'Contact' } } },
        children: {
          results: [
            {
              id: '1',
              image: { jsonValue: { value: { src: '/person1.jpg', alt: 'Person 1' } } },
              heading: { jsonValue: { value: 'John Doe' } },
              description: { jsonValue: { value: 'Sales Manager' } },
              contactLink: { jsonValue: { value: { href: 'mailto:john@example.com' } } },
              buttonLink: { jsonValue: { value: { href: '/contact-john' } } },
            },
            {
              id: '2',
              image: { jsonValue: { value: { src: '/person2.jpg', alt: 'Person 2' } } },
              heading: { jsonValue: { value: 'Jane Smith' } },
              description: { jsonValue: { value: 'Support Lead' } },
              contactLink: { jsonValue: { value: { href: 'mailto:jane@example.com' } } },
              buttonLink: { jsonValue: { value: { href: '/contact-jane' } } },
            },
          ],
        },
      },
    },
  },
  page: mockPageNormal,
};

describe('ContactSectionDefault', () => {
  it('renders without crashing', () => {
    const { container } = render(<ContactSectionDefault {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders contact cards', () => {
    render(<ContactSectionDefault {...defaultProps} />);
    const images = screen.getAllByTestId('contact-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders with multiple contacts', () => {
    render(<ContactSectionDefault {...defaultProps} />);
    const textElements = screen.getAllByTestId('contact-text');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('renders contact links', () => {
    render(<ContactSectionDefault {...defaultProps} />);
    const links = screen.getAllByTestId('contact-link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders contact buttons', () => {
    render(<ContactSectionDefault {...defaultProps} />);
    const buttons = screen.getAllByTestId('contact-button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-contact-style' },
    };
    const { container } = render(<ContactSectionDefault {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-contact-style');
  });

  it('handles empty contact list', () => {
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
    const { container } = render(<ContactSectionDefault {...propsWithEmpty} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

// Test all 6 variants to achieve 75%+ function coverage
describe('ContactSection Variants', () => {
  const variants = [
    { component: ContactSection1, name: 'ContactSection1' },
    { component: ContactSection2, name: 'ContactSection2' },
    { component: ContactSection3, name: 'ContactSection3' },
    { component: ContactSection4, name: 'ContactSection4' },
    { component: ContactSection5, name: 'ContactSection5' },
    { component: ContactSection6, name: 'ContactSection6' },
  ];

  variants.forEach(({ component: Component, name }) => {
    describe(name, () => {
      it('renders correctly', () => {
        const { container } = render(<Component {...defaultProps} />);
        expect(container.querySelector('section')).toBeInTheDocument();
      });

      it('renders contact text', () => {
        render(<Component {...defaultProps} />);
        const textElements = screen.getAllByTestId('contact-text');
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
