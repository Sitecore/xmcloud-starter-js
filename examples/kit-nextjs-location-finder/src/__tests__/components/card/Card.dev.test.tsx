import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Card } from '@/components/card/Card.dev';
import { Page } from '@sitecore-content-sdk/nextjs';

//  Mocks
/* eslint-disable @typescript-eslint/no-unused-vars */
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field?: { value?: string } }) => <span>{field?.value}</span>,
  RichText: ({ field }: { field?: { value?: string } }) => <div>{field?.value}</div>,
  Link: ({
    field,
    children,
    editable,
    asChild,
    ...props
  }: React.PropsWithChildren<{
    field?: { value?: { href?: string; text?: string } };
    editable?: boolean;
    asChild?: boolean;
  }> &
    React.ComponentProps<'a'>) => (
    <a href={field?.value?.href} {...props}>
      {children || field?.value?.text}
    </a>
  ),
}));
/* eslint-enable @typescript-eslint/no-unused-vars */

jest.mock('@/components/icon/Icon', () => ({
  Default: ({ iconName, className }: { iconName: string; className?: string }) => (
    <span data-testid="icon" className={className}>
      {iconName}
    </span>
  ),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className }: { image?: { value?: { src?: string } }; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image?.value?.src} alt="Card image" className={className} />
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: React.PropsWithChildren) => <header>{children}</header>,
  CardTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
  CardFooter: ({ children }: React.PropsWithChildren) => <footer>{children}</footer>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children }: React.PropsWithChildren) => <button>{children}</button>,
}));

// ----------------------
//  Mock Data
// ----------------------
// Mock page object with all required Page properties
const mockPageBase = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
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

const mockProps = {
  fields: {
    heading: { value: 'Card Title' },
    description: { value: 'Card description goes here.' },
    image: { value: { src: '/image.jpg' } },
    link: { value: { href: '/details', text: 'Learn More' } },
  },
  params: {
    icon: 'arrow-right',
    className: 'custom-card',
    editable: true,
  },
  rendering: { componentName: 'Card' },
  page: mockPageBase,
} as React.ComponentProps<typeof Card>;

// ----------------------
//  Tests
// ----------------------
describe('Card Component', () => {
  it('renders card with heading, description, image, and link', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description goes here.')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/image.jpg');
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not render link section if link is missing', () => {
    const mockPropsWithoutLink = {
      ...mockProps,
      fields: {
        ...mockProps.fields,
        link: undefined,
      },
    };
    render(<Card {...(mockPropsWithoutLink as unknown as React.ComponentProps<typeof Card>)} />);
    expect(screen.queryByText('Learn More')).not.toBeInTheDocument();
  });
});
