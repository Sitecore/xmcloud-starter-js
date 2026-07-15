'use client';

import { useState } from 'react';
import { LinkField } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from '@/components/content-sdk/CompatibleLink';
import type { JSX } from 'react';

import type { NavigationFields } from './navigation.props';

type NavigationListProps = {
  fields?: NavigationFields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
  isEditing: boolean;
  getLinkField: (props: { fields?: NavigationFields }) => LinkField;
  getNavigationText: (props: { fields?: NavigationFields }) => JSX.Element | string;
};

/**
 * Client component for navigation list items with interactive active/collapsed state.
 */
export const NavigationList = ({
  fields,
  handleClick,
  relativeLevel,
  isEditing,
  getLinkField,
  getNavigationText,
}: NavigationListProps) => {
  if (!fields) {
    return null;
  }

  const [active, setActive] = useState(false);
  const classNameList = `${fields.Styles.concat('rel-level' + relativeLevel).join(' ')}`;

  let children: JSX.Element[] = [];
  if (fields.Children && fields.Children.length) {
    children = fields.Children.map((element: NavigationFields, index: number) => (
      <NavigationList
        key={`${index}${element.Id}`}
        fields={element}
        handleClick={handleClick}
        relativeLevel={relativeLevel + 1}
        isEditing={isEditing}
        getLinkField={getLinkField}
        getNavigationText={getNavigationText}
      />
    ));
  }

  return (
    <li className={`${classNameList} ${active ? 'active' : ''}`} key={fields.Id} tabIndex={0}>
      <div
        className={`navigation-title ${children.length ? 'child' : ''}`}
        onClick={() => setActive(() => !active)}
      >
        <CompatibleLink
          field={getLinkField({ fields })}
          editable={isEditing}
          onClick={handleClick}
          prefetch={false}
        >
          {getNavigationText({ fields })}
        </CompatibleLink>
      </div>
      {children.length > 0 ? <ul className="clearfix">{children}</ul> : null}
    </li>
  );
};
