import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export interface ContainerProps extends ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}
