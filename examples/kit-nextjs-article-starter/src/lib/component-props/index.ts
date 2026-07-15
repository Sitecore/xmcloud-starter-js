import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  LinkField,
  Page,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';

/**
 * Shared component props
 */
export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams;
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

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const looksLikeFieldValue = (value: Record<string, unknown>): boolean => 'value' in value;

export const normalizeFieldShape = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeFieldShape(item)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  if ('jsonValue' in value) {
    return {
      ...value,
      jsonValue: normalizeFieldShape(value.jsonValue),
    } as T;
  }

  if (looksLikeFieldValue(value)) {
    return {
      jsonValue: value,
    } as T;
  }

  const normalizedObject: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    normalizedObject[key] = normalizeFieldShape(child);
  }

  return normalizedObject as T;
};
