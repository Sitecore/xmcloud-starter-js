import type { Field, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export type CareerFields = {
  JobTitle?: Field<string>;
  Title?: Field<string>;
  Employer?: Field<string>;
  City?: Field<string>;
  State?: Field<string>;
  Location?: Field<string>;
  Salary?: Field<string>;
  PositionType?: Field<string>;
  JobCategory?: Field<string>;
  Education?: Field<string>;
  Schedule?: Field<string>;
  PostedDate?: Field<string>;
  Phone?: Field<string>;
  Email?: Field<string>;
  Spotlight?: Field<boolean>;
  Opportunity?: RichTextField;
  ClinicalScope?: RichTextField;
  HowWePractice?: RichTextField;
  Qualifications?: RichTextField;
  Compensation?: RichTextField;
  HowToApply?: RichTextField;
  ApplyLink?: LinkField;
};

export type CareerComponentProps = ComponentProps & {
  fields?: CareerFields;
};
