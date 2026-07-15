import React, { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import type { RowNumber, RowSplitterProps } from './row-splitter.props';

export const Default = ({ params, rendering, page, componentMap }: RowSplitterProps): JSX.Element => {
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
                <AppPlaceholder page={page} componentMap={componentMap} name={placeholderKey} rendering={rendering} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
