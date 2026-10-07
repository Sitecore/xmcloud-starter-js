'use client';

import { JSX } from 'react';
import {
  Field,
  ImageField,
  RichText,
  Placeholder,
  Text,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ParallaxBackgroundImage } from 'components/non-sitecore/ParallaxBackgroundImage';
import Head from 'next/head';

interface Fields {
  Title: Field<string>;
  Content: RichTextField;
  BackgroundImage: ImageField;
}

export type PageBackgroundProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PageBackgroundProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;

  return (
    <>
      <Head>
        <meta property="og:description" content={props.fields?.Content.value} />
        <meta property="og:name" content={props.fields?.Title?.value} />
        <meta property="og:title" content={props.fields?.Title?.value} />
        <meta property="og:image" content={props.fields?.BackgroundImage?.value?.src} />
        <meta property="og:type" content="page" />
      </Head>
      <div
        className={`component page-background col-12 ${props.params?.styles?.trimEnd()}`}
        id={id ? id : undefined}
      >
        <ParallaxBackgroundImage BackgroundImage={props.fields.BackgroundImage} />

        <div className="container">
          <Placeholder name="page-navigation" rendering={props.rendering} />

          <h1 className="display-6 fw-bold">
            <Text field={props.fields.Title}></Text>
          </h1>
          <div className="fs-2">
            <RichText field={props.fields.Content}></RichText>
          </div>
        </div>

        <div className="background-content-wrapper">
          <div className="background-content component-spaced container rounded-corners">
            <div className="p-3 p-sm-5">
              <div className="row">
                <Placeholder name="background-page-content" rendering={props.rendering} />
              </div>
            </div>
          </div>
        </div>
        <Placeholder name="page-content" rendering={props.rendering} />
      </div>
    </>
  );
};
