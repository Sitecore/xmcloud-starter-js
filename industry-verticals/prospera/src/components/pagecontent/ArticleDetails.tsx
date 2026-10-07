'use client';

import { JSX } from 'react';
import {
  Field,
  ImageField,
  Placeholder,
  Text,
  RichText,
  RichTextField,
  NextImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ParallaxBackgroundImage } from 'components/non-sitecore/ParallaxBackgroundImage';
import Head from 'next/head';

interface Fields {
  Title: Field<string>;
  Excerpt: Field<string>;
  Content: RichTextField;
  Thumbnail: ImageField;
  BackgroundImage: ImageField;
  Name: Field<string>;
  Photo: ImageField;
  Position: Field<string>;
}

export type PageBackgroundProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PageBackgroundProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  return (
    <>
      <Head>
        <meta property="og:description" content={props.fields?.Excerpt.value} />
        <meta property="og:name" content={props.fields?.Title?.value} />
        <meta property="og:title" content={props.fields?.Title?.value} />
        <meta property="og:image" content={props.fields?.Thumbnail?.value?.src} />
        <meta property="og:type" content="article" />
      </Head>
      <div
        className={`component article-details page-background spaced-top col-12 ${props.params?.styles?.trimEnd()}`}
        id={id ? id : undefined}
      >
        <ParallaxBackgroundImage BackgroundImage={props.fields.BackgroundImage} />

        <div className="container">
          <Placeholder name="page-navigation" rendering={props.rendering} />
        </div>

        <div>
          <div className="background-content component-spaced container rounded-corners">
            <div className="p-3 p-sm-5">
              <div className="article-content">
                <div className="row row-gap-4 gx-5">
                  <div className="col-12 col-lg-6">
                    <NextImage
                      field={props.fields.Thumbnail}
                      className="article-img img-fluid"
                      width={600}
                      height={400}
                    />
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="row">
                      <Placeholder name="article-meta" rendering={props.rendering} />
                    </div>
                    <h1 className="article-title">
                      <Text field={props.fields.Title} />
                    </h1>
                    <p className="article-excerpt">
                      <Text field={props.fields.Excerpt} />
                    </p>
                  </div>
                </div>
                <div className="article-content-body mt-5">
                  <RichText field={props.fields.Content} />
                </div>
              </div>
              <div className="row">
                <Placeholder name="background-page-content" rendering={props.rendering} />
              </div>
            </div>
          </div>
          <Placeholder name="page-content" rendering={props.rendering} />
        </div>
      </div>
    </>
  );
};

export const Simple = (props: PageBackgroundProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  return (
    <>
      <Head>
        <meta property="og:description" content={props.fields?.Excerpt.value} />
        <meta property="og:name" content={props.fields?.Title?.value} />
        <meta property="og:title" content={props.fields?.Title?.value} />
        <meta property="og:image" content={props.fields?.Thumbnail?.value?.src} />
        <meta property="og:type" content="article" />
      </Head>
      <div
        className={`component simple-article-details mt-4 ${props.params?.styles?.trimEnd()}`}
        id={id ? id : undefined}
      >
        <div className="container container-wide">
          <h1 className="article-title display-1 fw-bold">
            <Text field={props.fields.Title} />
          </h1>
        </div>
        <div className="container container-widest-fluid">
          <NextImage
            field={props.fields.Thumbnail}
            className="article-img img-fluid"
            width={1650}
            height={750}
          />
        </div>
        <div className="container">
          <div className="article-content">
            <div className="row">
              <div className="col-12 col-lg-6 mx-auto">
                <p className="article-excerpt fs-5">
                  <Text field={props.fields.Excerpt} />
                </p>
                <div className="article-content-body rich-text mt-5">
                  <RichText field={props.fields.Content} />
                </div>
                <div className="row article-meta-row">
                  <Placeholder name="article-meta" rendering={props.rendering} />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <Placeholder name="background-page-content" rendering={props.rendering} />
          </div>
        </div>
        <div className="row">
          <Placeholder name="page-content" rendering={props.rendering} />
        </div>
      </div>
    </>
  );
};
