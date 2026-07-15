import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as PromoImage, ImageLeft, ImageRight } from '@/components/promo-image/PromoImage';
import { mockPromoImageProps } from './promo-image.mock.props';

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
jest.mock('@/components/promo-image/PromoImageDefault.dev', () => ({
  PromoImageDefault: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="promo-image-default">
      PromoImageDefault - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/promo-image/PromoImageLeft.dev', () => ({
  PromoImageLeft: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="promo-image-left">
      PromoImageLeft - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/promo-image/PromoImageRight.dev', () => ({
  PromoImageRight: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="promo-image-right">
      PromoImageRight - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/promo-image/PromoImageMiddle.dev', () => ({
  PromoImageMiddle: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="promo-image-middle">
      PromoImageMiddle - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/promo-image/PromoImageTitlePartialOverlay.dev', () => ({
  PromoTitlePartialOverlay: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="promo-image-title-overlay">
      PromoTitlePartialOverlay - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

describe('PromoImage', () => {
  it('renders Default variant correctly', () => {
    render(<PromoImage {...mockPromoImageProps} />);
    expect(screen.getByTestId('promo-image-default')).toBeInTheDocument();
    expect(screen.getByText(/PromoImageDefault - Normal/)).toBeInTheDocument();
  });

  it('renders ImageLeft variant correctly', () => {
    render(<ImageLeft {...mockPromoImageProps} />);
    expect(screen.getByTestId('promo-image-left')).toBeInTheDocument();
    expect(screen.getByText(/PromoImageLeft - Normal/)).toBeInTheDocument();
  });

  it('renders ImageRight variant correctly', () => {
    render(<ImageRight {...mockPromoImageProps} />);
    expect(screen.getByTestId('promo-image-right')).toBeInTheDocument();
    expect(screen.getByText(/PromoImageRight - Normal/)).toBeInTheDocument();
  });
});
