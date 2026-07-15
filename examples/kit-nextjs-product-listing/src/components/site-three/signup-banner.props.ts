import type { Field, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { CompatibleDatasource, CompatibleField } from '@/lib/component-props';

export interface SignupBannerFields {
  Heading: CompatibleField<Field<string>>;
  Subheading: CompatibleField<RichTextField>;
  Image: CompatibleField<ImageField>;
  Image2: CompatibleField<ImageField>;
}

export type SignupBannerProps = {
  params: { [key: string]: string };
  fields: CompatibleDatasource<SignupBannerFields>;
};