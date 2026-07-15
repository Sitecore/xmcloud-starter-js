import type { PlaceholderComponentProps, SitecoreLayoutParams } from '@/lib/component-props';

export type ColumnNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ColumnWidths = {
  [K in ColumnNumber as `ColumnWidth${K}`]?: string;
};

export type ColumnStyles = {
  [K in ColumnNumber as `Styles${K}`]?: string;
};

export type ColumnSplitterProps = PlaceholderComponentProps & {
  params: SitecoreLayoutParams & ColumnWidths & ColumnStyles;
};


