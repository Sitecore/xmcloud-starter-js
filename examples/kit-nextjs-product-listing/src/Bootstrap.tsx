import { useEffect, type JSX } from 'react';
import {
  LayoutServicePageState,
  SitecorePageProps,
  RenderingType,
} from '@sitecore-content-sdk/nextjs';

/**
 * The Bootstrap component is the entry point for performing any initialization logic
 * that needs to happen early in the application's lifecycle.
 */
const Bootstrap = (props: SitecorePageProps): JSX.Element | null => {
  // Browser ClientSDK init allows for page view events to be tracked
  useEffect(() => {
    const pageState = props.layout?.sitecore?.context.pageState;
    const renderingType = props.layout?.sitecore?.context.renderingType;
    if (process.env.NODE_ENV === 'development')
      console.debug('Browser Events SDK is not initialized in development environment');
    else if (
      pageState !== LayoutServicePageState.Normal ||
      renderingType === RenderingType.Component
    )
      console.debug('Browser Events SDK is not initialized in edit and preview modes');
    else {
      console.info('Browser Events SDK is disabled');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.site?.name]);

  return null;
};

export default Bootstrap;
