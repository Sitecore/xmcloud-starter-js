import { PlaceholderProps } from 'types/Placeholder.props';
import { ComponentProps } from '@/lib/component-props';

import type { JSX } from 'react';

/**
 * Model used for Sitecore Component integration
 */
export type Container303030Props = ComponentProps &
  PlaceholderProps & {
    left?: JSX.Element;
    center?: JSX.Element;
    right?: JSX.Element;
  };
