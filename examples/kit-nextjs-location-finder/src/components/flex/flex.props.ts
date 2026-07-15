import type {
  ComponentFields,
  ComponentParams,
  ComponentRendering,
  NextjsContentSdkComponent,
  Page,
} from '@sitecore-content-sdk/nextjs';

export type FlexProps = {
  direction?: string;
  justify?: string;
  align?: string;
  gap?: string;
  wrap?: string;
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  asChild?: boolean;
  fullBleed?: boolean;
};

export type FlexItemProps = {
  children: React.ReactNode;
  className?: string;
  grow?: string;
  shrink?: string;
  basis?: string;
  alignSelf?: string;
  as?: React.ElementType;
  asChild?: boolean;
  fullBleed?: boolean;
};

export type XMComponentProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: ComponentFields;
  page: Page;
  componentMap: Map<string, NextjsContentSdkComponent>;
};
