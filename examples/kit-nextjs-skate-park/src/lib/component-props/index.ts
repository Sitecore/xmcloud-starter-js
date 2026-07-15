import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  LinkField,
  Page,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';

export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams & {
    RenderingIdentifier?: string;
    styles?: string;
    EnabledPlaceholders?: string;
  };
  page: Page;
};

export type ComponentWithContextProps = ComponentProps & {
  page: Page;
};

export type GraphQLField<T> = {
  jsonValue: T;
};

export type CompatibleField<T> = T | GraphQLField<T> | { jsonValue?: T };

export type GraphQLTextField = GraphQLField<Field<string>>;
export type GraphQLImageField = GraphQLField<ImageField>;
export type GraphQLLinkField = GraphQLField<LinkField>;
export type GraphQLRichTextField = GraphQLField<RichTextField>;

export type GraphQLDatasource<T> = {
  data: {
    datasource: T;
  };
};

export type CompatibleDatasource<T> =
  | GraphQLDatasource<T>
  | {
      data?: {
        datasource?: T;
        contextItem?: T;
      };
    }
  | T;

export const getDatasource = <T>(
  fields: CompatibleDatasource<T> | null | undefined
): T | undefined => {
  if (!fields) return undefined;

  const graphFields = fields as {
    data?: {
      datasource?: T;
      contextItem?: T;
    };
  };

  return graphFields?.data?.datasource ?? graphFields?.data?.contextItem ?? (fields as T);
};

export const getFieldValue = <T>(field: CompatibleField<T> | null | undefined): T | undefined => {
  if (!field) return undefined;

  const maybeWrapped = field as { jsonValue?: T };
  if ('jsonValue' in maybeWrapped) {
    return maybeWrapped.jsonValue;
  }

  return field as T;
};
