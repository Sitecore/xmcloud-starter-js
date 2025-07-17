import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { TextBannerProps } from './text-banner.props';
import { Default as TextBannerDefault } from './TextBannerDefault.dev';
import { Default as TextBanerVariant01 } from './TextBanner01.dev';
import { Default as TextBanerVariant02 } from './TextBanner02.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<TextBannerProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <TextBannerDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const TextBanner01: React.FC<TextBannerProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <TextBanerVariant01 {...props} isPageEditing={isPageEditing} />;
};

export const TextBanner02: React.FC<TextBannerProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <TextBanerVariant02 {...props} isPageEditing={isPageEditing} />;
};
