import { useSitecoreContext } from '@sitecore-content-sdk/nextjs';
import { PromoAnimatedProps } from './promo-animated.props';
import { PromoAnimatedDefault } from './PromoAnimatedDefault.dev';
import { PromoAnimatedImageRight } from './PromoAnimatedImageRight.dev';

/* 
  Jira Ticket Information:
  - Key: SCDS-19
  - Summary: Promo Animated is a flexible component that displays an image-based callout. It is used to direct users to internal or external links.
  - URL: https://velir.atlassian.net/browse/SCDS-19
*/

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<PromoAnimatedProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ? sitecoreContext?.pageEditing : false;
  return <PromoAnimatedDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const ImageRight: React.FC<PromoAnimatedProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ? sitecoreContext?.pageEditing : false;
  return <PromoAnimatedImageRight {...props} isPageEditing={isPageEditing} />;
};
