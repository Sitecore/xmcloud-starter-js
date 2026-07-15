import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextBannerTextTop } from '@/components/text-banner/TextBannerTextTop.dev';
import { mockTextBannerProps } from './text-banner.mock.props';

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

describe('TextBannerTextTop', () => {
  it('renders TextTop variant with grid layout', () => {
    const { container } = render(<TextBannerTextTop {...mockTextBannerProps} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-component', 'TextBanner');
  });

  it('renders heading and description fields', () => {
    render(<TextBannerTextTop {...mockTextBannerProps} />);

    const textFields = screen.getAllByTestId('text-field');
    expect(textFields[0]).toHaveTextContent('Advanced Emergency Response Vehicles');
    expect(textFields[1]).toHaveTextContent('Alaris manufactures cutting-edge ambulances');
  });

  it('renders NoDataFallback when no fields provided', () => {
    const propsWithoutFields = {
      ...mockTextBannerProps,
      fields: null,
    };

    // @ts-expect-error Testing no fields scenario
    render(<TextBannerTextTop {...propsWithoutFields} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for Text Banner')).toBeInTheDocument();
  });
});
