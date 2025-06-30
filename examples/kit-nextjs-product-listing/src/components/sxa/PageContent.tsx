import React, { type JSX } from 'react';
import {
  RichText as JssRichText,
  Text as JssText,
  useSitecoreContext,
  RichTextField,
  LinkField,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';

interface Fields {
  Title: TextField;
  Content: RichTextField;
  MainLink: LinkField;
}

type PageContentProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentContentProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentContent = (props: ComponentContentProps) => {
  const id = props.id;
  return (
    <div className={`component content ${props.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <div className="field-content">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: PageContentProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props.params.RenderingIdentifier;

  if (!(props.fields && props.fields.Content) && !sitecoreContext?.route?.fields?.Content) {
    return (
      <div className={`component content ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-content">[Content]</div>
        </div>
      </div>
    );
  }

  const field = (
    props.fields && props.fields.Content
      ? props.fields.Content
      : sitecoreContext?.route?.fields?.Content
  ) as RichTextField;

  return (
    <ComponentContent styles={props.params.styles} id={id}>
      <JssRichText field={field} />
    </ComponentContent>
  );
};

export const TitleAndBody = (props: PageContentProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();

  const fields = {
    title:
      props.fields && props.fields.Title
        ? props.fields.Title
        : (sitecoreContext?.route?.fields?.Title as TextField),
    body:
      props.fields && props.fields.Content
        ? props.fields.Content
        : (sitecoreContext?.route?.fields?.Content as RichTextField),
  };
  return (
    <section className="bg-brand-gray95 py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-brand-black mb-4">
          <JssText field={fields.title} />
        </h2>
        <div className="text-xl text-brand-black mb-8">
          <JssRichText field={fields.body} />
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
