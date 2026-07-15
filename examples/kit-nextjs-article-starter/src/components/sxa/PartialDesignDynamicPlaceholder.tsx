import React, { JSX } from 'react';
import {
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import componentMap from '.sitecore/component-map';
import { DynamicPlaceholderProps } from './sxa-partial-design.props';

const PartialDesignDynamicPlaceholder = (
  props: DynamicPlaceholderProps,
): JSX.Element => (
  <AppPlaceholder
    name={props.rendering?.params?.sig || ''}
    rendering={props.rendering}
    page={props.page}
    componentMap={componentMap}
  />
);

export default PartialDesignDynamicPlaceholder;
