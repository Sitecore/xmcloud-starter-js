import type { Page } from '@sitecore-content-sdk/nextjs';
import type {
  ComponentProps,
  IGQLImageField,
  IGQLLinkField,
  IGQLRichTextField,
  IGQLTextField,
} from '@/lib/component-props';

export interface ContactFields {
  id: string;
  image: IGQLImageField;
  heading: IGQLTextField;
  description: IGQLTextField;
  contactLink: IGQLLinkField;
  buttonLink: IGQLLinkField;
}

export interface ContactSectionDatasourceFields {
  data: {
    datasource: {
      children: {
        results: ContactFields[];
      };
      tagLine: IGQLTextField;
      heading: IGQLTextField;
      body: IGQLRichTextField;
      image: IGQLImageField;
    };
  };
}

export type ContactSectionProps = ComponentProps & {
  fields: ContactSectionDatasourceFields;
};

export type ContactCardImageProps = {
  contact: ContactFields;
  size: 'xs' | 'sm' | 'md' | 'lg';
};

export type ContactCardProps = {
  contact: ContactFields;
  type: 'sm' | 'md' | 'lg' | 'horizontal' | 'noImage';
  centered?: boolean;
  page: Page;
};
