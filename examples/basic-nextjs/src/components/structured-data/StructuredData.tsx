import { JSX } from 'react';
import { toJsonLdString } from 'src/lib/structured-data/jsonld';
import { StructuredDataProps } from './structured-data.props';

export default function StructuredData({ id, data }: StructuredDataProps): JSX.Element {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLdString(data) }}
    />
  );
}

