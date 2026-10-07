'use client';

import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';

function formatBreadcrumb(text: string) {
  text = decodeURIComponent(text);
  return text;
}

type contextItem = {
  url: { path: string };
  name: string;
  pageTitle: { value: string };
  displayName: string;
  title: { value: string };
  ancestors: contextItem[];
};

type BreadcrumbProps = ComponentProps & {
  fields: {
    data: {
      item: contextItem;
      ancestors: contextItem[];
    };
  };
};

function getBreadcrumbTitle(propItem: contextItem) {
  let name = propItem.pageTitle?.value;
  if (!name) {
    name = propItem.name;
  }
  if (!name) {
    name = propItem.displayName;
  }
  if (!name) {
    name = propItem.title.value;
  }
  return formatBreadcrumb(name);
}

function getBreadcrumbUrl(propItem: contextItem) {
  return propItem?.url?.path;
}

const Breadcrumb = (props: BreadcrumbProps): JSX.Element => {
  if (props?.fields?.data?.item === null) {
    return <div></div>;
  }

  const propItem = props.fields.data.item;
  const propItemAncestors = props.fields.data.item.ancestors;
  const breadcrumbs = [];

  const sxaStyles = `${props.params?.styles || ''}`;

  const pageItems = {
    title: getBreadcrumbTitle(propItem),
    url: getBreadcrumbUrl(propItem),
    className: 'active',
  };

  breadcrumbs.push(pageItems);

  if (propItemAncestors) {
    propItemAncestors.map((parent) => {
      breadcrumbs.push({
        title: getBreadcrumbTitle(parent),
        url: getBreadcrumbUrl(parent),
        className: 'inactive',
      });
    });
  }

  const breadcrumbListItems = breadcrumbs.reverse().map((bc, index) => (
    <li key={index} className={bc.className}>
      <a title={bc.title} href={bc.url}>
        {bc.title}
      </a>
    </li>
  ));

  return (
    <nav className={`breadcrumb ${sxaStyles}`} aria-label="breadcrumbs">
      <ol className="list">{breadcrumbListItems}</ol>
    </nav>
  );
};

export const Default = Breadcrumb;
