'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Field, RichTextField } from '@sitecore-content-sdk/nextjs';
import { RichText as ContentSdkRichText, Text } from '@sitecore-content-sdk/nextjs';
import { getFieldValue } from '@/lib/component-props';
import { cn } from '@/lib/utils';
import type { CareerListingJob, CareerListingProps } from './career-listing.props';
import {
  careerJobsFromFields,
  emptyFilters,
  hasCareerDatasource,
  matchesFilters,
  toCareerHref,
  uniqueOptions,
  type CareerFilterValues,
} from './career-listing.util';

const fieldText = (field?: { jsonValue?: { value?: string }; value?: string }): string => {
  const value = getFieldValue(field)?.value ?? field?.value;
  return typeof value === 'string' ? value : '';
};

const isChecked = (field?: { jsonValue?: { value?: boolean | string }; value?: boolean | string }): boolean => {
  const value = getFieldValue(field)?.value ?? field?.value;
  return value === true || value === '1';
};

type JobCard = {
  id: string;
  href: string;
  title: string;
  employer: string;
  location: string;
  salary: string;
  positionType: string;
  jobCategory: string;
  state: string;
  education: string;
  postedDate: string;
};

const toCard = (job: CareerListingJob, index: number): JobCard | undefined => {
  const title = fieldText(job.jobTitle);
  const employer = fieldText(job.employer);
  if (!title && !employer) return undefined;
  return {
    id: job.id || `${title}-${index}`,
    href: toCareerHref(job.url?.path || job.path),
    title: title || job.name || 'Career',
    employer,
    location: fieldText(job.location) || [fieldText(job.city), fieldText(job.state)].filter(Boolean).join(', '),
    salary: fieldText(job.salary),
    positionType: fieldText(job.positionType),
    jobCategory: fieldText(job.jobCategory),
    state: fieldText(job.state),
    education: fieldText(job.education),
    postedDate: fieldText(job.postedDate),
  };
};

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}): JSX.Element => (
  <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
    <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</span>
    <select
      className="border-border bg-background text-foreground h-10 border px-3"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export const Default = ({ fields, params, rendering }: CareerListingProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params || {};
  const datasource = fields?.data?.datasource ?? fields?.datasource;
  const jobs = useMemo(
    () =>
      (careerJobsFromFields(fields) as CareerListingJob[])
        .map(toCard)
        .filter((job): job is JobCard => Boolean(job)),
    [fields]
  );
  const [filters, setFilters] = useState<CareerFilterValues>(emptyFilters);
  const filtered = jobs.filter((job) => matchesFilters(job, filters));
  const showFilters = isChecked(datasource?.showFilters) || !datasource;
  const emptyText = fieldText(datasource?.emptyResultsText as Field<string> | undefined) || 'No jobs match these filters.';
  const setFilter = (key: keyof CareerFilterValues) => (value: string) =>
    setFilters((current) => ({ ...current, [key]: value }));

  if (!hasCareerDatasource(fields, rendering?.dataSource) && jobs.length === 0) {
    return (
      <div className="component career-listing">
        <div className="component-content">
          <span className="is-empty-hint">Career Listing has no datasource. Select a CareerListing item.</span>
        </div>
      </div>
    );
  }

  return (
    <section
      className={cn('component career-listing mx-auto max-w-6xl px-4 py-10', styles)}
      id={RenderingIdentifier || undefined}
      data-testid="career-listing"
    >
      <div className="component-content">
        {datasource?.title && (
          <Text tag="h1" field={getFieldValue(datasource.title)} className="text-foreground text-3xl font-semibold" />
        )}
        {datasource?.intro && (
          <ContentSdkRichText field={getFieldValue(datasource.intro) as RichTextField} className="prose mt-4 max-w-3xl" />
        )}
        {showFilters && (
          <div className="mt-8 flex flex-wrap gap-4">
            <FilterSelect
              label="Position type"
              value={filters.positionType}
              options={uniqueOptions(jobs.map((job) => job.positionType))}
              onChange={setFilter('positionType')}
            />
            <FilterSelect
              label="Job category"
              value={filters.jobCategory}
              options={uniqueOptions(jobs.map((job) => job.jobCategory))}
              onChange={setFilter('jobCategory')}
            />
            <FilterSelect
              label="State"
              value={filters.state}
              options={uniqueOptions(jobs.map((job) => job.state))}
              onChange={setFilter('state')}
            />
            <FilterSelect
              label="Education"
              value={filters.education}
              options={uniqueOptions(jobs.map((job) => job.education))}
              onChange={setFilter('education')}
            />
          </div>
        )}
        <p className="text-muted-foreground mt-6 text-sm">{filtered.length} jobs</p>
        {filtered.length === 0 ? (
          <p className="mt-4">{emptyText}</p>
        ) : (
          <ul className="mt-4 divide-y border-y">
            {filtered.map((job) => (
              <li key={job.id}>
                <Link href={job.href} className="hover:bg-muted block px-2 py-5">
                  <span className="text-foreground block text-lg font-semibold">{job.title}</span>
                  <span className="text-muted-foreground mt-1 block text-sm">
                    {[job.employer, job.location, job.salary, job.positionType].filter(Boolean).join(' · ')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
