import { CompatibleField, ComponentProps } from 'lib/component-props';
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type React from 'react';

export interface ImageFields {
  Image?: CompatibleField<ImageField>;
  ImageCaption?: CompatibleField<Field<string>>;
  TargetUrl?: CompatibleField<LinkField>;
}

export interface ImageProps extends ComponentProps {
  fields?: ImageFields;
}

export interface ImageWrapperProps {
  className: string;
  id?: string;
  children: React.ReactNode;
}
