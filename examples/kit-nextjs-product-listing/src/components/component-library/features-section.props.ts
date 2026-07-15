import type React from 'react';
import type {
  ComponentProps,
  IGQLImageField,
  IGQLLinkField,
  IGQLRichTextField,
  IGQLTextField,
} from '@/lib/component-props';

export interface FeatureFields {
  id: string;
  featureTagLine: IGQLTextField;
  featureHeading: IGQLTextField;
  featureDescription: IGQLTextField;
  featureIcon: IGQLImageField;
  featureImage: IGQLImageField;
  featureLink1: IGQLLinkField;
  featureLink2: IGQLLinkField;
}

export interface FeatureSectionDatasourceFields {
  data: {
    datasource: {
      children: {
        results: FeatureFields[];
      };
      heading: IGQLTextField;
      tagLine: IGQLTextField;
      body: IGQLRichTextField;
      image: IGQLImageField;
      link1: IGQLLinkField;
      link2: IGQLLinkField;
    };
  };
}

export type FeatureSectionProps = ComponentProps & {
  params: { [key: string]: string };
  fields: FeatureSectionDatasourceFields;
};

export type FeatureSectionButtonsProps = {
  link1: IGQLLinkField;
  link2: IGQLLinkField;
};

export type FeatureBoxProps = React.HTMLProps<HTMLDivElement> & {
  feature: FeatureFields;
  type:
    | 'simple'
    | 'horizontal'
    | 'oneLiner'
    | 'extended'
    | 'extendedLarge'
    | 'withBackgroundImageSm'
    | 'withBackgroundImageLg'
    | 'MSCardSmall'
    | 'MSCardSmallIcon';
  withLinks?: boolean;
  centered?: boolean;
};
