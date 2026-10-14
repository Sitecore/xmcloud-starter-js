import { JSX } from 'react';
import { JsonLdValue, toJsonLdString } from '@/lib/structured-data/jsonld';

type StructuredDataProps = {
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
