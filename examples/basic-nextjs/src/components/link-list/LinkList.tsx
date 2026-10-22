import React from 'react';
import { Text, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource } from 'lib/component-props';
import { LinkListItemProps, LinkListProps } from './link-list.props';

const LinkListItem = ({ index, total, field }: LinkListItemProps) => {
  const classNames = [
    `item${index}`,
    index % 2 === 0 ? 'odd' : 'even',
    index === 0 ? 'first' : '',
    index === total - 1 ? 'last' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classNames}>
      <div className="field-link">
        <CompatibleLink field={field} />
      </div>
    </li>
  );
};

export const Default = ({ params, fields }: LinkListProps) => {
  const datasource = getDatasource(fields);
  const styles = `component link-list ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  const renderContent = () => {
    const results = datasource?.children?.results;

    if (!datasource || !Array.isArray(results)) {
      return <h3>Link List</h3>;
    }

    const links = results
      .filter((element): element is typeof element & { field: { link: LinkField } } =>
        Boolean(element?.field?.link)
      )
      .map((element, index) => (
        <LinkListItem
          key={`${index}-${element.field.link.value?.href ?? index}`}
          index={index}
          total={results.length}
          field={element.field.link}
        />
      ));

    return (
      <>
        <Text tag="h3" field={datasource.field?.title} />
        <ul>{links}</ul>
      </>
    );
  };

  return (
    <aside className={styles} id={id}>
      <div className="component-content">{renderContent()}</div>
    </aside>
  );
};
