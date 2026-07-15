import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as CallToActionDefault,
  CallToAction1,
  CallToAction2,
  CallToAction3,
  CallToAction4,
} from '../../components/component-library/CallToAction';
import {
  defaultCallToActionProps,
  ctaPropsWithStyles,
  ctaPropsNoLinks,
  ctaPropsOnlyOneLink,
} from './CallToAction.mockProps';

// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field: { value: string } }) => (
    <span data-testid="cta-text">{field?.value}</span>
  ),
  RichText: ({ field }: { field: { value: string } }) => (
    <div data-testid="cta-richtext" dangerouslySetInnerHTML={{ __html: field?.value || '' }} />
  ),
  Link: ({
    field,
    children,
  }: {
    field: { value: { href: string; text: string } };
    children?: React.ReactNode;
  }) => (
    <a data-testid="cta-link" href={field?.value?.href}>
      {children || field?.value?.text}
    </a>
  ),
  Image: ({
    field,
    className,
  }: {
    field: { value: { src: string; alt: string } };
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="cta-image"
      src={field?.value?.src}
      alt={field?.value?.alt}
      className={className}
    />
  ),
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
}));

// Mock shadcn Button component
jest.mock('shadcn/components/ui/button', () => ({
  Button: ({
    children,
    className,
    variant,
    asChild,
  }: {
    children: React.ReactNode;
    className?: string;
    variant?: string;
    asChild?: boolean;
  }) => (
    <button
      data-testid="cta-button"
      className={className}
      data-variant={variant}
      data-as-child={asChild}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../lib/component-props', () => ({}), { virtual: true });

describe('CallToAction', () => {
  it('renders with all props', () => {
    render(<CallToAction1 {...defaultCallToActionProps} />);

    expect(screen.getByText('Transform Your Business Today')).toBeInTheDocument();
    expect(screen.getByTestId('cta-richtext')).toHaveTextContent(
      'Join thousands of companies that trust our platform for their digital transformation journey.'
    );
    expect(screen.getByTestId('cta-image')).toHaveAttribute('src', '/images/cta-background.jpg');
    expect(screen.getByTestId('cta-image')).toHaveAttribute('alt', 'CTA Background');
  });

  it('renders both CTA links', () => {
    render(<CallToAction1 {...defaultCallToActionProps} />);

    const links = screen.getAllByTestId('cta-link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/get-started');
    expect(links[1]).toHaveAttribute('href', '/learn-more');
  });

  it('applies custom styles from params', () => {
    const { container } = render(<CallToAction1 {...ctaPropsWithStyles} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-cta-class');
  });

  it('hides links when no href is provided', () => {
    render(<CallToAction1 {...ctaPropsNoLinks} />);

    const links = screen.queryAllByTestId('cta-link');
    expect(links).toHaveLength(0);
  });

  it('renders only first link when second link is empty', () => {
    render(<CallToAction1 {...ctaPropsOnlyOneLink} />);

    const links = screen.getAllByTestId('cta-link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/signup');
  });

  it('renders title and body content', () => {
    render(<CallToAction1 {...defaultCallToActionProps} />);

    expect(screen.getByText('Transform Your Business Today')).toBeInTheDocument();
    expect(screen.getByTestId('cta-richtext')).toBeInTheDocument();
  });

  it('has correct structure and styling', () => {
    const { container } = render(<CallToAction1 {...defaultCallToActionProps} />);

    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-class-change');
    expect(section).toHaveClass('px-[5%]', 'py-12', 'md:py-24');
  });

  it('renders buttons with correct variants', () => {
    render(<CallToAction1 {...defaultCallToActionProps} />);

    const buttons = screen.getAllByTestId('cta-button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).not.toHaveAttribute('data-variant');
    expect(buttons[1]).toHaveAttribute('data-variant', 'outline');
  });

  it('uses Default export correctly', () => {
    const { container } = render(<CallToAction1 {...defaultCallToActionProps} />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('renders background image with overlay', () => {
    render(<CallToAction1 {...defaultCallToActionProps} />);

    const image = screen.getByTestId('cta-image');
    expect(image).toHaveClass('absolute', 'object-cover');
  });
});

describe('CallToActionDefault', () => {
  it('renders correctly', () => {
    const { container } = render(<CallToActionDefault {...defaultCallToActionProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

describe('CallToAction2', () => {
  it('renders variant 2 correctly', () => {
    const { container } = render(<CallToAction2 {...defaultCallToActionProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(screen.getByText('Transform Your Business Today')).toBeInTheDocument();
  });

  it('handles custom styles', () => {
    const { container } = render(<CallToAction2 {...ctaPropsWithStyles} />);
    expect(container.querySelector('section')).toHaveClass('custom-cta-class');
  });
});

describe('CallToAction3', () => {
  it('renders variant 3 correctly', () => {
    const { container } = render(<CallToAction3 {...defaultCallToActionProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(screen.getByText('Transform Your Business Today')).toBeInTheDocument();
  });

  it('handles links correctly', () => {
    render(<CallToAction3 {...defaultCallToActionProps} />);
    const links = screen.getAllByTestId('cta-link');
    expect(links.length).toBeGreaterThan(0);
  });
});

describe('CallToAction4', () => {
  it('renders variant 4 correctly', () => {
    const { container } = render(<CallToAction4 {...defaultCallToActionProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(screen.getByText('Transform Your Business Today')).toBeInTheDocument();
  });

  it('renders with only one link', () => {
    render(<CallToAction4 {...ctaPropsOnlyOneLink} />);
    const links = screen.getAllByTestId('cta-link');
    expect(links).toHaveLength(1);
  });

  it('handles no links', () => {
    render(<CallToAction4 {...ctaPropsNoLinks} />);
    const links = screen.queryAllByTestId('cta-link');
    expect(links).toHaveLength(0);
  });
});
