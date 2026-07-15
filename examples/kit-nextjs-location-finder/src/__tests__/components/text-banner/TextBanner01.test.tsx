import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextBanner01 } from '@/components/text-banner/TextBanner01.dev';
import { mockTextBannerPropsBlueTheme } from './text-banner.mock.props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span' }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { 'data-testid': 'text-field' }, field?.value);
  }),
}));

// Mock AnimatedSection
jest.mock('@/components/animated-section/AnimatedSection.dev', () => ({
  Default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-section">{children}</div>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">No data for {componentName}</div>
  ),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('TextBanner01', () => {
  it('renders variant 01 with blue theme and heading', () => {
    render(<TextBanner01 {...mockTextBannerPropsBlueTheme} />);

    const textFields = screen.getAllByTestId('text-field');
    expect(textFields[0]).toHaveTextContent('Fire & Rescue Excellence');
  });

  it('applies bg-primary for blue background', () => {
    const { container } = render(<TextBanner01 {...mockTextBannerPropsBlueTheme} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-primary');
  });

  it('renders NoDataFallback when no fields provided', () => {
    const propsWithoutFields = {
      ...mockTextBannerPropsBlueTheme,
      fields: null,
    };

    // @ts-expect-error Testing no fields scenario
    render(<TextBanner01 {...propsWithoutFields} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for Text Banner Variant 01')).toBeInTheDocument();
  });
});
