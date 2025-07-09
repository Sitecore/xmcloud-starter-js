import { useSitecoreContext } from '@sitecore-content-sdk/nextjs';
import { PromoImageProps } from './promo-image.props';
import { PromoImageDefault } from './PromoImageDefault.dev';
import { PromoImageLeft } from './PromoImageLeft.dev';
import { PromoImageRight } from './PromoImageRight.dev';
import { PromoImageMiddle } from './PromoImageMiddle.dev';
import { PromoTitlePartialOverlay } from './PromoImageTitlePartialOverlay.dev';

/* 
  Jira Ticket Information:
  - Key: SCDS-123
  - Summary: Promo Image is a flexible component that displays an image-based promotional section. It is used to direct users to internal or external links.
  - URL: https://velir.atlassian.net/browse/SCDS-123
*/

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<PromoImageProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  return <PromoImageDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const ImageLeft: React.FC<PromoImageProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  return <PromoImageLeft {...props} isPageEditing={isPageEditing} />;
};

export const ImageRight: React.FC<PromoImageProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  return <PromoImageRight {...props} isPageEditing={isPageEditing} />;
};

export const ImageMiddle: React.FC<PromoImageProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  return <PromoImageMiddle {...props} isPageEditing={isPageEditing} />;
};

export const TitlePartialOverlay: React.FC<PromoImageProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  return <PromoTitlePartialOverlay {...props} isPageEditing={isPageEditing} />;
};
