'use client';
import { useCallback } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { event } from '@sitecore-content-sdk/events';

/**
 * This hook is used to send events to SitecoreCloud.
 */
export const useEvent = ({ query, uid }: { query: string; uid?: string }) => {
  const { page } = useSitecore();
  const { isEditing, isPreview } = page.mode;
  const { route } = page?.layout?.sitecore;

  const sendEvent = useCallback(
    (type: 'clicked' | 'viewed') => {
      if (process.env.NODE_ENV === 'development' || isEditing || isPreview) return;

      event({
        type: 'search',
        siteId: page.siteName,
        channel: 'web',
        name: route?.name,
        language: route?.itemLanguage,
        core: {
          componentId: uid ?? '',
          interactionType: type,
          keyword: query ?? '',
          nullResults: false,
        },
      });
    },
    [route, page, uid, query, isEditing, isPreview]
  );

  return sendEvent;
};
