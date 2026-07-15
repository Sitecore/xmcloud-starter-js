import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as AlertBannerDefault } from '../../components/alert-banner/AlertBanner.dev';
import {
  defaultAlertBannerProps,
  alertBannerPropsNoFields,
  alertBannerPropsMinimal,
  alertBannerPropsWithLink,
  mockUseSitecoreNormal,
} from './AlertBanner.mockProps';

// Mock lucide-react icon
jest.mock('lucide-react', () => ({ X: () => <svg data-testid="x-icon" /> }));

// Mock the Sitecore Content SDK
import type { Field } from '@sitecore-content-sdk/nextjs';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({
    field,
    tag: Tag = 'span',
    className,
  }: {
    field?: Field<string>;
    tag?: string;
    className?: string;
  }) => {
    const f = field as Field<string> | undefined;
    if (!f?.value) return null;
    // Create element using provided tag (Tag is a string tag name in tests)
    const tagName = Tag as string;
    return React.createElement(tagName, { className }, f.value);
  },
  useSitecore: jest.fn(() => mockUseSitecoreNormal),
}));

// Mock ButtonComponent and NoDataFallback
import type { LinkField } from '@sitecore-content-sdk/nextjs';

jest.mock('../../components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink }: { buttonLink?: LinkField }) => {
    const bl = buttonLink as LinkField | undefined;
    return (
      <a href={bl?.value?.href} data-testid="button-link">
        {bl?.value?.text}
      </a>
    );
  },
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('AlertBanner Component', () => {
  it('renders title and description', () => {
    render(<AlertBannerDefault {...defaultAlertBannerProps} />);

    expect(screen.getByText('Site notice')).toBeInTheDocument();
    expect(screen.getByText('This is an alert banner for site-wide messages.')).toBeInTheDocument();
  });

  it('renders link when provided', () => {
    render(<AlertBannerDefault {...alertBannerPropsWithLink} />);

    expect(screen.getByTestId('button-link')).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  it('can be dismissed via close button', () => {
    const { container } = render(<AlertBannerDefault {...defaultAlertBannerProps} />);

    const closeButton = container.querySelector('button');
    expect(closeButton).toBeInTheDocument();

    if (closeButton) fireEvent.click(closeButton);
    // After clicking, the alert should have class 'hidden' (per component logic)
    expect(container.querySelector('.hidden')).toBeInTheDocument();
  });

  it('renders alert structure even when field values are empty', () => {
    const { container } = render(<AlertBannerDefault {...alertBannerPropsNoFields} />);

    // Component renders the alert structure even with empty fields
    // This matches the component's actual behavior (it checks if (fields) which is truthy for {})
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
  });

  it('renders gracefully with minimal fields', () => {
    render(<AlertBannerDefault {...alertBannerPropsMinimal} />);

    expect(screen.getByText('Site notice')).toBeInTheDocument();
  });
});
