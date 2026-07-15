import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as TeamSectionDefault,
  TeamSection1,
  TeamSection2,
  TeamSection3,
  TeamSection4,
  TeamSection5,
  TeamSection6,
  TeamSection7,
  TeamSection8,
  TeamSection9,
  TeamSection10,
  TeamSection11,
} from '@/components/component-library/TeamSection';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span data-testid="team-text">{field?.jsonValue?.value}</span>,
  RichText: ({ field }: any) => <div data-testid="team-richtext">{field?.jsonValue?.value}</div>,
  Link: ({ field, children }: any) => (
    <a href={field?.jsonValue?.value?.href} data-testid="team-link">
      {children}
    </a>
  ),
  NextImage: ({ field }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.jsonValue?.value?.src} data-testid="team-image" alt="" />
  ),
}));

jest.mock('shadcd/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      return <>{children}</>;
    }
    return (
      <button data-testid="team-button" {...props}>
        {children}
      </button>
    );
  },
}));

jest.mock('shadcd/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: any) => (
    <div data-testid="team-carousel" {...props}>
      {children}
    </div>
  ),
  CarouselContent: ({ children, ...props }: any) => (
    <div data-testid="team-carousel-content" {...props}>
      {children}
    </div>
  ),
  CarouselItem: ({ children, ...props }: any) => (
    <div data-testid="team-carousel-item" {...props}>
      {children}
    </div>
  ),
  CarouselNext: () => <button data-testid="team-carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="team-carousel-prev">Previous</button>,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

const defaultProps = {
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        tagLine: { jsonValue: { value: 'Meet Our Team' } },
        heading: { jsonValue: { value: 'Our Amazing Team' } },
        text: { jsonValue: { value: 'We are experts in our field' } },
        heading2: { jsonValue: { value: 'Join Us' } },
        text2: { jsonValue: { value: 'Looking for talented people' } },
        link: { jsonValue: { value: { href: '/careers', text: 'Careers' } } },
        children: {
          results: [
            {
              id: '1',
              image: { jsonValue: { value: { src: '/member1.jpg', alt: 'Member 1' } } },
              fullName: { jsonValue: { value: 'John Doe' } },
              jobTitle: { jsonValue: { value: 'CEO' } },
              description: { jsonValue: { value: 'Leads the company' } },
              facebook: { jsonValue: { value: { href: '/facebook' } } },
              instagram: { jsonValue: { value: { href: '/instagram' } } },
              linkedIn: { jsonValue: { value: { href: '/linkedin' } } },
              twitterX: { jsonValue: { value: { href: '/twitter' } } },
            },
            {
              id: '2',
              image: { jsonValue: { value: { src: '/member2.jpg', alt: 'Member 2' } } },
              fullName: { jsonValue: { value: 'Jane Smith' } },
              jobTitle: { jsonValue: { value: 'CTO' } },
              description: { jsonValue: { value: 'Leads technology' } },
              facebook: { jsonValue: { value: { href: '/facebook' } } },
              instagram: { jsonValue: { value: { href: '/instagram' } } },
              linkedIn: { jsonValue: { value: { href: '/linkedin' } } },
              twitterX: { jsonValue: { value: { href: '/twitter' } } },
            },
          ],
        },
      },
    },
  },
};

describe('TeamSectionDefault', () => {
  it('renders without crashing', () => {
    const { container } = render(<TeamSectionDefault {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders team member images', () => {
    render(<TeamSectionDefault {...defaultProps} />);
    const images = screen.getAllByTestId('team-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders team member text', () => {
    render(<TeamSectionDefault {...defaultProps} />);
    const textElements = screen.getAllByTestId('team-text');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('renders team social links', () => {
    render(<TeamSectionDefault {...defaultProps} />);
    const links = screen.getAllByTestId('team-link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('applies custom styles', () => {
    const propsWithStyles = {
      ...defaultProps,
      params: { styles: 'custom-team-style' },
    };
    const { container } = render(<TeamSectionDefault {...propsWithStyles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-team-style');
  });

  it('handles empty team list', () => {
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
    const { container } = render(<TeamSectionDefault {...propsWithEmpty} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

// Test all 11 variants to achieve 75%+ function coverage
describe('TeamSection Variants', () => {
  const variants = [
    { component: TeamSection1, name: 'TeamSection1' },
    { component: TeamSection2, name: 'TeamSection2' },
    { component: TeamSection3, name: 'TeamSection3' },
    { component: TeamSection4, name: 'TeamSection4' },
    { component: TeamSection5, name: 'TeamSection5' },
    { component: TeamSection6, name: 'TeamSection6' },
    { component: TeamSection7, name: 'TeamSection7' },
    { component: TeamSection8, name: 'TeamSection8' },
    { component: TeamSection9, name: 'TeamSection9' },
    { component: TeamSection10, name: 'TeamSection10' },
    { component: TeamSection11, name: 'TeamSection11' },
  ];

  variants.forEach(({ component: Component, name }) => {
    describe(name, () => {
      it('renders correctly', () => {
        const { container } = render(<Component {...defaultProps} />);
        expect(container.querySelector('section')).toBeInTheDocument();
      });

      it('renders team member text', () => {
        render(<Component {...defaultProps} />);
        const textElements = screen.getAllByTestId('team-text');
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
