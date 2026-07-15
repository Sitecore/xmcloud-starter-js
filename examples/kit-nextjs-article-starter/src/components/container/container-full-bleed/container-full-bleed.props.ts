/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps } from '@/lib/component-props';
import { PlaceholderProps } from '@/types/Placeholder.props';
import { BackgroundColor } from '@/enumerations/BackgroundColor.enum';

export type ContainerFullBleedParams = {
  params?: {
    backgroundColor?: BackgroundColor;
    backgroundImagePath?: string;
    excludeTopMargin?: string;
    inset?: string;
    [key: string]: any;
  };
};

export type ContainerFullBleedProps = ComponentProps &
  PlaceholderProps &
  ContainerFullBleedParams;
