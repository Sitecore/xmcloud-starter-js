import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalFooterBlackLarge } from '@/components/global-footer/GlobalFooterBlackLarge.dev';
import { mockGlobalFooterProps } from './global-footer.mock.props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag = 'span', className }: Record<string, unknown>) => {
    const TextTag = tag as keyof JSX.IntrinsicElements;
    const fieldValue = (field as { value?: string })?.value || '';
    return React.createElement(TextTag, { className: className as string }, fieldValue);
  },
}));

// Mock child components
jest.mock('@/components/forms/email/EmailSignupForm.dev', () => ({
  Default: ({ fields }: Record<string, unknown>) => (
    <div data-testid="email-signup-form">
      <input
        placeholder={(fields as Record<string, { value?: string }>)?.emailPlaceholder?.value}
      />
      <button>{(fields as Record<string, { value?: string }>)?.emailSubmitLabel?.value}</button>
    </div>
  ),
}));

jest.mock('@/components/global-footer/FooterNavigationColumn.dev', () => ({
  Default: ({ items }: { items?: unknown[] }) => (
    <nav data-testid="footer-nav-column">{(items || []).length} navigation items</nav>
  ),
}));

jest.mock('@/components/button-component/ButtonComponent', () => ({
  EditableButton: ({ className }: { className?: string }) => (
    <button className={className} data-testid="editable-button">
      Social Link
    </button>
  ),
}));

jest.mock('@/components/ui/animated-hover-nav', () => ({
  AnimatedHoverNav: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-hover-nav">{children}</div>
  ),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@/hooks/use-container-query', () => ({
  useContainerQuery: jest.fn(() => false),
}));

describe('GlobalFooterBlackLarge Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<GlobalFooterBlackLarge {...mockGlobalFooterProps} />);
    expect(container).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('displays all main sections with correct content', () => {
    render(<GlobalFooterBlackLarge {...mockGlobalFooterProps} />);

    expect(screen.getByTestId('footer-nav-column')).toBeInTheDocument();
    expect(screen.getByTestId('email-signup-form')).toBeInTheDocument();
    expect(screen.getByTestId('animated-hover-nav')).toBeInTheDocument();
  });

  it('displays footer with large text variant', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useContainerQuery } = require('@/hooks/use-container-query');
    useContainerQuery.mockReturnValue(false); // Desktop mode

    render(<GlobalFooterBlackLarge {...mockGlobalFooterProps} />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-background');
  });
});
