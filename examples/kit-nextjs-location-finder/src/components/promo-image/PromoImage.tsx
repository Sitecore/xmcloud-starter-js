'use client';
import { PromoImageProps } from './promo-image.props';
import { PromoImageDefault } from './PromoImageDefault.dev';
import { PromoImageLeft } from './PromoImageLeft.dev';
import { PromoImageRight } from './PromoImageRight.dev';
import { PromoImageMiddle } from './PromoImageMiddle.dev';
import { PromoTitlePartialOverlay } from './PromoImageTitlePartialOverlay.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<PromoImageProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PromoImageDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const ImageLeft: React.FC<PromoImageProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PromoImageLeft {...props} isPageEditing={isEditing} />;
};

export const ImageRight: React.FC<PromoImageProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PromoImageRight {...props} isPageEditing={isEditing} />;
};

export const ImageMiddle: React.FC<PromoImageProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PromoImageMiddle {...props} isPageEditing={isEditing} />;
};

export const TitlePartialOverlay: React.FC<PromoImageProps> = (props) => {
  const { isEditing } = props.page.mode;
  return <PromoTitlePartialOverlay {...props} isPageEditing={isEditing} />;
};
