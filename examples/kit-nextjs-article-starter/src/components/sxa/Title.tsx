import { Text, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import React, { JSX } from 'react';

interface Fields {
  data: {
    datasource: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
    contextItem: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
  };
}

type TitleProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: TitleProps): JSX.Element => {
  const { pageContext } = useSitecore();
  const datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
  const text: TextField = datasource?.field?.jsonValue || {};
  const isPageEditing = Boolean(pageContext?.pageEditing);
  const modifyTitleProps = {
    ...text,
    value: text?.value || 'Add Title',
  };

  if (pageContext?.pageState !== 'normal') {
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
        {pageContext?.pageEditing ? (
          <Text
            tag={props.params.tag}
            field={modifyTitleProps}
            editable={isPageEditing}
            className="field-title"
          />
        ) : (
          <Text tag={props.params.tag} field={text} className="field-title" />
        )}
      </div>
    </div>
  );
};
