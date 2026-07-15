import type {
  IGQLImageField,
  IGQLLinkField,
  IGQLRichTextField,
  IGQLTextField,
} from '@/lib/component-props';

export interface StatisticFields {
  id: string;
  statValue: IGQLTextField;
  statHeading: IGQLTextField;
  statBody: IGQLTextField;
}

export interface StatsDatasourceFields {
  data: {
    datasource: {
      children: {
        results: StatisticFields[];
      };
      heading: IGQLTextField;
      tagLine: IGQLTextField;
      body: IGQLRichTextField;
      image1: IGQLImageField;
      image2: IGQLImageField;
      link1: IGQLLinkField;
      link2: IGQLLinkField;
    };
  };
}

export type StatsProps = {
  params: { [key: string]: string };
  fields: StatsDatasourceFields;
};

export type StatBoxProps = {
  stat: StatisticFields;
  type: 'simple' | 'bordered' | 'boxed' | 'boxedSimple';
  isSmall?: boolean;
  className?: string;
};

export type StatSectionButtonsProps = {
  link1: IGQLLinkField;
  link2: IGQLLinkField;
};
