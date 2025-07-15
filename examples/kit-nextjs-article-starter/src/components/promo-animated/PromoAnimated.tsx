import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { PromoAnimatedProps } from './promo-animated.props';
import { PromoAnimatedDefault } from './PromoAnimatedDefault.dev';
import { PromoAnimatedImageRight } from './PromoAnimatedImageRight.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<PromoAnimatedProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page?.mode.isEditing ? page?.mode.isEditing : false;
  return <PromoAnimatedDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const ImageRight: React.FC<PromoAnimatedProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page?.mode.isEditing ? page?.mode.isEditing : false;
  return <PromoAnimatedImageRight {...props} isPageEditing={isPageEditing} />;
};
