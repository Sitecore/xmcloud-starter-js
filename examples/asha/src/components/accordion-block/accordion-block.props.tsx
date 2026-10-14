import type { Field, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { CompatibleDatasource, CompatibleField, ComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
export type AccordionProps = ComponentProps &
  AccordionFields & {
    isPageEditing?: boolean;
  };

export interface AccordionFields {
  fields: {
    data: {
      datasource?: AccordionDatasourceFields;
      contextItem?: AccordionDatasourceFields;
    };
  } & AccordionDatasourceFields;
}

export type AccordionItemProps = {
  heading?: CompatibleField<Field<string>>;
  description?: CompatibleField<RichTextField>;
};

export interface AccordionDatasourceFields {
  heading?: CompatibleField<Field<string>>;
  description?: CompatibleField<Field<string>>;
  link?: CompatibleField<LinkField>;
  children?: {
    results?: AccordionItemProps[];
  };
}
