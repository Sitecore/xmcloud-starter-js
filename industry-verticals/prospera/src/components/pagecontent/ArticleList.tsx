'use client';

import React, { JSX } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  Text,
  RichTextField,
  withDatasourceCheck,
  NextImage,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';

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

export type ArticleListItemProps = {
  fields: Fields;
  name: string;
  url: string;
};

interface ArticleListComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: {
    items: ArticleListItemProps[];
  };
}

const getNewsItems = (items: ArticleListItemProps[], numOfItems: number) => {
  return items
    ?.filter((item) => item.name !== 'Data' && item.name !== 'Authors')
    .slice(0, numOfItems || undefined);
};

const getAllArticlesPageHref = (items: ArticleListItemProps[]) => {
  return items?.find((item) => item.name === 'Data')?.url.replace(/\/Data$/, '') || '#';
};

const ArticleListDefault = (props: ArticleListComponentProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const newsItems = getNewsItems(props.fields?.items, parseInt(props.params?.NumberOfItems));

  return (
    <div
      className={`component article-list ${props.params?.styles.trimEnd()}`}
      id={id ? id : undefined}
    >
      <div className="container">
        <div className="background p-3 p-sm-5">
          {newsItems?.map((item, i) => (
            <React.Fragment key={item.url}>
              <div
                className={`row gx-5 row-gap-3 align-items-center ${
                  i % 2 !== 0 ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="col-lg-4">
                  <NextImage field={item.fields.Thumbnail} width={400} height={300} />
                </div>

                <div className="col-lg-8">
                  <h3 className="fs-4">
                    <Text field={item.fields.Title}></Text>
                  </h3>
                  <p className="article-excerpt fs-5">
                    <Text field={item.fields.Excerpt}></Text>
                  </p>
                  <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                    <Link href={item.url} className="button button-secondary">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
              {i === newsItems.length - 1 ? <></> : <hr />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleListThreeColumn = (props: ArticleListComponentProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const newsItems = getNewsItems(props.fields?.items, parseInt(props.params?.NumberOfItems));
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component component-spaced article-list ${sxaStyles}`}
      id={id ? id : undefined}
    >
      <div className="container">
        <div className="row row-gap-3">
          {newsItems?.map((item) => (
            <div className="col-lg-4" key={item.url}>
              <Link href={item.url} className="wrapper-link">
                <NextImage field={item.fields.Thumbnail} width={400} height={300} />
                <h3 className="fs-4 mt-3">
                  <Text field={item.fields.Title}></Text>
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleListSimplified = (props: ArticleListComponentProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const newsItems = getNewsItems(props.fields?.items, parseInt(props.params?.NumberOfItems));
  const allArticlesPageHref = getAllArticlesPageHref(props.fields?.items);
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component component-spaced article-list ${sxaStyles}`}
      id={id ? id : undefined}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col">
            <div className="title display-6">News</div>
          </div>
          <div className="col-auto learn-more">
            <Link href={allArticlesPageHref} className="button button-simple">
              See All <i className="fa fa-angle-right fs-4" />
            </Link>
          </div>
        </div>

        <div className="background p-3 p-sm-5">
          {newsItems?.map((item, i) => (
            <React.Fragment key={item.url}>
              <div className="row gx-5 row-gap-3 align-items-center">
                <div className="col-lg-4">
                  <NextImage field={item.fields.Thumbnail} width={400} height={300} />
                </div>

                <div className="col-lg-6">
                  <h3 className="fs-4">
                    <Text field={item.fields.Title}></Text>
                  </h3>
                  <p>
                    <Text field={item.fields.Excerpt}></Text>
                  </p>
                  <Link href={item.url} className="button button-simple">
                    Read More
                  </Link>
                </div>
              </div>
              {i === newsItems.length - 1 ? <></> : <hr />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleListGrid = (props: ArticleListComponentProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const newsItems = getNewsItems(props.fields?.items, parseInt(props.params?.NumberOfItems));
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component component-spaced article-list ${sxaStyles}`}
      id={id ? id : undefined}
    >
      <div className="container container-wide">
        <div className="article-list-grid">
          {newsItems?.map((item) => (
            <div className="article-grid-item" key={item.url}>
              <Link href={item.url} className="wrapper-link">
                <NextImage field={item.fields.Thumbnail} width={800} height={400} />
                <h3 className="fs-4 mt-3">
                  <Text field={item.fields.Title}></Text>
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Default = withDatasourceCheck()<ArticleListComponentProps>(ArticleListDefault);
export const ThreeColumn = withDatasourceCheck()<ArticleListComponentProps>(ArticleListThreeColumn);
export const Simplified = withDatasourceCheck()<ArticleListComponentProps>(ArticleListSimplified);
export const Grid = withDatasourceCheck()<ArticleListComponentProps>(ArticleListGrid);
