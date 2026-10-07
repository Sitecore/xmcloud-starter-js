'use client';

import { JSX } from 'react';
import { Field, ImageField, Text, NextImage } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Quote: Field<string>;
  AuthorName: Field<string>;
  AuthorPosition: Field<string>;
  Image: ImageField;
}

export type PromoCtaProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: PromoCtaProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component quote ${sxaStyles}`} id={id ? id : undefined}>
      <svg
        id="Layer_2"
        data-name="Layer 2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 149.87 119.74"
        className="quote-icon"
      >
        <g id="Layer_1-2" data-name="Layer 1">
          <g>
            <path
              fill="currentColor"
              d="M142.98,0h-45.57c-7.97,0-14.43,6.46-14.43,14.43v53.23c0,3.81,3.09,6.89,6.89,6.89h23.1c-1.44,13.35-12.74,23.74-26.47,23.74h-3.52v21.45h17.17c27.46,0,49.72-22.26,49.72-49.72V6.89c0-3.81-3.09-6.89-6.89-6.89Z"
            />
            <path
              fill="currentColor"
              d="M60,0H14.43C6.46,0,0,6.46,0,14.43v53.23c0,3.81,3.09,6.89,6.89,6.89H29.99c-1.44,13.35-12.74,23.74-26.47,23.74H0v21.45H17.17c27.46,0,49.72-22.26,49.72-49.72V6.89c0-3.81-3.09-6.89-6.89-6.89Z"
            />
          </g>
        </g>
      </svg>
      <blockquote className="fs-1 fw-bold">
        <Text field={props.fields.Quote} />
      </blockquote>
      <p className="author-name fs-5 mb-1">
        <Text field={props.fields.AuthorName} />
      </p>
      <p className="author-position">
        <Text field={props.fields.AuthorPosition} />
      </p>
    </div>
  );
};

export const Simple = (props: PromoCtaProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component quote simple ${sxaStyles}`} id={id ? id : undefined}>
      <div className="row gx-0">
        <div className="col-auto me-3">
          <NextImage field={props.fields.Image} className="author-image" width={48} height={48} />
        </div>
        <div className="col">
          <blockquote className="mb-0">
            <Text field={props.fields.Quote} />
          </blockquote>
          <p className="author-name mb-0">
            <Text field={props.fields.AuthorName} />
          </p>
        </div>
      </div>
    </div>
  );
};
