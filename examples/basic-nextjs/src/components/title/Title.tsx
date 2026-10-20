import React, { JSX } from 'react';
import { LinkField, Text, TextField } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { TitleComponentContentProps, TitleProps } from './title.props';

const ComponentContent = ({ id, styles = '', children }: TitleComponentContentProps): JSX.Element => (
  <div className={`component title ${styles.trim()}`} id={id}>
    <div className="component-content">
      <div className="field-title">{children}</div>
    </div>
  </div>
);

export const Default = ({ params, fields, page }: TitleProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = params;
  const datasource = getDatasource(fields);
  const datasourceField = getFieldValue(datasource?.field) as TextField | undefined;
  const contextField: TextField = page?.layout?.sitecore?.route?.fields?.Title as TextField;
  const titleField: TextField = datasourceField || contextField;

  const link: LinkField = {
    value: {
      href: datasource?.url?.path,
      title:
        (titleField?.value ? String(titleField.value) : undefined) ||
        datasourceField?.value?.toString(),
    },
  };

  return (
    <ComponentContent styles={styles} id={id}>
      {page?.mode?.isEditing ? (
        <Text field={titleField} />
      ) : (
        <CompatibleLink field={link}>
          <Text field={titleField} />
        </CompatibleLink>
      )}
    </ComponentContent>
  );
};
