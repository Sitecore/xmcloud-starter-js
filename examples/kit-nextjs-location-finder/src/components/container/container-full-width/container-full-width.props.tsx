import { PlaceholderProps } from '@/types/Placeholder.props';
import { PlaceholderComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type ContainerFullWidthProps = PlaceholderComponentProps & PlaceholderProps & ContainerFullWidthParams;

export type ContainerFullWidthParams = {
  params?: {
    excludeTopMargin?: string;
  };
};


