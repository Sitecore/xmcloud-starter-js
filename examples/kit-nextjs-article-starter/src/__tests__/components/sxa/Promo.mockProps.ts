import { ImageField, Field, LinkField } from '@sitecore-content-sdk/nextjs';

// Mock image field data
export const mockImageField: ImageField = {
  value: {
    src: '/test-promo-icon.jpg',
    alt: 'Promo Icon',
    width: 100,
    height: 100,
  },
};

export const mockImageFieldEmpty: ImageField = {
  value: undefined,
};

// Mock text field data
export const mockTextField: Field<string> = {
  value: 'Test Promo Text',
};

export const mockTextFieldEmpty: Field<string> = {
  value: '',
};

// Mock link field data
export const mockLinkField: LinkField = {
  value: {
    href: '/test-promo-link',
    title: 'Test Promo Link',
    querystring: '',
  },
};

export const mockLinkFieldEmpty: LinkField = {
  value: {
    href: '',
  },
};

// Mock fields data
export const mockFields = {
  PromoIcon: mockImageField,
  PromoText: mockTextField,
  PromoLink: mockLinkField,
  PromoText2: mockTextField,
};

export const mockFieldsWithEmptyIcon = {
  PromoIcon: mockImageFieldEmpty,
  PromoText: mockTextField,
  PromoLink: mockLinkField,
  PromoText2: mockTextField,
};

export const mockFieldsWithEmptyText = {
  PromoIcon: mockImageField,
  PromoText: mockTextFieldEmpty,
  PromoLink: mockLinkField,
  PromoText2: mockTextFieldEmpty,
};

export const mockFieldsWithEmptyLink = {
  PromoIcon: mockImageField,
  PromoText: mockTextField,
  PromoLink: mockLinkFieldEmpty,
  PromoText2: mockTextField,
};

export const mockFieldsEmpty = {
  PromoIcon: mockImageFieldEmpty,
  PromoText: mockTextFieldEmpty,
  PromoLink: mockLinkFieldEmpty,
  PromoText2: mockTextFieldEmpty,
};

// Mock params data
export const mockParams = {
  styles: 'custom-promo-style',
  RenderingIdentifier: 'promo-rendering-id',
};

export const mockParamsWithoutStyles = {
  styles: '',
  RenderingIdentifier: 'promo-rendering-id',
};

export const mockParamsWithoutId = {
  styles: 'custom-promo-style',
  RenderingIdentifier: '',
};

// Complete props combinations
export const defaultProps = {
  params: mockParams,
  fields: mockFields,
};

export const propsWithoutStyles = {
  params: mockParamsWithoutStyles,
  fields: mockFields,
};

export const propsWithoutId = {
  params: mockParamsWithoutId,
  fields: mockFields,
};

export const propsWithEmptyIcon = {
  params: mockParams,
  fields: mockFieldsWithEmptyIcon,
};

export const propsWithEmptyText = {
  params: mockParams,
  fields: mockFieldsWithEmptyText,
};

export const propsWithEmptyLink = {
  params: mockParams,
  fields: mockFieldsWithEmptyLink,
};

export const propsEmpty = {
  params: mockParams,
  fields: mockFieldsEmpty,
};

