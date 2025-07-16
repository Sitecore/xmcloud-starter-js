import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { PromoImageProps } from './promo-image.props';
import { PromoImageDefault } from './PromoImageDefault.dev';
import { PromoImageLeft } from './PromoImageLeft.dev';
import { PromoImageRight } from './PromoImageRight.dev';
import { PromoImageMiddle } from './PromoImageMiddle.dev';
import { PromoTitlePartialOverlay } from './PromoImageTitlePartialOverlay.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<PromoImageProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PromoImageDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const ImageLeft: React.FC<PromoImageProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PromoImageLeft {...props} isPageEditing={isPageEditing} />;
};

export const ImageRight: React.FC<PromoImageProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PromoImageRight {...props} isPageEditing={isPageEditing} />;
};

export const ImageMiddle: React.FC<PromoImageProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PromoImageMiddle {...props} isPageEditing={isPageEditing} />;
};

export const TitlePartialOverlay: React.FC<PromoImageProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PromoTitlePartialOverlay {...props} isPageEditing={isPageEditing} />;
};
