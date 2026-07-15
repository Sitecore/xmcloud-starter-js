import React, { JSX } from 'react';
import { Link as ContentSdkLink, Text } from '@sitecore-content-sdk/nextjs';
import { getDescriptiveLinkText } from '@/utils/link-text';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { LinkListProps, LinkListItemProps, ResultsFieldLink } from './sxa-link-list.props';

const LinkListItem = (props: LinkListItemProps) => {
  let className = `item${props.index}`;
  className += (props.index + 1) % 2 == 0 ? ' even' : ' odd';
  if (props.index == 0) {
    className += ' first';
  }
  if (props.index + 1 == props.total) {
    className += ' last';
  }

  // Generate descriptive link text for SEO
  const displayText = getDescriptiveLinkText(props.field);
  const enhancedField = displayText && displayText !== props.field?.value?.text
    ? {
        ...props.field,
        value: {
          ...props.field?.value,
          text: displayText,
        },
      }
    : props.field;

  return (
    <li className={className}>
      <div className="field-link">
        <ContentSdkLink field={enhancedField} />
      </div>
    </li>
  );
};

export const Default = (props: LinkListProps): JSX.Element => {
  const datasource = getDatasource(props.fields);
  const styles = `component link-list ${props.params.styles}`.trimEnd();
  const id = props.params.RenderingIdentifier;

  if (datasource && datasource.children?.results) {
    const list = datasource.children.results
      .filter((element: ResultsFieldLink) => element?.field?.link)
      .map((element: ResultsFieldLink, key: number) => (
        <LinkListItem
          index={key}
          key={`${key}${element.field.link}`}
          total={datasource.children.results.length}
          field={element.field.link}
        />
      ));

    return (
      <div className={styles} id={id ? id : undefined}>
        <div className="component-content">
          <Text tag="h3" field={getFieldValue(datasource?.field?.title)} />
          <ul>{list}</ul>
        </div>
      </div>
    );
  }

  return (
    <div className={styles} id={id ? id : undefined}>
      <div className="component-content">
        <h3>Link List</h3>
      </div>
    </div>
  );
};
