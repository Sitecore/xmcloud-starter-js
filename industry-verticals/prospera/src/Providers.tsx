'use client';
import React from 'react';
import { Page, SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { ParallaxProvider } from 'react-scroll-parallax';
import scConfig from 'sitecore.config';
import components from '.sitecore/component-map.client';
import { SiteTheme } from 'components/utilities/SiteTheme';

export default function Providers({ children, page }: { children: React.ReactNode; page: Page }) {
  return (
    <SitecoreProvider
      api={scConfig.api}
      componentMap={components}
      page={page}
      loadImportMap={() => import('.sitecore/import-map.client')}
    >
      <ParallaxProvider>
        <SiteTheme siteName={page.siteName} />
        {children}
      </ParallaxProvider>
    </SitecoreProvider>
  );
}
