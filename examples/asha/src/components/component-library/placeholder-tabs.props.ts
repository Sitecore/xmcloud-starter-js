import type { ComponentProps, IGQLTextField } from '@/lib/component-props';

export interface PlaceholderTabsFields {
  data: {
    datasource: {
      children: {
        results: {
          id: string;
          title: IGQLTextField;
        }[];
      };
    };
  };
}

export type PlaceholderTabsProps = ComponentProps & {
  params: { [key: string]: string };
  fields: PlaceholderTabsFields;
};
