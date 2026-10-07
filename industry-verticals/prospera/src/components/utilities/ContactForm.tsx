'use client';

import { JSX } from 'react';
import { Field, ImageField, NextImage, Text } from '@sitecore-content-sdk/nextjs';

interface Fields {
  Title: Field<string>;
  EmailLabel: Field<string>;
  SubjectLabel: Field<string>;
  MessageLabel: Field<string>;
  ButtonLabel: Field<string>;
  BackgroundImage: ImageField;
}

export type ContactFormProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ContactFormProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div
      className={`component contact-form component-spaced ${sxaStyles}`}
      id={id ? id : undefined}
    >
      <div className="container container-widest-fluid">
        <NextImage
          field={props.fields.BackgroundImage}
          className="img-fluid"
          width={1920}
          height={800}
        />
        <div className="container">
          <div className="contact-form-inner">
            <form>
              <h2 className="mb-4">
                <Text field={props.fields?.Title} />
              </h2>
              <input type="text" placeholder={props.fields.EmailLabel.value} />
              <input type="text" placeholder={props.fields.SubjectLabel.value} />
              <textarea placeholder={props.fields.MessageLabel.value} />
              <input
                type="submit"
                value={props.fields.ButtonLabel.value}
                className="button button-main mt-3"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
