'use client';

import React, { forwardRef } from 'react';
import NextLink from 'next/link';
import { Link as ContentSdkLink } from '@sitecore-content-sdk/nextjs';

const FILE_EXTENSION_MATCHER = /^\/.*\.\w+$/;

type CompatibleLinkProps = React.ComponentProps<typeof ContentSdkLink> & {
  internalLinkMatcher?: RegExp;
};

export const CompatibleLink = forwardRef<HTMLAnchorElement, CompatibleLinkProps>((props, ref) => {
  const {
    field,
    editable = true,
    children,
    internalLinkMatcher = /^\//,
    showLinkTextWithChildrenPresent,
    ...rest
  } = props;

  if (
    !field ||
    (!(field as { value?: unknown }).value && !(field as { href?: unknown }).href && !field.metadata)
  ) {
    return null;
  }

  const value = ('href' in field
    ? field
    : (field as { value?: Record<string, unknown> }).value) as Record<string, unknown> | undefined;
  const { href, querystring, anchor } = value || {};
  const isEditing = editable && !!field.metadata;

  if (typeof href === 'string' && href && !isEditing) {
    const displayText = typeof value?.text === 'string' ? value.text : href;
    const text = showLinkTextWithChildrenPresent || !children ? displayText : null;
    const isMatching = internalLinkMatcher.test(href);
    const isFileUrl = FILE_EXTENSION_MATCHER.test(href);
    const normalizedQuery =
      typeof querystring === 'string' && querystring
        ? querystring.startsWith('?')
          ? querystring
          : `?${querystring}`
        : '';
    const normalizedHash =
      typeof anchor === 'string' && anchor
        ? anchor.startsWith('#')
          ? anchor
          : `#${anchor}`
        : '';
    const nextHref = `${href}${normalizedQuery}${normalizedHash}`;

    if (isMatching && !isFileUrl) {
      return (
        <NextLink
          href={nextHref}
          key="link"
          title={typeof value?.title === 'string' ? value.title : undefined}
          target={typeof value?.target === 'string' ? value.target : undefined}
          className={
            typeof value?.class === 'string'
              ? value.class
              : typeof value?.className === 'string'
                ? value.className
                : undefined
          }
          ref={ref}
          {...rest}
        >
          {text}
          {children}
        </NextLink>
      );
    }
  }

  return <ContentSdkLink {...props} ref={ref} />;
});

CompatibleLink.displayName = 'CompatibleLink';
