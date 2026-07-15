import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as PromoAnimated, ImageRight } from '@/components/promo-animated/PromoAnimated';
import { mockPromoAnimatedProps } from './promo-animated.mock.props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
      mode: {
        isEditing: false,
        isPreview: false,
        isNormal: true,
      },
    },
  })),
}));

// Mock child components
jest.mock('@/components/promo-animated/PromoAnimatedDefault.dev', () => ({
  PromoAnimatedDefault: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="promo-animated-default">
      PromoAnimatedDefault - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/promo-animated/PromoAnimatedImageRight.dev', () => ({
  PromoAnimatedImageRight: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="promo-animated-image-right">
      PromoAnimatedImageRight - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

describe('PromoAnimated', () => {
  it('renders Default variant correctly', () => {
    render(<PromoAnimated {...mockPromoAnimatedProps} />);
    expect(screen.getByTestId('promo-animated-default')).toBeInTheDocument();
    expect(screen.getByText(/PromoAnimatedDefault - Normal/)).toBeInTheDocument();
  });

  it('renders ImageRight variant correctly', () => {
    render(<ImageRight {...mockPromoAnimatedProps} />);
    expect(screen.getByTestId('promo-animated-image-right')).toBeInTheDocument();
    expect(screen.getByText(/PromoAnimatedImageRight - Normal/)).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    const { rerender } = render(<PromoAnimated {...mockPromoAnimatedProps} />);
    expect(screen.getByTestId('promo-animated-default')).toBeInTheDocument();

    rerender(<ImageRight {...mockPromoAnimatedProps} />);
    expect(screen.getByTestId('promo-animated-image-right')).toBeInTheDocument();
  });
});
