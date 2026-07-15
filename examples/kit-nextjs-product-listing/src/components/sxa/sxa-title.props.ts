import type { ComponentProps } from '@/lib/component-props';
import type { JSX } from 'react';

export interface TitleFields {
  data?: {
    datasource?: {
      url?: {
        path: string;
        siteName: string;
      };
      field?: {
        jsonValue?: {
          value: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
    contextItem?: {
      url?: {
        path: string;
        siteName: string;
      };
      field?: {
        jsonValue?: {
          value: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
  };
}

export type TitleProps = ComponentProps & {
  params: { [key: string]: string };
  fields?: TitleFields;
};

export type ComponentContentProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};
