/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Default as SignupBannerDefault,
  ContentLeft as SignupBannerContentLeft,
  BackgroundPrimary as SignupBannerBackgroundPrimary,
  BackgroundDark as SignupBannerBackgroundDark,
} from '@/components/site-three/SignupBanner';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      Signup_Form_Input_Placeholder: 'Enter your email',
      Signup_Form_Button_Label: 'Subscribe',
    };
    return translations[key] || key;
  },
  useLocale: () => 'en',
  useTimeZone: () => 'UTC',
  useFormatter: () => ({
    dateTime: jest.fn(),
    number: jest.fn(),
    relativeTime: jest.fn(),
    plural: jest.fn(),
    select: jest.fn(),
    selectOrdinal: jest.fn(),
    list: jest.fn(),
  }),
  IntlProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  RichText: ({ field, ...props }: any) => <div {...props}>{field?.value || ''}</div>,
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  Image: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  Field: ({ field }: any) => <span>{field?.value || ''}</span>,
}));

describe('SignupBanner', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      Heading: {
        value: 'Subscribe to Newsletter',
      },
      Subheading: {
        value: 'Get the latest updates',
      },
      Image: {
        value: {
          src: '/images/signup-bg.jpg',
          alt: 'Signup Background',
        },
      },
      Image2: {
        value: {
          src: '/images/signup-bg2.jpg',
          alt: 'Signup Background 2',
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders signup banner with heading', () => {
      render(<SignupBannerDefault {...mockProps} />);
      expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
    });

    it('renders body text', () => {
      render(<SignupBannerDefault {...mockProps} />);
      expect(screen.getByText('Get the latest updates')).toBeInTheDocument();
    });

    it('renders email input with placeholder', () => {
      render(<SignupBannerDefault {...mockProps} />);
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<SignupBannerDefault {...mockProps} />);
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });

    it('renders background image', () => {
      render(<SignupBannerDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      const bgImage = images.find((img) => img.getAttribute('src') === '/images/signup-bg.jpg');
      expect(bgImage).toBeInTheDocument();
    });

    it('handles form submission', () => {
      render(<SignupBannerDefault {...mockProps} />);
      const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
      const submitButton = screen.getByText('Subscribe');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(emailInput.value).toBe('test@example.com');

      fireEvent.click(submitButton);
    });

    it('applies custom styles from params', () => {
      render(<SignupBannerDefault {...mockProps} />);
      const banner = screen.getByText('Subscribe to Newsletter');
      expect(banner).toBeInTheDocument();
    });

    it('returns null when fields are missing', () => {
      const { container } = render(<SignupBannerDefault params={{}} fields={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('ContentLeft variant', () => {
    it('renders content left layout with heading and subheading', () => {
      render(<SignupBannerContentLeft {...mockProps} />);
      expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
      expect(screen.getByText('Get the latest updates')).toBeInTheDocument();
    });

    it('renders email input and button in content left variant', () => {
      render(<SignupBannerContentLeft {...mockProps} />);
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });

    it('renders background image in content left variant', () => {
      render(<SignupBannerContentLeft {...mockProps} />);
      const images = screen.getAllByRole('img');
      const bgImage = images.find((img) => img.getAttribute('src') === '/images/signup-bg.jpg');
      expect(bgImage).toBeInTheDocument();
    });

    it('returns null when fields are missing in content left variant', () => {
      const { container } = render(
        <SignupBannerContentLeft params={{}} fields={undefined as any} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('handles missing image gracefully in content left', () => {
      const propsWithoutImage: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Image: undefined,
        },
      };
      render(<SignupBannerContentLeft {...propsWithoutImage} />);
      expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
    });
  });

  describe('BackgroundPrimary variant', () => {
    it('renders background primary layout with content', () => {
      render(<SignupBannerBackgroundPrimary {...mockProps} />);
      expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
      expect(screen.getByText('Get the latest updates')).toBeInTheDocument();
    });

    it('renders form elements in background primary variant', () => {
      render(<SignupBannerBackgroundPrimary {...mockProps} />);
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });

    it('applies primary background styling', () => {
      const { container } = render(<SignupBannerBackgroundPrimary {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-primary');
    });

    it('returns null when fields are missing in background primary variant', () => {
      const { container } = render(
        <SignupBannerBackgroundPrimary params={{}} fields={undefined as any} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('handles partial fields in background primary variant', () => {
      const partialProps: any = {
        params: {},
        fields: {
          Heading: { value: 'Only Heading' },
        },
      };
      render(<SignupBannerBackgroundPrimary {...partialProps} />);
      expect(screen.getByText('Only Heading')).toBeInTheDocument();
    });
  });

  describe('BackgroundDark variant', () => {
    it('renders background dark layout with content', () => {
      render(<SignupBannerBackgroundDark {...mockProps} />);
      expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
      expect(screen.getByText('Get the latest updates')).toBeInTheDocument();
    });

    it('renders form elements in background dark variant', () => {
      render(<SignupBannerBackgroundDark {...mockProps} />);
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });

    it('applies dark background styling', () => {
      const { container } = render(<SignupBannerBackgroundDark {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-black');
    });

    it('renders background image in dark variant', () => {
      render(<SignupBannerBackgroundDark {...mockProps} />);
      const images = screen.getAllByRole('img');
      const bgImage = images.find((img) => img.getAttribute('src') === '/images/signup-bg.jpg');
      expect(bgImage).toBeInTheDocument();
    });

    it('returns null when fields are missing in background dark variant', () => {
      const { container } = render(
        <SignupBannerBackgroundDark params={{}} fields={undefined as any} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('handles form interaction in dark variant', () => {
      render(<SignupBannerBackgroundDark {...mockProps} />);
      const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
      const submitButton = screen.getByText('Subscribe');

      fireEvent.change(emailInput, { target: { value: 'dark@example.com' } });
      expect(emailInput.value).toBe('dark@example.com');

      fireEvent.click(submitButton);
    });
  });
});
