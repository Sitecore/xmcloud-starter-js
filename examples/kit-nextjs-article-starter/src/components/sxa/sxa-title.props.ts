export interface TitleDatasourceField {
  url: {
    path: string;
    siteName: string;
  };
  field: {
    jsonValue: {
      value: string;
      metadata?: { [key: string]: unknown };
    };
  };
}

export interface TitleFields {
  data?: {
    datasource?: TitleDatasourceField;
    contextItem?: TitleDatasourceField;
  };
}

export type TitleProps = {
  params: { [key: string]: string };
  fields?: TitleFields;
};
