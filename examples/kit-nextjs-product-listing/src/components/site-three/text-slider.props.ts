import type { Field } from '@sitecore-content-sdk/nextjs';
import type { CompatibleDatasource, CompatibleField } from '@/lib/component-props';

export interface TextSliderFields {
  Text: CompatibleField<Field<string>>;
}

export type TextSliderProps = {
  params: { [key: string]: string };
  fields: CompatibleDatasource<TextSliderFields>;
};