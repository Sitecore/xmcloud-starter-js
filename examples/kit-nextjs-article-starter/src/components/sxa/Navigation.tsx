import React, { type JSX } from 'react';
import {
  LinkField,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { NavigationMenuToggle } from './NavigationMenuToggle.client';
import { NavigationList } from './NavigationList.client';
import { NavigationFields, NavigationProps } from './sxa-navigation.props';

const getNavigationText = function (props: { fields?: NavigationFields }): JSX.Element | string {
  const navigationFields = props.fields;
  if (!navigationFields) {
    return '';
  }

  let text: JSX.Element | string;

  if (navigationFields.NavigationTitle) {
    text = <Text field={navigationFields.NavigationTitle} />;
  } else if (navigationFields.Title) {
    text = <Text field={navigationFields.Title} />;
  } else {
    text = navigationFields.DisplayName;
  }

  return text;
};

const getLinkField = (props: { fields?: NavigationFields }): LinkField => ({
  value: {
    href: props.fields?.Href ?? '',
    title: getLinkTitle(props),
    querystring: props.fields?.Querystring ?? '',
  },
});

const getLinkTitle = (props: { fields?: NavigationFields }): string | undefined => {
  const navigationFields = props.fields;
  if (!navigationFields) {
    return undefined;
  }

  let title: string | undefined;
  if (navigationFields.NavigationTitle?.value) {
    title = navigationFields.NavigationTitle.value.toString();
  } else if (navigationFields.Title?.value) {
    title = navigationFields.Title.value.toString();
  } else {
    title = navigationFields.DisplayName;
  }

  return title;
};

/**
 * Server component for Navigation.
 * Pass isEditing as prop from parent when rendering in editing context.
 */
export const Default = (props: NavigationProps): JSX.Element => {
  const { page } = props;

  const styles =
    props.params != null
      ? `${props.params.GridParameters ?? ''} ${props.params.Styles ?? ''}`.trimEnd()
      : '';
  const id = props.params != null ? props.params.RenderingIdentifier : null;

  if (!props.fields || !Object.values(props.fields).length) {
    return (
      <div className={`component navigation ${styles}`} id={id ? id : undefined}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, flag?: boolean): void => {
    props.handleClick(event);
  };

  const list = Object.values(props.fields)
    .filter((element) => element)
    .map((element: NavigationFields, key: number) => (
      <NavigationList
        key={`${key}${element.Id}`}
        fields={element}
        handleClick={(event: React.MouseEvent<HTMLElement>) => handleToggleMenu(event, false)}
        relativeLevel={1}
        isEditing={page.mode.isEditing}
        getLinkField={getLinkField}
        getNavigationText={getNavigationText}
      />
    ));

  return (
    <div className={`component navigation ${styles}`} id={id ? id : undefined}>
      <label className="menu-mobile-navigate-wrapper">
        <NavigationMenuToggle isEditing={page.mode.isEditing} onToggle={handleToggleMenu}>
          <div className="menu-humburger" />
          <div className="component-content">
            <nav>
              <ul className="clearfix">{list}</ul>
            </nav>
          </div>
        </NavigationMenuToggle>
      </label>
    </div>
  );
};
