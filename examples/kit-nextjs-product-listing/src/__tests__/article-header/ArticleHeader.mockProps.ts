import type { ArticleHeaderProps } from '../../components/article-header/article-header.props';
import type { Field, ImageField, Page } from '@sitecore-content-sdk/nextjs';

/**
 * Mock page object for normal mode
 */
const mockPageNormal = {
  mode: {
    isEditing: false,
    isNormal: true,
    isPreview: false,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

const sampleImage: ImageField = { value: { src: '/image.jpg', alt: 'img' } } as ImageField;
export const fullProps: ArticleHeaderProps = {
  rendering: { componentName: 'ArticleHeader', params: {} },
  params: {},
  fields: {
    imageRequired: sampleImage,
    eyebrowOptional: { value: 'Category' } as Field<string>,
  },
  externalFields: {
    pageHeaderTitle: { value: 'Article Title' } as Field<string>,
    pageReadTime: { value: '3 min' } as Field<string>,
    pageDisplayDate: { value: '2025-10-01' } as Field<string>,
  },
  page: mockPageNormal,
};

export const minimalProps: ArticleHeaderProps = {
  rendering: { componentName: 'ArticleHeader', params: {} },
  params: {},
  fields: {},
  externalFields: {
    pageHeaderTitle: { value: 'Article Title' } as Field<string>,
  },
  page: mockPageNormal,
};

export const noFieldsProps: ArticleHeaderProps = {
  rendering: { componentName: 'ArticleHeader', params: {} },
  params: {},
  fields: {} as ArticleHeaderProps['fields'],
  externalFields: {
    pageHeaderTitle: { value: '' } as Field<string>,
  },
  page: mockPageNormal,
};
