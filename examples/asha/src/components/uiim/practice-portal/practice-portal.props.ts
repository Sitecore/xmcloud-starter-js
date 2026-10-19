import type { Field, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export type PracticePortalTaxonomyKey =
  | 'Access'
  | 'Audience'
  | 'Career stage'
  | 'Content type'
  | 'Content Types'
  | 'Event Types'
  | 'Review cadence'
  | 'Specialty'
  | 'Topic'
  | 'Topics';

export type PracticePortalTaxonomyTerm = {
  id?: string;
  name?: string;
  displayName?: string;
  fields?: {
    titleRequired?: { value?: string };
  };
  jsonValue?: PracticePortalTaxonomyTerm;
  targetItems?: PracticePortalTaxonomyTerm[];
};

export type PracticePortalTaxonomyField =
  | PracticePortalTaxonomyTerm[]
  | PracticePortalTaxonomyTerm
  | Field<string>
  | string
  | null;

export type PracticePortalFields = {
  Title?: Field<string>;
  pageTitle?: Field<string>;
  TopicsLink?: LinkField;
  Overview?: RichTextField;
  KeyIssues?: RichTextField;
  Resources?: RichTextField;
  References?: RichTextField;
  AboutThisContent?: RichTextField;
  Access?: PracticePortalTaxonomyField;
  Audience?: PracticePortalTaxonomyField;
  'Career stage'?: PracticePortalTaxonomyField;
  'Content type'?: PracticePortalTaxonomyField;
  'Content Types'?: PracticePortalTaxonomyField;
  'Event Types'?: PracticePortalTaxonomyField;
  'Review cadence'?: PracticePortalTaxonomyField;
  Specialty?: PracticePortalTaxonomyField;
  Topic?: PracticePortalTaxonomyField;
  Topics?: PracticePortalTaxonomyField;
};

const GUID_PATTERN = /^\{?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}?$/i;

const readableName = (value?: string | null): string => {
  const trimmed = value?.replace(/\s+/g, ' ').trim() ?? '';
  if (!trimmed || GUID_PATTERN.test(trimmed)) {
    return '';
  }

  return trimmed;
};

const nameFromTerm = (term: PracticePortalTaxonomyTerm): string => {
  const source = term.jsonValue ?? term;
  return (
    readableName(source.displayName) ||
    readableName(source.fields?.titleRequired?.value) ||
    readableName(source.name)
  );
};

const namesFromList = (value: unknown[]): string[] => {
  const names = value
    .map((item) => {
      if (typeof item === 'string') {
        return readableName(item);
      }

      if (item && typeof item === 'object') {
        return nameFromTerm(item as PracticePortalTaxonomyTerm);
      }

      return '';
    })
    .filter(Boolean);

  return [...new Set(names)];
};

export const readTaxonomyTerms = (field: unknown, depth = 0): string[] => {
  if (!field || depth > 4) {
    return [];
  }

  if (Array.isArray(field)) {
    return namesFromList(field);
  }

  if (typeof field === 'string') {
    return [...new Set(field.split('|').map((part) => readableName(part)).filter(Boolean))];
  }

  if (typeof field === 'object') {
    const record = field as PracticePortalTaxonomyTerm & { value?: unknown };
    if (Array.isArray(record.targetItems) && record.targetItems.length > 0) {
      return namesFromList(record.targetItems);
    }

    const named = nameFromTerm(record);
    if (named && !record.value && !record.jsonValue) {
      return [named];
    }

    if (record.jsonValue !== undefined) {
      const fromJson = readTaxonomyTerms(record.jsonValue, depth + 1);
      if (fromJson.length > 0) {
        return fromJson;
      }
    }

    if (record.value !== undefined) {
      return readTaxonomyTerms(record.value, depth + 1);
    }

    if (named) {
      return [named];
    }
  }

  return [];
};

export type PracticePortalSectionKey = 'Overview' | 'KeyIssues' | 'Resources' | 'References' | 'AboutThisContent';

export type PracticePortalComponentProps = ComponentProps & {
  fields?: PracticePortalFields;
};
