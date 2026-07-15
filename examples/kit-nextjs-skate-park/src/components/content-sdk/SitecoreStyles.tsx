'use client';
import { Fragment } from 'react';
import { LayoutServiceData, HTMLLink } from '@sitecore-content-sdk/nextjs';
import client from 'src/lib/sitecore-client';

/**
 * Converts a preload link to a stylesheet once loaded so it does not block initial render.
 * Reduces LCP by moving Sitecore edge styles (e.g. content-styles.css) off the critical path.
 */
const applyStylesheetOnLoad = (link: HTMLLinkElement): void => {
  link.onload = null;
  link.rel = 'stylesheet';
};

/**
 * Renders Sitecore style links in a non-render-blocking way.
 * Stylesheet links use rel="preload" + onload to apply after load; other links render as-is.
 */
const SitecoreStyles = ({
  layoutData,
  enableStyles,
  enableThemes,
}: {
  layoutData: LayoutServiceData;
  enableStyles?: boolean;
  enableThemes?: boolean;
}) => {
  const headLinks = client.getHeadLinks(layoutData, { enableStyles, enableThemes });

  if (headLinks.length === 0) {
    return null;
  }

  return (
    <>
      {headLinks.map(({ rel, href }: HTMLLink) => {
        const isStylesheet = rel === 'stylesheet';
        if (isStylesheet) {
          return (
            <Fragment key={href}>
              <link
                rel="preload"
                href={href}
                as="style"
                onLoad={(e) => applyStylesheetOnLoad(e.currentTarget)}
              />
              <noscript>
                <link rel="stylesheet" href={href} />
              </noscript>
            </Fragment>
          );
        }
        return <link rel={rel} key={href} href={href} />;
      })}
    </>
  );
};

export default SitecoreStyles;
