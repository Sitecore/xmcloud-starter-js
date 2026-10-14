import { PlaceholderProps } from '@/types/Placeholder.props';
import { ComponentProps } from '@/lib/component-props';
import { BackgroundColor } from '@/enumerations/BackgroundColor.enum';

/**
 * Model used for Sitecore Component integration
 */
export type ContainerFullBleedProps = ComponentProps & PlaceholderProps & ContainerFullBleedParams;

export type ContainerFullBleedParams = {
  params?: {
    backgroundColor?: BackgroundColor;
    backgroundImagePath?: string;
    excludeTopMargin?: string;
    inset?: string;
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
