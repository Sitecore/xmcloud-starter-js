import type { JSX } from 'react';

interface ComponentName {
  componentName: string;
}

const toWords = (input: string): string[] =>
  input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const toKebabCase = (input: string): string => toWords(input).join('-').toLowerCase();

const toCapitalCase = (input: string): string =>
  toWords(input)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const NoDataFallback = (props: ComponentName): JSX.Element => {
  const { componentName } = props;

  return (
    <div className={`component ${toKebabCase(componentName)}`}>
      <div className="component-content">
        <span className="is-empty-hint">
          {toCapitalCase(componentName)} requires a datasource item assigned. Please assign a
          datasource item to edit the content.
        </span>
      </div>
    </div>
  );
};

export { NoDataFallback };
