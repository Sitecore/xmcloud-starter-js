import { Field, ImageField } from '@sitecore-content-sdk/nextjs';

import { ComponentProps } from '@/lib/component-props';

interface ImageGalleryParams {
  [key: string]: any; // eslint-disable-line
}

interface ImageGalleryFields {
  title?: Field<string>;
  description?: Field<string>;
  image1: ImageField;
  image2: ImageField;
  image3: ImageField;
  image4: ImageField;
}

export interface ImageGalleryProps extends ComponentProps {
  isPageEditing?: boolean;
  params: ImageGalleryParams;
  fields: ImageGalleryFields;
}
