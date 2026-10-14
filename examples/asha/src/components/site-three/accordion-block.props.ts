import type { IGQLLinkField, IGQLRichTextField, IGQLTextField } from '@/lib/component-props';

export interface AccordionItemFields {
  id: string;
  heading?: IGQLTextField;
  description?: IGQLRichTextField;
}

export interface AccordionDatasourceFields {
  data: {
    datasource: {
      heading?: IGQLTextField;
      description?: IGQLTextField;
      link: IGQLLinkField;
      children: {
        results: AccordionItemFields[];
      };
    };
  };
}

export type AccordionProps = {
  params: { [key: string]: string };
  fields: AccordionDatasourceFields;
};