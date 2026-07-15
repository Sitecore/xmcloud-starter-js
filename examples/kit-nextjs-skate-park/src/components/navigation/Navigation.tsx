'use client';
import React, { useState, JSX } from 'react';
import { LinkField, Text, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getFieldValue } from 'lib/component-props';
import { NavigationFields as Fields, NavigationListItemProps, NavigationProps } from './navigation.props';

const getTextContent = (fields?: Fields): JSX.Element | string => {
  if (!fields) {
    return '';
  }

  const navigationTitle = getFieldValue(fields.NavigationTitle);
  const title = getFieldValue(fields.Title);

  if (navigationTitle) return <Text field={navigationTitle} />;
  if (title) return <Text field={title} />;
  return fields.DisplayName;
};

const getLinkField = (fields?: Fields): LinkField => ({
  value: {
    href: fields?.Href ?? '',
    title:
      getFieldValue(fields?.NavigationTitle)?.value?.toString() ??
      getFieldValue(fields?.Title)?.value?.toString() ??
      fields?.DisplayName,
    querystring: fields?.Querystring ?? '',
  },
});

const NavigationListItem: React.FC<NavigationListItemProps> = ({
  fields,
  handleClick,
  relativeLevel,
}) => {
  if (!fields) {
    return null;
  }

  const [isActive, setIsActive] = useState(false);
  const { page } = useSitecore();

  const classNames = [...fields.Styles, `rel-level${relativeLevel}`, isActive ? 'active' : ''].join(
    ' '
  );

  const hasChildren = fields.Children?.length > 0;
  const children = hasChildren
    ? fields.Children.map((fields, index) => (
        <NavigationListItem
          key={`${index}-${fields.Id}`}
          fields={fields}
          handleClick={handleClick}
          relativeLevel={relativeLevel + 1}
        />
      ))
    : null;

  return (
    <li className={classNames} key={fields.Id} tabIndex={0}>
      <div
        className={`navigation-title ${hasChildren ? 'child' : ''}`}
        onClick={() => setIsActive(!isActive)}
      >
        <CompatibleLink field={getLinkField(fields)} editable={page.mode.isEditing} onClick={handleClick}>
          {getTextContent(fields)}
        </CompatibleLink>
      </div>
      {hasChildren && <ul className="clearfix">{children}</ul>}
    </li>
  );
};

export const Default = ({ params, fields }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;

  if (!fields || !Object.values(fields).length) {
    return (
      <div className={`component navigation ${styles}`} id={id}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, forceState?: boolean) => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }

    setIsMenuOpen(forceState ?? !isMenuOpen);
  };

  const navigationItems = Object.values(fields)
    .filter(Boolean)
    .map((item: Fields, index) => (
      <NavigationListItem
        key={`${index}-${item.Id}`}
        fields={item}
        handleClick={(event) => handleToggleMenu(event, false)}
        relativeLevel={1}
      />
    ));

  return (
    <div className={`component navigation ${styles}`} id={id}>
      <label className="menu-mobile-navigate-wrapper">
        <input
          type="checkbox"
          className="menu-mobile-navigate"
          checked={isMenuOpen}
          onChange={() => handleToggleMenu()}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        />
        <div className="menu-humburger" />
        <div className="component-content">
          <nav>
            <ul className="clearfix">{navigationItems}</ul>
          </nav>
        </div>
      </label>
    </div>
  );
};
