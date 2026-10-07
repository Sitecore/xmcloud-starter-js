'use client';

import React, { JSX } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  Text,
  withDatasourceCheck,
  RichTextField,
  RichText,
  useSitecore,
  NextImage,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

interface Fields {
  Name: Field<string>;
  Photo: ImageField;
  Bio: RichTextField;
  Position: Field<string>;
}

export type AuthorListItemProps = {
  fields: Fields;
  name: string;
  url: string;
};

interface AuthorListComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: {
    items: AuthorListItemProps[];
  };
}

const AuthorListDefault = (props: AuthorListComponentProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const authors = props.fields?.items?.filter((item) => item.name !== 'Data');
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component author-list ${sxaStyles}`} id={id ? id : undefined}>
      <div className="container">
        <div className="background p-3 p-sm-5">
          {authors?.map((author, i) => (
            <React.Fragment key={author.url}>
              <div
                className={`row gx-5 row-gap-3 align-items-center ${
                  i % 2 !== 0 ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="col-lg-4">
                  <NextImage field={author.fields.Photo} width={400} height={300} />
                </div>
                <div className="col-lg-8">
                  <h3 className="fs-3 mb-0">
                    <Text field={author.fields.Name}></Text>
                  </h3>
                  <p className="position fs-5">
                    <Text field={author.fields.Position} />
                  </p>
                  <div className={`bio fs-5 ${isPageEditing ? '' : 'clamped'}`}>
                    <RichText field={author.fields.Bio}></RichText>
                  </div>
                  <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                    <Link href={author.url} className="button button-secondary">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
              {i === authors.length - 1 ? <></> : <hr />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const AuthorListSlider = (props: AuthorListComponentProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const authors = props.fields?.items?.filter((item) => item.name !== 'Data');
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component author-list author-list-slider ${sxaStyles}`}
      id={id ? id : undefined}
    >
      <div className="container">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            992: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={authors.length > 4}
          modules={[Navigation, Pagination]}
        >
          {authors?.map((author) => (
            <SwiperSlide key={author.url}>
              <Link href={author.url} className="wrapper-link">
                <NextImage field={author.fields.Photo} width={300} height={300} />
                <h3 className="fs-4 mt-4">
                  <Text field={author.fields.Name}></Text>
                </h3>
                <p>
                  <Text field={author.fields.Position} />
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const AuthorListSimple = (props: AuthorListComponentProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const authors = props.fields?.items?.filter((item) => item.name !== 'Data');
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component author-list author-list-simple ${sxaStyles}`}
      id={id ? id : undefined}
    >
      <div className="container">
        <div className="row gx-5 row-gap-5 justify-content-between justify-content-lg-start">
          {authors?.map((author) => (
            <div key={author.url} className="col-sm-5 col-lg-3">
              <div>
                <NextImage field={author.fields.Photo} width={300} height={300} />
              </div>
              <div>
                <h3 className="fs-4 mt-4 mb-1">
                  <Text field={author.fields.Name}></Text>
                </h3>
                <h4 className="position fw-normal mb-3">
                  <Text field={author.fields.Position} />
                </h4>
                <div className={`bio ${isPageEditing ? '' : 'clamped'}`}>
                  <RichText field={author.fields.Bio}></RichText>
                </div>
                <Link href={author.url} className="button button-simple">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Default = withDatasourceCheck()<AuthorListComponentProps>(AuthorListDefault);
export const Slider = withDatasourceCheck()<AuthorListComponentProps>(AuthorListSlider);
export const Simple = withDatasourceCheck()<AuthorListComponentProps>(AuthorListSimple);
