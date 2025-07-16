import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ProductListingProps } from './product-listing.props';
import { ProductListingDefault } from './ProductListingDefault.dev';
import { ProductListingThreeUp } from './ProductListingThreeUp.dev';
import { ProductListingSlider } from './ProductListingSlider.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<ProductListingProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <ProductListingDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const ThreeUp: React.FC<ProductListingProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <ProductListingThreeUp {...props} isPageEditing={isEditing} />;
};

// Variants
export const Slider: React.FC<ProductListingProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <ProductListingSlider {...props} isPageEditing={isEditing} />;
};
