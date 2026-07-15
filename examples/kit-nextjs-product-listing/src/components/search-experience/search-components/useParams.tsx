'use client';
import { DEFAULT_PAGE_SIZE } from './constants';
import { SearchParams } from './models';

export const useParams = (params: SearchParams) => {
  const containerStyles = params.styles ?? '';
  const styles = `${params.GridParameters} ${containerStyles}`.trimEnd();
  const id = params.RenderingIdentifier;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  return {
    styles,
    id,
    pageSize,
    columns: params.columns,
  };
};
