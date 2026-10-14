/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as PageHeaderSTDefault,
  TextRight as PageHeaderSTTextRight,
  SplitScreen as PageHeaderSTSplitScreen,
  Stacked as PageHeaderSTStacked,
  TwoColumn as PageHeaderSTTwoColumn,
} from '@/components/site-three/PageHeaderST';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  RichText: ({ field, ...props }: any) => <div {...props}>{field?.value || ''}</div>,
  Image: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
}));

describe('PageHeaderST', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      Title: {
        value: 'About Us',
      },
      Body: {
        value: 'Learn more about our company and mission.',
      },
      Image: {
        value: {
          src: '/images/about-header.jpg',
          alt: 'About us header',
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders page header with title', () => {
      render(<PageHeaderSTDefault {...mockProps} />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
    });

    it('renders body content', () => {
      render(<PageHeaderSTDefault {...mockProps} />);
      expect(screen.getByText('Learn more about our company and mission.')).toBeInTheDocument();
    });

    it('renders header image', () => {
      render(<PageHeaderSTDefault {...mockProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/images/about-header.jpg');
      expect(image).toHaveAttribute('alt', 'About us header');
    });

    it('returns null when fields are missing', () => {
      const { container } = render(<PageHeaderSTDefault params={{}} fields={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('applies custom styles from params', () => {
      const { container } = render(<PageHeaderSTDefault {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });
  });

  describe('TextRight variant', () => {
    it('renders text right layout with content', () => {
      render(<PageHeaderSTTextRight {...mockProps} />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Learn more about our company and mission.')).toBeInTheDocument();
    });

    it('renders image in text right variant', () => {
      render(<PageHeaderSTTextRight {...mockProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/images/about-header.jpg');
    });

    it('returns null when fields are missing in text right variant', () => {
      const { container } = render(<PageHeaderSTTextRight params={{}} fields={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('applies styles to text right variant', () => {
      const { container } = render(<PageHeaderSTTextRight {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });
  });

  describe('SplitScreen variant', () => {
    it('renders split screen layout with content', () => {
      render(<PageHeaderSTSplitScreen {...mockProps} />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Learn more about our company and mission.')).toBeInTheDocument();
    });

    it('renders image in split screen variant', () => {
      render(<PageHeaderSTSplitScreen {...mockProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/images/about-header.jpg');
    });

    it('returns null when fields are missing in split screen variant', () => {
      const { container } = render(
        <PageHeaderSTSplitScreen params={{}} fields={undefined as any} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('handles missing image in split screen variant', () => {
      const propsWithoutImage: any = {
        params: mockProps.params,
        fields: {
          Title: mockProps.fields.Title,
          Body: mockProps.fields.Body,
        },
      };
      render(<PageHeaderSTSplitScreen {...propsWithoutImage} />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
    });
  });

  describe('Stacked variant', () => {
    it('renders stacked layout with content', () => {
      render(<PageHeaderSTStacked {...mockProps} />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Learn more about our company and mission.')).toBeInTheDocument();
    });

    it('renders image in stacked variant', () => {
      render(<PageHeaderSTStacked {...mockProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/images/about-header.jpg');
    });

    it('returns null when fields are missing in stacked variant', () => {
      const { container } = render(<PageHeaderSTStacked params={{}} fields={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('handles partial fields in stacked variant', () => {
      const partialProps: any = {
        params: {},
        fields: {
          Title: { value: 'Partial Title' },
        },
      };
      render(<PageHeaderSTStacked {...partialProps} />);
      expect(screen.getByText('Partial Title')).toBeInTheDocument();
    });
  });

  describe('TwoColumn variant', () => {
    it('renders two column layout with content', () => {
      render(<PageHeaderSTTwoColumn {...mockProps} />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Learn more about our company and mission.')).toBeInTheDocument();
    });

    it('renders image in two column variant', () => {
      render(<PageHeaderSTTwoColumn {...mockProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/images/about-header.jpg');
    });

    it('returns null when fields are missing in two column variant', () => {
      const { container } = render(<PageHeaderSTTwoColumn params={{}} fields={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('applies background styling to two column variant', () => {
      const { container } = render(<PageHeaderSTTwoColumn {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-primary');
    });
  });
});
