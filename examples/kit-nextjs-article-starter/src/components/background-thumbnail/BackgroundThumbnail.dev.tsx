/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { Badge } from '@/components/ui/badge';
export type BackgroundThumbailProps = { children: React.ReactElement<any> };
import { cn } from '@/lib/utils';

export const Default: React.FC<BackgroundThumbailProps> = (props) => {
  const { children } = props;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  return isPageEditing ? (
    <div
      className={cn(
        'bg-primary absolute bottom-4 right-4 rounded-md opacity-50 ring-4 ring-offset-2 hover:opacity-100'
      )}
    >
      <Badge className="nowrap hover:bg-primary absolute bottom-4 left-2/4 -translate-x-2/4 whitespace-nowrap">
        Update Background
      </Badge>
      {children}
    </div>
  ) : null;
};
