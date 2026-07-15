import React, { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import type { ColumnNumber, ColumnSplitterProps } from './column-splitter.props';

export const Default = ({ params, rendering, page, componentMap }: ColumnSplitterProps): JSX.Element => {
  const { EnabledPlaceholders, RenderingIdentifier: id, styles } = params;

  const enabledColumns = EnabledPlaceholders?.split(',') ?? [];

  return (
    <div className={`row component column-splitter ${styles}`} id={id}>
      {enabledColumns.map((columnNum, index) => {
        const num = Number(columnNum) as ColumnNumber;
        const columnWidth = params[`ColumnWidth${num}`] ?? '';
        const columnStyle = params[`Styles${num}`] ?? '';
        const columnClassNames = `${columnWidth} ${columnStyle}`.trim();

        return (
          <div key={index} className={columnClassNames}>
            <div className="row">
              <AppPlaceholder page={page} componentMap={componentMap} name={`column-${columnNum}-{*}`} rendering={rendering} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
