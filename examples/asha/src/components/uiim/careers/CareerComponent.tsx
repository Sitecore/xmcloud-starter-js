import type { JSX } from 'react';
import type { Field, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { Link as ContentSdkLink, RichText as ContentSdkRichText, Text } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { CareerComponentProps, CareerFields } from './career-component.props';

const hasText = (field?: Field<string>): boolean => Boolean(field?.value);
const hasRichText = (field?: RichTextField): boolean => Boolean(field?.value);
const hasLink = (field?: LinkField): boolean => Boolean(field?.value?.href || field?.value?.url);

const facts: { label: string; key: keyof CareerFields }[] = [
  { label: 'Employer', key: 'Employer' },
  { label: 'Location', key: 'Location' },
  { label: 'Salary', key: 'Salary' },
  { label: 'Position type', key: 'PositionType' },
  { label: 'Job category', key: 'JobCategory' },
  { label: 'Education', key: 'Education' },
  { label: 'Schedule', key: 'Schedule' },
  { label: 'Posted', key: 'PostedDate' },
  { label: 'Phone', key: 'Phone' },
  { label: 'Email', key: 'Email' },
];

const sections: { heading: string; key: keyof CareerFields }[] = [
  { heading: 'The opportunity', key: 'Opportunity' },
  { heading: 'Clinical scope', key: 'ClinicalScope' },
  { heading: 'How we practice', key: 'HowWePractice' },
  { heading: 'Qualifications', key: 'Qualifications' },
  { heading: 'Compensation and benefits', key: 'Compensation' },
  { heading: 'To apply', key: 'HowToApply' },
];

const CareerEmpty = (): JSX.Element => (
  <div className="component career">
    <div className="component-content">
      <span className="is-empty-hint">Career has no content. Add a job title and posting fields.</span>
    </div>
  </div>
);

type CareerView = {
  styles?: string;
  RenderingIdentifier?: string;
  isEditing: boolean;
  content?: CareerFields;
  titleField?: Field<string>;
  visibleFacts: { label: string; key: keyof CareerFields }[];
  visibleSections: { heading: string; key: keyof CareerFields }[];
  isEmpty: boolean;
};

const resolveCareer = ({ fields, params, page }: CareerComponentProps): CareerView => {
  const { styles, RenderingIdentifier } = params || {};
  const isEditing = Boolean(page?.mode?.isEditing);
  const routeFields = (page?.layout?.sitecore?.route?.fields || {}) as CareerFields;
  const routeHasCareer = hasText(routeFields.JobTitle) || hasText(routeFields.Employer);
  const content = routeHasCareer ? routeFields : fields;
  const titleField = hasText(content?.JobTitle) || isEditing ? content?.JobTitle : content?.Title;
  const visibleFacts = facts.filter(({ key }) => hasText(content?.[key] as Field<string> | undefined) || isEditing);
  const visibleSections = sections.filter(
    ({ key }) => hasRichText(content?.[key] as RichTextField | undefined) || isEditing
  );

  return {
    styles,
    RenderingIdentifier,
    isEditing,
    content,
    titleField,
    visibleFacts,
    visibleSections,
    isEmpty: !hasText(titleField) && visibleFacts.length === 0 && visibleSections.length === 0 && !isEditing,
  };
};

export const Default = (props: CareerComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier, isEditing, content, titleField, visibleFacts, visibleSections, isEmpty } =
    resolveCareer(props);

  if (isEmpty) {
    return <CareerEmpty />;
  }

  return (
    <article
      className={cn('component career mx-auto max-w-4xl px-4 py-10', styles)}
      id={RenderingIdentifier || undefined}
      data-testid="career-component"
    >
      <div className="component-content">
        {titleField && (hasText(titleField) || isEditing) && (
          <Text tag="h1" field={titleField} className="text-foreground text-3xl font-semibold tracking-tight @md:text-4xl" />
        )}
        {visibleFacts.length > 0 && (
          <dl className="border-border mt-8 grid gap-4 border-y py-6 @md:grid-cols-2">
            {visibleFacts.map(({ label, key }) => (
              <div key={key}>
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</dt>
                <dd className="text-foreground mt-1 text-base">
                  <Text field={content?.[key] as Field<string>} />
                </dd>
              </div>
            ))}
          </dl>
        )}
        {visibleSections.map(({ heading, key }) => (
          <section key={key} className="mt-8">
            <h2 className="text-foreground text-xl font-semibold">{heading}</h2>
            <ContentSdkRichText field={content?.[key] as RichTextField} className="prose mt-3 max-w-none" />
          </section>
        ))}
        {(hasLink(content?.ApplyLink) || isEditing) && content?.ApplyLink && (
          <div className="mt-8">
            <ContentSdkLink field={content.ApplyLink} className="bg-primary text-primary-foreground inline-flex px-5 py-3 text-sm font-medium" />
          </div>
        )}
      </div>
    </article>
  );
};

export const Minimal = (props: CareerComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier, isEditing, content, titleField, visibleFacts, visibleSections, isEmpty } =
    resolveCareer(props);

  if (isEmpty) {
    return <CareerEmpty />;
  }

  return (
    <article
      className={cn('component career career-minimal mx-auto max-w-6xl px-4 py-6', styles)}
      id={RenderingIdentifier || undefined}
      data-testid="career-component-minimal"
    >
      <div className="component-content">
        <div className="flex flex-wrap items-end justify-between gap-3">
          {titleField && (hasText(titleField) || isEditing) && (
            <Text tag="h1" field={titleField} className="text-foreground text-2xl font-semibold tracking-tight" />
          )}
          {(hasLink(content?.ApplyLink) || isEditing) && content?.ApplyLink && (
            <ContentSdkLink
              field={content.ApplyLink}
              className="bg-primary text-primary-foreground inline-flex px-3 py-2 text-sm font-medium"
            />
          )}
        </div>
        {visibleFacts.length > 0 && (
          <dl className="border-border mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-y py-3 @md:grid-cols-4">
            {visibleFacts.map(({ label, key }) => (
              <div key={key} className="flex flex-wrap items-baseline gap-x-2">
                <dt className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">{label}</dt>
                <dd className="text-foreground text-sm">
                  <Text field={content?.[key] as Field<string>} />
                </dd>
              </div>
            ))}
          </dl>
        )}
        {visibleSections.length > 0 && (
          <div className="mt-4 grid gap-x-8 gap-y-4 @md:grid-cols-2">
            {visibleSections.map(({ heading, key }) => (
              <section key={key}>
                <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">{heading}</h2>
                <ContentSdkRichText
                  field={content?.[key] as RichTextField}
                  className="prose prose-sm mt-1 max-w-none"
                />
              </section>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
