'use client';

import { Text, RichText, Field, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import type { ContentBlockProps } from './content-block.props';
import { JSX } from 'react';

/**
 * A simple Content Block component, with a heading and rich text block.
 * This is the most basic building block of a content site, and the most basic
 * Content SDK component that's useful.
 */
const ContentBlock = ({ fields }: ContentBlockProps): JSX.Element => (
  <div className="contentBlock">
    <Text tag="h2" className="contentTitle" field={fields?.heading} />

    <RichText className="contentDescription" field={fields?.content} />
  </div>
);

export default withDatasourceCheck()<ContentBlockProps>(ContentBlock);
