import type { OptionalComponentProps } from '@/lib/component-props';

export type TitleFields = {
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
};

export type TitleProps = OptionalComponentProps & {
  fields?: TitleFields;
};

export type TitleComponentContentProps = {
  id?: string;
  styles?: string;
  children: React.ReactElement;
};

