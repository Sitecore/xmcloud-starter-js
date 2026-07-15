import { JSX } from 'react';
import { JsonLdValue, toJsonLdString } from '@/lib/structured-data/jsonld';

type StructuredDataProps = {
  /**
   * A stable id prevents duplicate JSON-LD nodes when the same component
   * can be rendered multiple times (e.g. editing / layout variations).
   */
  id: string;
  data: JsonLdValue;
};

export function StructuredData({ id, data }: StructuredDataProps): JSX.Element {
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return <></>;
  }

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLdString(data) }}
    />
  );
}
