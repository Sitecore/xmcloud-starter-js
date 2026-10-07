'use client';

import { JSX } from 'react';
import {
  Field,
  ImageField,
  Text,
  withDatasourceCheck,
  ComponentParams,
  ComponentRendering,
  LinkField,
  Link,
  NextImage,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  Name: Field<string>;
  Position: Field<string>;
  Photo: ImageField;
  SocialLink1: LinkField;
  SocialIcon1: ImageField;
  SocialLink2: LinkField;
  SocialIcon2: ImageField;
  SocialLink3: LinkField;
  SocialIcon3: ImageField;
}

export type AuthorWidgetProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const AuthorWidgetDefault = (props: AuthorWidgetProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component author-widget ${sxaStyles}`} id={id ? id : undefined}>
      <div className="author-card row g-0">
        <div className="col-auto">
          <NextImage field={props.fields.Photo} className="author-img" width={48} height={48} />
        </div>
        <div className="col">
          <h6 className="author-name">
            <Text field={props.fields.Name} />
          </h6>
          <p className="author-position">
            <Text field={props.fields.Position} />
          </p>
        </div>
      </div>
    </div>
  );
};

const AuthorWidgetWithSocials = (props: AuthorWidgetProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component author-widget with-socials ${sxaStyles}`} id={id ? id : undefined}>
      <div className="author-card row g-0">
        <div className="col-auto">
          <NextImage field={props.fields.Photo} className="author-img" width={80} height={80} />
        </div>
        <div className="col">
          <h6 className="author-name">
            <Text field={props.fields.Name} />
          </h6>
          <p className="author-position">
            <Text field={props.fields.Position} />
          </p>
        </div>
        <div className="col-12 col-md-auto">
          <div className="social-links">
            <Link field={props.fields?.SocialLink1}>
              <NextImage field={props.fields?.SocialIcon1} width={16} height={16} />
            </Link>
            <Link field={props.fields?.SocialLink2}>
              <NextImage field={props.fields?.SocialIcon2} width={16} height={16} />
            </Link>
            <Link field={props.fields?.SocialLink3}>
              <NextImage field={props.fields?.SocialIcon3} width={16} height={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Default = withDatasourceCheck()<AuthorWidgetProps>(AuthorWidgetDefault);
export const WithSocials = withDatasourceCheck()<AuthorWidgetProps>(AuthorWidgetWithSocials);
