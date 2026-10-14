import { PlaceholderProps } from '@/types/Placeholder.props';
import { ComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type ContainerFullWidthProps = ComponentProps & PlaceholderProps & ContainerFullWidthParams;

export type ContainerFullWidthParams = {
  params?: {
    excludeTopMargin?: string;
  };
};
