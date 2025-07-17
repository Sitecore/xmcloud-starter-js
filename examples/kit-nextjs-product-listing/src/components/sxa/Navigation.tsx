import React, { useState, type JSX } from 'react';
import {
  Link as ContentSdkLink,
  LinkField,
  Text,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Fields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children: Array<Fields>;
  Styles: string[];
}

type NavigationProps = {
  params?: { [key: string]: string };
  fields: Fields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
};

const getNavigationText = function (props: NavigationProps): JSX.Element | string {
  let text;

  if (props.fields.NavigationTitle) {
    text = <Text field={props.fields.NavigationTitle} />;
  } else if (props.fields.Title) {
    text = <Text field={props.fields.Title} />;
  } else {
    text = props.fields.DisplayName;
  }

  return text;
};

const getLinkField = (props: NavigationProps): LinkField => ({
  value: {
    href: props.fields.Href,
    title: getLinkTitle(props),
    querystring: props.fields.Querystring,
  },
});

export const Default = (props: NavigationProps): JSX.Element => {
  const [isOpenMenu, openMenu] = useState(false);
  const { page } = useSitecore();
  const { mode } = page;
  const styles =
    props.params != null
      ? `${props.params.GridParameters ?? ''} ${props.params.Styles ?? ''}`.trimEnd()
      : '';
  const id = props.params != null ? props.params.RenderingIdentifier : null;

  if (!Object.values(props.fields).length) {
    return (
      <div className={`component navigation ${styles}`} id={id ? id : undefined}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, flag?: boolean): void => {
    if (event && mode.isEditing) {
      event.preventDefault();
    }

    if (flag !== undefined) {
      return openMenu(flag);
    }

    openMenu(!isOpenMenu);
  };

  const list = Object.values(props.fields)
    .filter((element) => element)
    .map((element: Fields, key: number) => (
      <NavigationList
        key={`${key}${element.Id}`}
        fields={element}
        handleClick={(event: React.MouseEvent<HTMLElement>) => handleToggleMenu(event, false)}
        relativeLevel={1}
      />
    ));

  return (
    <div className={`component navigation ${styles}`} id={id ? id : undefined}>
      <label className="menu-mobile-navigate-wrapper">
        <input
          type="checkbox"
          className="menu-mobile-navigate"
          checked={isOpenMenu}
          onChange={() => handleToggleMenu()}
        />
        <div className="menu-humburger" />
        <div className="component-content">
          <nav>
            <ul className="clearfix">{list}</ul>
          </nav>
        </div>
      </label>
    </div>
  );
};

export const ButtonNavigation = (props: NavigationProps): JSX.Element => {
  const list = Object.values(props.fields).filter((element) => element);

  console.log(list);

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold text-brand-black mb-8 text-center">
          Component Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((section) => (
            <ContentSdkLink
              key={section.id}
              field={getLinkField({ fields: section } as NavigationProps)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              prefetch={false}
            >
              <h4 className="text-xl font-semibold text-brand-sky mb-2">
                {getNavigationText({ fields: section } as NavigationProps)}
              </h4>
              <p className="text-brand-black mb-4">
                Explore {getNavigationText({ fields: section } as NavigationProps)} components
              </p>
              <div className="flex items-center text-brand-sky">
                <span className="mr-2">View components</span>
                <ArrowRight size={20} />
              </div>
            </ContentSdkLink>
          ))}
        </div>
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

const NavigationList = (props: NavigationProps) => {
  const { page } = useSitecore();
  const { mode } = page;
  const [active, setActive] = useState(false);
  const classNameList = `${props.fields.Styles.concat('rel-level' + props.relativeLevel).join(
    ' '
  )}`;

  let children: JSX.Element[] = [];
  if (props.fields.Children && props.fields.Children.length) {
    children = props.fields.Children.map((element: Fields, index: number) => (
      <NavigationList
        key={`${index}${element.Id}`}
        fields={element}
        handleClick={props.handleClick}
        relativeLevel={props.relativeLevel + 1}
      />
    ));
  }

  return (
    <li className={`${classNameList} ${active ? 'active' : ''}`} key={props.fields.Id} tabIndex={0}>
      <div
        className={`navigation-title ${children.length ? 'child' : ''}`}
        onClick={() => setActive(() => !active)}
      >
        <ContentSdkLink
          field={getLinkField(props)}
          editable={mode.isEditing}
          onClick={props.handleClick}
          prefetch={false}
        >
          {getNavigationText(props)}
        </ContentSdkLink>
      </div>
      {children.length > 0 ? <ul className="clearfix">{children}</ul> : null}
    </li>
  );
};

const getLinkTitle = (props: NavigationProps): string | undefined => {
  let title;
  if (props.fields.NavigationTitle?.value) {
    title = props.fields.NavigationTitle.value.toString();
  } else if (props.fields.Title?.value) {
    title = props.fields.Title.value.toString();
  } else {
    title = props.fields.DisplayName;
  }

  return title;
};
