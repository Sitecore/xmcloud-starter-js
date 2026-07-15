import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as AlertBanner } from '@/components/alert-banner/AlertBanner.dev';
import { Page } from '@sitecore-content-sdk/nextjs';

// 🧪 Component-Specific Mocks
jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({
    buttonLink,
    variant,
  }: {
    buttonLink?: { value?: { href?: string; text?: string } };
    variant?: string;
  }) => (
    <button data-testid="button-base" data-variant={variant}>
      {buttonLink?.value?.text || 'Button'}
    </button>
  ),
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="alert" className={className} role="alert">
      {children}
    </div>
  ),
  AlertTitle: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <h3 data-testid="alert-title" className={className}>
      {children}
    </h3>
  ),
  AlertDescription: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="alert-description" className={className}>
      {children}
    </div>
  ),
}));

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
    title: { value: 'Test Alert Title' },
    description: { value: 'Test alert description.' },
    link: {
      value: {
        href: 'https://example.com',
        text: 'Learn More',
      },
    },
  },
  params: {},
  externalFields: {
    mock_external_data: { value: 'External Data' },
  },
  rendering: { componentName: 'AlertBanner' },
  page: mockPageBase,
};

describe('AlertBanner', () => {
  it('renders alert component with title and description', () => {
    render(<AlertBanner {...mockProps} />);

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByTestId('alert-title')).toBeInTheDocument();
    expect(screen.getByTestId('alert-description')).toBeInTheDocument();
    expect(screen.getByText('Test Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Test alert description.')).toBeInTheDocument();
  });

  it('renders the link button when link is provided', () => {
    render(<AlertBanner {...mockProps} />);

    const linkButton = screen.getByTestId('button-base');
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('data-variant', 'default');
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('renders close button with X icon', () => {
    render(<AlertBanner {...mockProps} />);

    const closeButton = screen.getByTestId('ui-button');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('data-variant', 'default');
    expect(closeButton).toHaveAttribute('data-size', 'icon');
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('hides the alert when close button is clicked', () => {
    render(<AlertBanner {...mockProps} />);

    const closeButton = screen.getByTestId('ui-button');
    const alert = screen.getByTestId('alert');

    expect(alert).not.toHaveClass('hidden');

    fireEvent.click(closeButton);

    expect(alert).toHaveClass('hidden');
  });

  it('does not render link button when link is not provided', () => {
    const propsWithoutLink = {
      ...mockProps,
      fields: {
        title: { value: 'Test Alert Title' },
        description: { value: 'Test alert description.' },
        link: { value: { href: '', text: '' } },
      },
    };

    render(<AlertBanner {...propsWithoutLink} />);

    expect(screen.queryByTestId('button-base')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes and structure', () => {
    render(<AlertBanner {...mockProps} />);

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('relative', 'border-none');
    expect(alert).toHaveAttribute('role', 'alert');
  });
});
