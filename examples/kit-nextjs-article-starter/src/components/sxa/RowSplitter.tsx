import React, { JSX } from 'react';
import {
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import componentMap from '.sitecore/component-map';
import { RowSplitterProps, RowNumber } from './sxa-row-splitter.props';

export const Default = ({
  params,
  rendering,
  page,
}: RowSplitterProps): JSX.Element => {
  const enabledPlaceholders = params.EnabledPlaceholders?.split(',') ?? [];
  const id = params.RenderingIdentifier;

  return (
    <div className={`component row-splitter ${params.styles}`} id={id}>
      {enabledPlaceholders.map((ph, index) => {
        const num = Number(ph) as RowNumber;
        const placeholderKey = `row-${num}-{*}`;
        const rowStyles = `${params[`Styles${num}`] ?? ''}`.trimEnd();

        return (
          <div key={index} className={`container-fluid ${rowStyles}`.trimEnd()}>
            <div>
              <div className="row">
                <AppPlaceholder
                  name={placeholderKey}
                  rendering={rendering}
                  page={page}
                  componentMap={componentMap}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
