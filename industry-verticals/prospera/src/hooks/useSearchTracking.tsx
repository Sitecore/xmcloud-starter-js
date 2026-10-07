'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  trackEntityPageViewEvent,
  trackPreviewSearchClickEvent,
  trackSearchClickEntityEvent,
} from '@sitecore-search/react';

export type Events =
  | 'PageViewEvent'
  | 'EntityPageView'
  | 'PreviewSearchClickEvent'
  | 'SearchClickEvent'
  | 'PreviewSearchSuggestionClickEvent';

type Args = {
  url: string;
  widgetId: string;
  entityType: string;
  events: Events[];
  entityId: string;
  itemIndex: number;
};

export function useSearchTracking() {
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, args: Args) => {
      const { url, widgetId, entityType, events, entityId, itemIndex } = args;

      e.preventDefault();

      events?.forEach((event) => {
        if (event === 'EntityPageView' && entityType && entityId) {
          trackEntityPageViewEvent(entityType, { items: [{ id: entityId }] });
        }
        if (event === 'PreviewSearchClickEvent') {
          trackPreviewSearchClickEvent(widgetId, entityType, {
            index: itemIndex,
            items: [{ id: entityId }],
          });
        }
        if (event === 'SearchClickEvent') {
          trackSearchClickEntityEvent(widgetId, entityType, {
            actionCause: 'entity',
            index: itemIndex,
            items: [{ id: entityId }],
          });
        }
      });

      router.push(url);
    },
    [router]
  );

  return { handleSearch };
}
