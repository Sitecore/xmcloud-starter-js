import type {
  CompatibleDatasource,
  CompatibleField,
} from '@/lib/component-props';
import type { ImageField, LinkField, RichTextField, Field } from '@sitecore-content-sdk/nextjs';

export interface QuestionFields {
  id: string;
  question: CompatibleField<Field<string>>;
  answer: CompatibleField<RichTextField>;
  image: CompatibleField<ImageField>;
}

export interface FAQDatasourceFields {
  children: {
    results: QuestionFields[];
  };
  heading: CompatibleField<Field<string>>;
  text: CompatibleField<RichTextField>;
  heading2: CompatibleField<Field<string>>;
  text2: CompatibleField<RichTextField>;
  link: CompatibleField<LinkField>;
}

export type FAQProps = {
  params: { [key: string]: string };
  fields: CompatibleDatasource<FAQDatasourceFields>;
};

export type QuestionAccordionItemProps = {
  q: QuestionFields;
  type: 'simple' | 'bordered' | 'boxed';
  className?: string;
};

export type QuestionItemProps = {
  q: QuestionFields;
  type: 'simple' | 'bordered' | 'centered';
  showIcon?: boolean;
};
