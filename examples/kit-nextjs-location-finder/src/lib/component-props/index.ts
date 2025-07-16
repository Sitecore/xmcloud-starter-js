import { ComponentParams, ComponentRendering, Page } from '@sitecore-content-sdk/nextjs';

/**
 * Shared component props
 */
export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams;
};

/**
 * Component props with context
 * You can access `page` by withSitecore/useSitecore
 * @example withSitecore()(ContentBlock)
 * @example const { page } = useSitecore()
 */
export type ComponentWithContextProps = ComponentProps & {
  page: Page;
};
