import { PlaceholderProps } from 'types/Placeholder.props';
import { PlaceholderComponentProps } from '@/lib/component-props';

import type { JSX } from 'react';

/**
 * Model used for Sitecore Component integration
 */
export type Container7030Props = PlaceholderComponentProps &
  PlaceholderProps & {
    left?: JSX.Element;
    right?: JSX.Element;
  };


