import { PlaceholderProps } from 'types/Placeholder.props';
import { ComponentProps } from '@/lib/component-props';

import type { JSX } from 'react';

/**
 * Model used for Sitecore Component integration
 */
export type Container5050Props = ComponentProps &
  PlaceholderProps & {
    left?: JSX.Element;
    right?: JSX.Element;
  };
