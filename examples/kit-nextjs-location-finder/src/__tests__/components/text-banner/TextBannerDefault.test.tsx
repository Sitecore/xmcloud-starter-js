import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextBannerDefault } from '@/components/text-banner/TextBannerDefault.dev';
import {
  mockTextBannerProps,
  mockTextBannerPropsWithoutDescription,
} from './text-banner.mock.props';

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

describe('TextBannerDefault', () => {
  it('renders text banner with heading and description', () => {
    render(<TextBannerDefault {...mockTextBannerProps} />);

    const textFields = screen.getAllByTestId('text-field');
    expect(textFields).toHaveLength(2);
    expect(textFields[0]).toHaveTextContent('Advanced Emergency Response Vehicles');
    expect(textFields[1]).toHaveTextContent(
      'Alaris manufactures cutting-edge ambulances, fire trucks'
    );
  });

  it('renders with AnimatedSection components', () => {
    render(<TextBannerDefault {...mockTextBannerProps} />);

    const animatedSections = screen.getAllByTestId('animated-section');
    expect(animatedSections).toHaveLength(2);
  });

  it('renders NoDataFallback when no fields are provided', () => {
    const propsWithoutFields = {
      ...mockTextBannerProps,
      fields: null,
    };

    // @ts-expect-error Testing no fields scenario
    render(<TextBannerDefault {...propsWithoutFields} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for Text Banner')).toBeInTheDocument();
  });

  it('applies custom styles from params', () => {
    const { container } = render(<TextBannerDefault {...mockTextBannerProps} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-style');
  });

  it('renders without description field', () => {
    render(<TextBannerDefault {...mockTextBannerPropsWithoutDescription} />);

    const textFields = screen.getAllByTestId('text-field');
    // Should still render both Text components even if description is undefined
    expect(textFields.length).toBeGreaterThanOrEqual(1);
    expect(textFields[0]).toHaveTextContent('Reliable Fleet Solutions');
  });
});
