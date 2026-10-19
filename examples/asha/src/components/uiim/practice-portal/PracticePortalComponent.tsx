'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import type { Field, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { Link as ContentSdkLink, RichText as ContentSdkRichText, Text } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type {
  PracticePortalComponentProps,
  PracticePortalFields,
  PracticePortalSectionKey,
} from './practice-portal.props';

const sections: { heading: string; key: PracticePortalSectionKey }[] = [
  { heading: 'Overview', key: 'Overview' },
  { heading: 'Key Issues', key: 'KeyIssues' },
  { heading: 'Resources', key: 'Resources' },
  { heading: 'References', key: 'References' },
  { heading: 'About This Content', key: 'AboutThisContent' },
];

const hasText = (field?: Field<string>): boolean => Boolean(field?.value);
const hasRichText = (field?: RichTextField): boolean => Boolean(field?.value);
const hasLink = (field?: LinkField): boolean => Boolean(field?.value?.href || field?.value?.url);

const hasPortalContent = (fields?: PracticePortalFields): boolean =>
  sections.some(({ key }) => hasRichText(fields?.[key]));

const PracticePortalEmpty = (): JSX.Element => (
  <div className="component practice-portal" data-testid="practice-portal">
    <div className="component-content">
      <span className="is-empty-hint">Practice Portal topic has no content. Add the section fields.</span>
    </div>
  </div>
);

export const Default = ({ fields, params, page }: PracticePortalComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params || {};
  const isEditing = Boolean(page?.mode?.isEditing);
  const routeFields = (page?.layout?.sitecore?.route?.fields || {}) as PracticePortalFields;
  const content = hasPortalContent(routeFields) ? routeFields : fields;
  const titleField = hasText(content?.pageTitle) ? content?.pageTitle : content?.Title;
  const visibleSections = sections.filter(({ key }) => hasRichText(content?.[key]) || isEditing);
  const defaultOpen: PracticePortalSectionKey[] = visibleSections.some(({ key }) => key === 'AboutThisContent')
    ? ['AboutThisContent']
    : visibleSections.slice(0, 1).map(({ key }) => key);
  const [openKeys, setOpenKeys] = useState<PracticePortalSectionKey[]>(defaultOpen);

  if (!hasText(titleField) && visibleSections.length === 0 && !hasLink(content?.TopicsLink) && !isEditing) {
    return <PracticePortalEmpty />;
  }

  const toggle = (key: PracticePortalSectionKey) => {
    setOpenKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  return (
    <section
      className={cn('component practice-portal mx-auto my-8 max-w-5xl px-4', styles)}
      id={RenderingIdentifier}
      data-testid="practice-portal"
    >
      {(hasText(titleField) || isEditing) && (
        <Text field={titleField} tag="h1" className="text-4xl font-medium tracking-tight text-[#6d645b] md:text-5xl" />
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {content?.TopicsLink && (hasLink(content.TopicsLink) || isEditing) && (
          <ContentSdkLink field={content.TopicsLink} className="text-sm text-[#00778b] hover:underline">
            <span aria-hidden="true">◂ </span>
            {content.TopicsLink.value?.text || 'View All Portal Topics'}
          </ContentSdkLink>
        )}
        {visibleSections.length > 0 && (
          <p className="ml-auto text-sm text-[#00778b]">
            <button type="button" className="hover:underline" onClick={() => setOpenKeys(visibleSections.map(({ key }) => key))}>
              Expand All
            </button>
            <span className="px-2 text-[#8a8178]">/</span>
            <button type="button" className="hover:underline" onClick={() => setOpenKeys([])}>
              Collapse All
            </button>
          </p>
        )}
      </div>
      <div className="mt-6 border border-[#e6e1d8]">
        {visibleSections.map(({ heading, key }, index) => {
          const isOpen = isEditing || openKeys.includes(key);
          const panelId = `practice-portal-${key}`;

          return (
            <div key={key} className={cn(index > 0 && 'border-t border-[#e6e1d8]')}>
              <h2>
                <button
                  type="button"
                  className="flex w-full items-center justify-between bg-[#f3f1ec] px-4 py-3 text-left text-lg text-[#00778b]"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(key)}
                >
                  <span>{heading}</span>
                  <span aria-hidden="true" className="text-2xl font-light leading-none">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
              </h2>
              {isOpen && (
                <div id={panelId} className="bg-white px-6 py-5 text-[#5f5a55]">
                  <ContentSdkRichText
                    field={content?.[key]}
                    className="prose prose-sm max-w-none text-[#5c564f] prose-headings:text-[#5c4636] prose-a:text-[#00778b] prose-li:my-1"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
