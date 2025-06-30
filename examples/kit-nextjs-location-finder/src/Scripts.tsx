import { EditingScripts } from '@sitecore-content-sdk/nextjs';
// The BYOC bundle imports external (BYOC) components into the app and makes sure they are ready to be used
import BYOC from 'src/byoc';
import FEAASScripts from 'components/sxa/FEAASScripts';
import CdpPageView from 'components/sxa/CdpPageView';
import { JSX } from 'react';

const Scripts = (): JSX.Element => {
  return (
    <>
      <BYOC />
      <FEAASScripts />
      <CdpPageView />
      <EditingScripts />
    </>
  );
};

export default Scripts;
