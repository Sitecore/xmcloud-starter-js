import React, { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import componentMap from '.sitecore/component-map';

const PartialDesignDynamicPlaceholder = (props: ComponentProps): JSX.Element => (
  <AppPlaceholder
    name={props.rendering?.params?.sig || ''}
    rendering={props.rendering}
    page={props.page}
    componentMap={componentMap}
  />
);

export default PartialDesignDynamicPlaceholder;
