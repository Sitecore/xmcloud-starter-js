'use client';
import { useEffect } from 'react';
import { LayoutServiceData, HTMLLink } from '@sitecore-content-sdk/nextjs';
import client from 'src/lib/sitecore-client';

/**
 * Component to render `<link>` elements for Sitecore styles
 * Loads CSS asynchronously to prevent render blocking using the media="print" technique
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
  
  // Filter stylesheet links
  const stylesheetLinks = headLinks.filter(({ rel }: HTMLLink) => rel === 'stylesheet');

  useEffect(() => {
    // Load CSS asynchronously to prevent render blocking
    stylesheetLinks.forEach(({ href }: HTMLLink) => {
      // Check if link already exists to avoid duplicates
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) {
        return;
      }

      // Use media="print" trick for async CSS loading
      // This loads CSS without blocking render, then switches to 'all' after load
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      
      // Switch to 'all' after load to apply styles
      const onLoad = () => {
        link.media = 'all';
      };
      
      // Modern browsers support onload for link elements
      if ('onload' in link) {
        link.onload = onLoad;
      } else {
        // Fallback for older browsers: use setTimeout
        setTimeout(onLoad, 0);
      }
      
      document.head.appendChild(link);
    });
    // headLinks is stable enough - duplicate check prevents issues if it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headLinks]);

  if (headLinks.length === 0) {
    return null;
  }

  // Render non-stylesheet links normally (preconnect, etc. don't block render)
  // Stylesheet links are loaded asynchronously via useEffect above
  const nonStylesheetLinks = headLinks.filter(({ rel }: HTMLLink) => rel !== 'stylesheet');
  
  if (nonStylesheetLinks.length === 0) {
    return null;
  }

  return (
    <>
      {nonStylesheetLinks.map(({ rel, href }: HTMLLink) => (
        <link rel={rel} key={href} href={href} />
      ))}
    </>
  );
};

export default SitecoreStyles;
