import { PlaceholderProps } from 'types/Placeholder.props';
import { PlaceholderComponentProps } from '@/lib/component-props';

import type { JSX } from 'react';

/**
 * Model used for Sitecore Component integration
 */
export type Container6040Props = PlaceholderComponentProps &
  PlaceholderProps & {
    left?: JSX.Element;
    right?: JSX.Element;
  };


