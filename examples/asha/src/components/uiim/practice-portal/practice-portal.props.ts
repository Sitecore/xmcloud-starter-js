import type { Field, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export type PracticePortalFields = {
  Title?: Field<string>;
  pageTitle?: Field<string>;
  TopicsLink?: LinkField;
  Overview?: RichTextField;
  KeyIssues?: RichTextField;
  Resources?: RichTextField;
  References?: RichTextField;
  AboutThisContent?: RichTextField;
};

export type PracticePortalSectionKey = 'Overview' | 'KeyIssues' | 'Resources' | 'References' | 'AboutThisContent';

export type PracticePortalComponentProps = ComponentProps & {
  fields?: PracticePortalFields;
};
