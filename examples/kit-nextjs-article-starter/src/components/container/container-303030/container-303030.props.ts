import type React from 'react';
import type { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { PlaceholderProps } from '@/types/Placeholder.props';
import { FlexItemProps } from '@/components/flex/Flex.dev';

export type Container303030Props = ComponentProps &
  PlaceholderProps & {
    left?: JSX.Element;
    center?: JSX.Element;
    right?: JSX.Element;
  };

export type Container303030FlexItemProps = FlexItemProps;
