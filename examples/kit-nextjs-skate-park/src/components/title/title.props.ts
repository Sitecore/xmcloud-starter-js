import { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { CompatibleDatasource, CompatibleField, ComponentProps } from 'lib/component-props';
import type React from 'react';

export interface TitleItem {
  url: {
    path: string;
    siteName: string;
  };
  field: CompatibleField<TextField>;
}

export interface TitleProps extends ComponentProps {
  fields?: CompatibleDatasource<TitleItem>;
}

export interface TitleComponentContentProps {
  id?: string;
  styles?: string;
  children: React.ReactNode;
}

export type TitleLink = LinkField;
export type TitleTextField = TextField;
