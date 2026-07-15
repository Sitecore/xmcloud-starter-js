import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export type DynamicPlaceholderProps = ComponentProps & {
  rendering: ComponentRendering;
};
