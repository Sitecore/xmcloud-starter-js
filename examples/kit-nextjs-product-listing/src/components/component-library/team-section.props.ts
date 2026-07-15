import type { LinkField } from '@sitecore-content-sdk/nextjs';
import type { ReactNode } from 'react';
import type {
  IGQLImageField,
  IGQLLinkField,
  IGQLRichTextField,
  IGQLTextField,
} from '@/lib/component-props';

export interface TeamMemberFields {
  id: string;
  image: IGQLImageField;
  fullName: IGQLTextField;
  jobTitle: IGQLTextField;
  description: IGQLRichTextField;
  facebook: IGQLLinkField;
  instagram: IGQLLinkField;
  linkedIn: IGQLLinkField;
  twitterX: IGQLLinkField;
}

export interface TeamSectionDatasourceFields {
  data: {
    datasource: {
      children: {
        results: TeamMemberFields[];
      };
      tagLine: IGQLTextField;
      heading: IGQLTextField;
      text: IGQLRichTextField;
      heading2: IGQLTextField;
      text2: IGQLRichTextField;
      link: IGQLLinkField;
    };
  };
}

export type TeamSectionProps = {
  params: { [key: string]: string };
  fields: TeamSectionDatasourceFields;
};

export type TeamMemberImageProps = {
  image: IGQLImageField;
  type: 'circle' | 'square' | 'rectangle';
  className?: string;
};

export type TeamMemberStyleProps = {
  type: 'simple' | 'horizontal';
  imageType: TeamMemberImageProps['type'];
  centered?: boolean;
};

export type TeamMemberCardProps = TeamMemberStyleProps & {
  tm: TeamMemberFields;
};

export type TeamSectionTemplateVerticalProps = TeamSectionProps & {
  teamMemberProps: TeamMemberStyleProps;
  columns: 1 | 2 | 3 | 4;
  centered?: boolean;
  children?: ReactNode;
};

export type TeamSectionTemplateHorizontalProps = TeamSectionProps & {
  teamMemberProps: TeamMemberStyleProps;
  columns: 1 | 2;
};

export type SocialLink = {
  icon: ReactNode;
  field: LinkField;
  label: string;
};
