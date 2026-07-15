import React, { type JSX } from 'react';
import {
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  Page,
  RichTextField,
  LinkField,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';

import type { PageContentComponentContentProps, PageContentProps } from './page-content.props';

const ComponentContent = (props: PageContentComponentContentProps) => {
  const id = props.id;
  return (
    <div className={`component content ${props.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <article className="field-content">{props.children}</article>
      </div>
    </div>
  );
};

export const Default = (props: PageContentProps): JSX.Element => {
  const { layout } = props.page;
  const routeFields = layout?.sitecore?.route?.fields;
  const id = props.params.RenderingIdentifier;

  if (!(props.fields && props.fields.Content) && !routeFields?.Content) {
    return (
      <div className={`component content ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-content">[Content]</div>
        </div>
      </div>
    );
  }

  const field = (
    props.fields && props.fields.Content ? props.fields.Content : routeFields?.Content
  ) as RichTextField;

  return (
    <ComponentContent styles={props.params.styles} id={id}>
      <ContentSdkRichText field={field} />
    </ComponentContent>
  );
};

export const TitleAndBody = (props: PageContentProps): JSX.Element => {
  const { layout } = props.page;
  const routeFields = layout?.sitecore?.route?.fields;

  const fields = {
    title:
      props.fields && props.fields.Title ? props.fields.Title : (routeFields?.Title as TextField),
    body:
      props.fields && props.fields.Content
        ? props.fields.Content
        : (routeFields?.Content as RichTextField),
  };
  return (
    <section className="bg-brand-gray95 py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-brand-black mb-4">
          <ContentSdkText field={fields.title} />
        </h2>
        <div className="text-xl text-brand-black mb-8">
          <ContentSdkRichText field={fields.body} />
        </div>
        <Link
          href="#components"
          className="bg-brand-sky text-white px-6 py-3 rounded-md hover:bg-[#71B5F0] transition-colors"
        >
          Explore Components
        </Link>
      </div>
    </section>
  );
};
