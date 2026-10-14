import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';

export type SearchParams = ComponentParams & {
  columns?: string;
  pageSize?: number;
  styles?: string;
  GridParameters?: string;
  RenderingIdentifier?: string;
};

export type SearchDocument = {
  sc_item_id: string;
  Description: string;
  Price: string;
  ProductName: string;
  AmpPower: string;
  Link: string;
};

type SearchDocumentKey = keyof SearchDocument;

/**
 * Mapping of the component fields to the search index fields
 */
export interface SearchFieldsMapping {
  description?: SearchDocumentKey;
  type?: SearchDocumentKey;
  title?: SearchDocumentKey;
  link?: SearchDocumentKey;
  images?: SearchDocumentKey;
  tags?: SearchDocumentKey;
}

export interface SearchField {
  searchIndex: string;
  fieldsMapping: SearchFieldsMapping;
}

export interface SearchExperienceProps {
  params: SearchParams;
  fields: {
    /**
     * JSON stringified object of type SearchField
     */
    search: {
      value: string;
    };
  };
  rendering: ComponentRendering;
}
