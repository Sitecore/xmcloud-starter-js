'use client';

import { JSX } from 'react';
import {
  Field,
  Link,
  LinkField,
  RichText,
  RichTextField,
  Text,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  Title: Field<string>;
  Subtitle: RichTextField;
  FullName: Field<string>;
  IDNumber: Field<string>;
  Email: Field<string>;
  MobileNumber: Field<number>;
  Footnote: RichTextField;
  SubmitButton: LinkField;
}

export type ApplicationFormProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ApplicationFormProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component application-form ${sxaStyles}`} id={id ? id : undefined}>
      <div className="application-form-inner">
        <div className="container">
          <div className="title">
            <Text field={props.fields?.Title} />
          </div>
          <div className="subtitle">
            <RichText field={props.fields?.Subtitle} />
          </div>
          <input
            className="input-field"
            defaultValue={props.fields?.FullName?.value}
            placeholder="First and Last name"
          />
          <input
            className="input-field"
            defaultValue={props.fields?.IDNumber?.value}
            placeholder="ID number"
          />
          <input
            className="input-field"
            defaultValue={props.fields?.Email?.value}
            placeholder="Email"
          />
          <input
            className="input-field"
            defaultValue={props.fields?.MobileNumber?.value}
            placeholder="Mobile number"
          />
          <div className="footnote">
            <RichText field={props.fields?.Footnote} />
          </div>
          <Link field={props.fields.SubmitButton} className="button button-main submit-button" />
        </div>
      </div>
    </div>
  );
};
