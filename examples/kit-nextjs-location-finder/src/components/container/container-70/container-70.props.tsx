import { PlaceholderProps } from '@/types/Placeholder.props';
import { PlaceholderComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type Container70Props = PlaceholderComponentProps & PlaceholderProps & Container70Params;

type Container70Params = {
  params?: {
    excludeTopMargin?: string;
  };
};


