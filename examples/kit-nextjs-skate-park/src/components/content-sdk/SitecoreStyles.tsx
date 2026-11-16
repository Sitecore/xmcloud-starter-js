'use client';
import { Fragment } from 'react';
import { LayoutServiceData, HTMLLink } from '@sitecore-content-sdk/nextjs';
import client from 'src/lib/sitecore-client';

/**
 * Promotes a preload link to a stylesheet as soon as the element is mounted.
 * A cached file can finish loading before React attaches onLoad, and React does not
 * replay that event. Switching rel here reuses the preloaded file.
 */
const promotePreloadedStylesheet = (link: HTMLLinkElement | null): void => {
  if (!link || link.rel === 'stylesheet') {
    return;
  }

  link.rel = 'stylesheet';
};

/**
 * Renders Sitecore style links in a non-render-blocking way.
 * Stylesheet links use rel="preload" in server HTML, then become stylesheets on mount.
 * Other links render as-is.
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
                ref={promotePreloadedStylesheet}
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
