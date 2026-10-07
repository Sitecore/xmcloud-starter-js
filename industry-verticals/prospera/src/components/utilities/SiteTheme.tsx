'use client';

import { useEffect, JSX } from 'react';
import { getSiteThemeClass } from 'lib/site-theme';

export function SiteTheme({ siteName }: { siteName: string | undefined }): JSX.Element | null {
  useEffect(() => {
    const themeClass = getSiteThemeClass(siteName);

    document.body.classList.add(themeClass);

    return () => {
      document.body.classList.remove(themeClass);
    };
  }, [siteName]);

  return null;
}
