import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as StatsSectionDefault,
  StatsSection1,
  StatsSection2,
  StatsSection3,
  StatsSection4,
  StatsSection5,
  StatsSection6,
  StatsSection7,
  StatsSection8,
} from '@/components/component-library/StatsSection';

// Mock dependencies
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span data-testid="stats-text">{field?.jsonValue?.value}</span>,
  RichText: ({ field }: any) => <div data-testid="stats-richtext">{field?.jsonValue?.value}</div>,
  Link: ({ field, children }: any) => (
    <a href={field?.jsonValue?.value?.href} data-testid="stats-link">
      {children}
    </a>
  ),
  NextImage: ({ field }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.jsonValue?.value?.src} data-testid="stats-image" alt="" />
  ),
}));

jest.mock('shadcd/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      return <>{children}</>;
    }
    return (
      <button data-testid="stats-button" {...props}>
        {children}
      </button>
    );
  },
}));

const defaultProps = {
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        heading: { jsonValue: { value: 'Our Stats' } },
        tagLine: { jsonValue: { value: 'By the Numbers' } },
        body: { jsonValue: { value: 'See our achievements' } },
        image1: { jsonValue: { value: { src: '/stat1.jpg', alt: 'Stat 1' } } },
        image2: { jsonValue: { value: { src: '/stat2.jpg', alt: 'Stat 2' } } },
        link1: { jsonValue: { value: { href: '/about', text: 'Learn More' } } },
        link2: { jsonValue: { value: { href: '/contact', text: 'Contact Us' } } },
        children: {
          results: [
            {
              id: '1',
              statValue: { jsonValue: { value: '100+' } },
              statHeading: { jsonValue: { value: 'Projects' } },
              statBody: { jsonValue: { value: 'Completed projects' } },
            },
            {
              id: '2',
              statValue: { jsonValue: { value: '50+' } },
              statHeading: { jsonValue: { value: 'Clients' } },
              statBody: { jsonValue: { value: 'Happy clients' } },
            },
          ],
        },
      },
    },
  },
};

describe('StatsSectionDefault', () => {
  it('renders without crashing', () => {
    const { container } = render(<StatsSectionDefault {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders stats text elements', () => {
    render(<StatsSectionDefault {...defaultProps} />);
    const textElements = screen.getAllByTestId('stats-text');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('renders stats text and richtext', () => {
    render(<StatsSectionDefault {...defaultProps} />);
    const textElements = screen.getAllByTestId('stats-text');
    const richtextElements = screen.getAllByTestId('stats-richtext');
    expect(textElements.length).toBeGreaterThan(0);
    expect(richtextElements.length).toBeGreaterThan(0);
  });

  it('renders stats links', () => {
    render(<StatsSectionDefault {...defaultProps} />);
    const links = screen.getAllByTestId('stats-link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-stats-style' },
    };
    const { container } = render(<StatsSectionDefault {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-stats-style');
  });

  it('handles empty stats list', () => {
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
    const { container } = render(<StatsSectionDefault {...propsWithEmpty} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

// Test all 8 variants to achieve 75%+ function coverage
describe('StatsSection Variants', () => {
  const variants = [
    { component: StatsSection1, name: 'StatsSection1' },
    { component: StatsSection2, name: 'StatsSection2' },
    { component: StatsSection3, name: 'StatsSection3' },
    { component: StatsSection4, name: 'StatsSection4' },
    { component: StatsSection5, name: 'StatsSection5' },
    { component: StatsSection6, name: 'StatsSection6' },
    { component: StatsSection7, name: 'StatsSection7' },
    { component: StatsSection8, name: 'StatsSection8' },
  ];

  variants.forEach(({ component: Component, name }) => {
    describe(name, () => {
      it('renders correctly', () => {
        const { container } = render(<Component {...defaultProps} />);
        expect(container.querySelector('section')).toBeInTheDocument();
      });

      it('renders stats text', () => {
        render(<Component {...defaultProps} />);
        const textElements = screen.getAllByTestId('stats-text');
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
