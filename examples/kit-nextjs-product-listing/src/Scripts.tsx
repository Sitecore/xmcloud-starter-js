'use client';
import { JSX } from 'react';
import { EditingScripts } from '@sitecore-content-sdk/nextjs';
// The BYOC bundle imports external (BYOC) components into the app and makes sure they are ready to be used
// import BYOC from 'src/byoc';
import dynamic from 'next/dynamic';

const CdpPageView = dynamic(() => import('components/content-sdk/CdpPageView'), {
  ssr: false,
});

const Scripts = (): JSX.Element => {
  return (
    <>
      {/* <BYOC /> */}
      {/* <FEAASScripts /> */}
      <CdpPageView />
      <EditingScripts />
    </>
  );
};

export default Scripts;
