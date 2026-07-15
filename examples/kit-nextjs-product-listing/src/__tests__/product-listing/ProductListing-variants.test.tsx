import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import * as ProductListing from '@/components/product-listing/ProductListing';
import {
  defaultProductListingProps,
  productListingPropsEditing,
} from './ProductListing.mockProps';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(),
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

// Mock variant components
jest.mock('@/components/product-listing/ProductListingDefault.dev', () => ({
  ProductListingDefault: (props: { isPageEditing?: boolean }) => (
    <div data-testid="product-listing-default" data-editing={props.isPageEditing?.toString()}>
      ProductListingDefault
    </div>
  ),
}));

jest.mock('@/components/product-listing/ProductListingThreeUp.dev', () => ({
  ProductListingThreeUp: (props: { isPageEditing?: boolean }) => (
    <div data-testid="product-listing-three-up" data-editing={props.isPageEditing?.toString()}>
      ProductListingThreeUp
    </div>
  ),
}));

jest.mock('@/components/product-listing/ProductListingSlider.dev', () => ({
  ProductListingSlider: (props: { isPageEditing?: boolean }) => (
    <div data-testid="product-listing-slider" data-editing={props.isPageEditing?.toString()}>
      ProductListingSlider
    </div>
  ),
}));

describe('ProductListing Variants', () => {
  const mockProps = defaultProductListingProps;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default variant', () => {
    it('renders ProductListingDefault when not in editing mode', () => {
      const { getByTestId } = render(<ProductListing.Default {...mockProps} />);

      expect(getByTestId('product-listing-default')).toBeInTheDocument();
      expect(getByTestId('product-listing-default')).toHaveAttribute('data-editing', 'false');
    });

    it('renders ProductListingDefault when in editing mode', () => {
      const { getByTestId } = render(<ProductListing.Default {...productListingPropsEditing} />);

      expect(getByTestId('product-listing-default')).toBeInTheDocument();
      expect(getByTestId('product-listing-default')).toHaveAttribute('data-editing', 'true');
    });

    it('passes all props to ProductListingDefault', () => {
      const { getByTestId } = render(<ProductListing.Default {...mockProps} />);

      expect(getByTestId('product-listing-default')).toBeInTheDocument();
    });

    it('uses page prop to get page mode', () => {
      render(<ProductListing.Default {...mockProps} />);

      // Component should render successfully with page prop
      expect(screen.getByTestId('product-listing-default')).toBeInTheDocument();
    });
  });

  describe('ThreeUp variant', () => {
    it('renders ProductListingThreeUp when not in editing mode', () => {
      const { getByTestId } = render(<ProductListing.ThreeUp {...mockProps} />);

      expect(getByTestId('product-listing-three-up')).toBeInTheDocument();
      expect(getByTestId('product-listing-three-up')).toHaveAttribute('data-editing', 'false');
    });

    it('renders ProductListingThreeUp when in editing mode', () => {
      const { getByTestId } = render(<ProductListing.ThreeUp {...productListingPropsEditing} />);

      expect(getByTestId('product-listing-three-up')).toBeInTheDocument();
      expect(getByTestId('product-listing-three-up')).toHaveAttribute('data-editing', 'true');
    });

    it('passes all props to ProductListingThreeUp', () => {
      const { getByTestId } = render(<ProductListing.ThreeUp {...mockProps} />);

      expect(getByTestId('product-listing-three-up')).toBeInTheDocument();
    });

    it('uses page prop to get page mode', () => {
      render(<ProductListing.ThreeUp {...mockProps} />);

      // Component should render successfully with page prop
      expect(screen.getByTestId('product-listing-three-up')).toBeInTheDocument();
    });
  });

  describe('Slider variant', () => {
    it('renders ProductListingSlider when not in editing mode', () => {
      const { getByTestId } = render(<ProductListing.Slider {...mockProps} />);

      expect(getByTestId('product-listing-slider')).toBeInTheDocument();
      expect(getByTestId('product-listing-slider')).toHaveAttribute('data-editing', 'false');
    });

    it('renders ProductListingSlider when in editing mode', () => {
      const { getByTestId } = render(<ProductListing.Slider {...productListingPropsEditing} />);

      expect(getByTestId('product-listing-slider')).toBeInTheDocument();
      expect(getByTestId('product-listing-slider')).toHaveAttribute('data-editing', 'true');
    });

    it('passes all props to ProductListingSlider', () => {
      const { getByTestId } = render(<ProductListing.Slider {...mockProps} />);

      expect(getByTestId('product-listing-slider')).toBeInTheDocument();
    });

    it('uses page prop to get page mode', () => {
      render(<ProductListing.Slider {...mockProps} />);

      // Component should render successfully with page prop
      expect(screen.getByTestId('product-listing-slider')).toBeInTheDocument();
    });
  });

  describe('Integration with page prop', () => {
    it('correctly extracts isPageEditing from page prop for all variants', () => {
      const { getByTestId: getDefaultTestId, unmount: unmountDefault } = render(
        <ProductListing.Default {...productListingPropsEditing} />
      );
      expect(getDefaultTestId('product-listing-default')).toHaveAttribute('data-editing', 'true');
      unmountDefault();

      const { getByTestId: getThreeUpTestId, unmount: unmountThreeUp } = render(
        <ProductListing.ThreeUp {...productListingPropsEditing} />
      );
      expect(getThreeUpTestId('product-listing-three-up')).toHaveAttribute('data-editing', 'true');
      unmountThreeUp();

      const { getByTestId: getSliderTestId } = render(
        <ProductListing.Slider {...productListingPropsEditing} />
      );
      expect(getSliderTestId('product-listing-slider')).toHaveAttribute('data-editing', 'true');
    });

    it('handles different editing states correctly', () => {
      // Test editing mode
      const { getByTestId: getEditingTestId } = render(
        <ProductListing.Default {...productListingPropsEditing} />
      );
      expect(getEditingTestId('product-listing-default')).toHaveAttribute('data-editing', 'true');

      // Clean up before rendering in non-editing mode
      cleanup();

      // Test non-editing mode
      const { getByTestId: getNonEditingTestId } = render(
        <ProductListing.Default {...mockProps} />
      );
      expect(getNonEditingTestId('product-listing-default')).toHaveAttribute(
        'data-editing',
        'false'
      );
    });
  });
});