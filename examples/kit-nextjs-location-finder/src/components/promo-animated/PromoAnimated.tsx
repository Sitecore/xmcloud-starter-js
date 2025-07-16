import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { PromoAnimatedProps } from './promo-animated.props';
import { PromoAnimatedDefault } from './PromoAnimatedDefault.dev';
import { PromoAnimatedImageRight } from './PromoAnimatedImageRight.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<PromoAnimatedProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <PromoAnimatedDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const ImageRight: React.FC<PromoAnimatedProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <PromoAnimatedImageRight {...props} isPageEditing={isEditing} />;
};
