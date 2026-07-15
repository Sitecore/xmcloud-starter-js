'use client';

import { Text, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import React, { JSX } from 'react';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { TitleProps } from './sxa-title.props';

export const Default = (props: TitleProps): JSX.Element => {
  const { page } = useSitecore();
  const datasource = getDatasource(props.fields);
  const datasourceField: TextField = getFieldValue(datasource?.field) as TextField;
  const contextField: TextField = page.layout.sitecore.route?.fields?.pageTitle as TextField;
  const titleField: TextField = datasourceField || contextField;

  const isPageEditing = Boolean(page.mode.isEditing);
  const modifyTitleProps = {
    ...titleField,
    value: titleField?.value || 'Add Title',
  };

  if (!page.mode.isNormal) {
    return (
      <div
        className={`component title ${props.params.styles}`}
        id={props.params.RenderingIdentifier}
      >
        <div className="component-content">
          <Text
            tag={props.params.tag}
            field={modifyTitleProps}
            editable={isPageEditing}
            className="field-title"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`component title ${props.params.styles}`} id={props.params.RenderingIdentifier}>
      <div className="component-content">
        {page.mode.isEditing ? (
          <Text
            tag={props.params.tag}
            field={modifyTitleProps}
            editable={isPageEditing}
            className="field-title"
          />
        ) : (
          <Text tag={props.params.tag} field={titleField} className="field-title" />
        )}
      </div>
    </div>
  );
};
