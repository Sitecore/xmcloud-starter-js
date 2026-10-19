export const ALL_FILTER = 'All';

export type CareerFilterValues = {
  positionType: string;
  jobCategory: string;
  state: string;
  education: string;
};

export const emptyFilters = (): CareerFilterValues => ({
  positionType: ALL_FILTER,
  jobCategory: ALL_FILTER,
  state: ALL_FILTER,
  education: ALL_FILTER,
});

export const uniqueOptions = (values: string[]): string[] => {
  const seen = new Set<string>();
  values.forEach((value) => {
    const trimmed = value.trim();
    if (trimmed) seen.add(trimmed);
  });
  return [ALL_FILTER, ...Array.from(seen).sort((a, b) => a.localeCompare(b))];
};

export const matchesFilters = (
  job: { positionType: string; jobCategory: string; state: string; education: string },
  filters: CareerFilterValues
): boolean =>
  (filters.positionType === ALL_FILTER || job.positionType === filters.positionType) &&
  (filters.jobCategory === ALL_FILTER || job.jobCategory === filters.jobCategory) &&
  (filters.state === ALL_FILTER || job.state === filters.state) &&
  (filters.education === ALL_FILTER || job.education === filters.education);

export type CareerJobFields = {
  data?: {
    datasource?: {
      parent?: {
        parent?: {
          children?: {
            results?: unknown[];
          };
        };
      };
    };
    jobs?: {
      results?: unknown[];
    };
  };
  datasource?: {
    parent?: {
      parent?: {
        children?: {
          results?: unknown[];
        };
      };
    };
  };
};

export const careerJobsFromFields = (fields?: CareerJobFields): unknown[] =>
  fields?.data?.jobs?.results ??
  fields?.data?.datasource?.parent?.parent?.children?.results ??
  fields?.datasource?.parent?.parent?.children?.results ??
  [];

export const hasCareerDatasource = (fields?: CareerJobFields, dataSource?: string): boolean =>
  Boolean(fields?.data?.datasource || fields?.datasource || dataSource?.trim());

export const toCareerHref = (path?: string): string => {
  let href = (path || '').trim();
  const contentHome = '/sitecore/content/asha/asha/home';
  if (href.toLowerCase().startsWith(contentHome)) {
    href = href.slice(contentHome.length);
  }
  if (!href.startsWith('/')) href = `/${href}`;
  return href.replace(/\/{2,}/g, '/') || '/';
};
