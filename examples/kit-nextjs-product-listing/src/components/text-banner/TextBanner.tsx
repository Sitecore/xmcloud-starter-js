import { useSitecore } from '@sitecore-content-sdk/nextjs';
import type { TextBannerProps } from './text-banner.props';
import { TextBannerDefault } from './TextBannerDefault.dev';
import { TextBannerTextTop } from './TextBannerTextTop.dev';
import { TextBannerBlueTitleRight } from './TextBannerBlueTitleRight.dev';

import { TextBanner01 as TextBannerVariant01 } from './TextBanner01.dev';
import { TextBanner02 as TextBannerVariant02 } from './TextBanner02.dev';
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
  return <TextBannerVariant01 {...props} isPageEditing={isPageEditing} />;
};

export const TextBanner02: React.FC<TextBannerProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <TextBannerVariant02 {...props} isPageEditing={isPageEditing} />;
};

export const TextTop: React.FC<TextBannerProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <TextBannerTextTop {...props} isPageEditing={isPageEditing} />;
};

export const BlueTitleRight: React.FC<TextBannerProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <TextBannerBlueTitleRight {...props} isPageEditing={isPageEditing} />;
};
