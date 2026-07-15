'use client';

import { JSX } from 'react';
import { Text, RichText, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ContentBlockProps } from './content-block.props';

/**
 * A simple Content Block component, with a heading and rich text block.
 * This is the most basic building block of a content site, and the most basic
 * Content SDK component that's useful.
 */
const ContentBlock = ({ fields }: ContentBlockProps): JSX.Element => (
  <section className="contentBlock">
    <Text tag="h2" className="contentTitle" field={fields?.heading} />

    <RichText className="contentDescription" field={fields?.content} />
  </section>
);

export default withDatasourceCheck()<ContentBlockProps>(ContentBlock);
