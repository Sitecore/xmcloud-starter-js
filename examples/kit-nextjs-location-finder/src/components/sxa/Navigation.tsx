import React, { type JSX } from 'react';
import {
  LinkField,
  Text,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { NavigationMenuToggle } from './NavigationMenuToggle.client';
import { NavigationList } from './NavigationList.client';
import { ButtonNavigationClient } from './ButtonNavigation.client';
import type { NavigationFields, NavigationProps } from './navigation.props';

export type { NavigationFields, NavigationProps };

const getNavigationText = function (props: { fields?: NavigationFields }): JSX.Element | string {
  const navigationFields = props.fields;
  if (!navigationFields) {
    return '';
  }

  let text;

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

  let title;
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
 * Interactive state (menu toggle, active items) is delegated to client components.
 */
export const Default = (props: NavigationProps): JSX.Element => {
  const { isEditing = false } = props;
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

  const list = Object.values(props.fields ?? {})
    .filter((element) => element)
    .map((element: NavigationFields, key: number) => (
      <NavigationList
        key={`${key}${element.Id}`}
        fields={element}
        handleClick={(event: React.MouseEvent<HTMLElement>) => handleToggleMenu(event, false)}
        relativeLevel={1}
        isEditing={isEditing}
        getLinkField={getLinkField}
        getNavigationText={getNavigationText}
      />
    ));

  return (
    <div className={`component navigation ${styles}`} id={id ? id : undefined}>
      <label className="menu-mobile-navigate-wrapper">
        <NavigationMenuToggle isEditing={isEditing} onToggle={handleToggleMenu}>
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

export const ButtonNavigation = (props: NavigationProps): JSX.Element => {
  const list = Object.values(props.fields ?? {}).filter((element) => element);

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold text-brand-black mb-8 text-center">
          Component Categories
        </h3>
        <ButtonNavigationClient
          list={list}
          getLinkField={getLinkField}
          getNavigationText={getNavigationText}
        />
      </div>
    </section>
  );
};

export const Header = (): JSX.Element => {
  return (
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">Component Library</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-[#71B5F0]">
              Home
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:text-[#71B5F0]">
              Documentation
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-[#71B5F0]">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
