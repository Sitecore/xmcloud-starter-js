'use client';
import { JSX } from 'react';
import { EditingScripts } from '@sitecore-content-sdk/nextjs';
import CdpPageView from 'components/content-sdk/CdpPageView';
import WilliamsLeaInteractions from 'components/content-sdk/WilliamsLeaInteractions';

const Scripts = (): JSX.Element => {
  return (
    <>
      <CdpPageView />
      <EditingScripts />
      <WilliamsLeaInteractions />
    </>
  );
};

export default Scripts;