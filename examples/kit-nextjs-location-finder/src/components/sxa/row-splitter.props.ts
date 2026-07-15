import type { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import type { PlaceholderComponentProps, SitecoreLayoutParams } from '@/lib/component-props';

export type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type RowStyles = {
  [K in `Styles${RowNumber}`]?: string;
};

export type RowSplitterProps = PlaceholderComponentProps & {
  rendering: ComponentRendering;
  params: SitecoreLayoutParams & RowStyles;
};


