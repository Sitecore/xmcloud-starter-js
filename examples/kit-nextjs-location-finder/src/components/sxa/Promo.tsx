import React, { type JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  ImageField,
  Field,
  LinkField,
  Page,
} from '@sitecore-content-sdk/nextjs';
import { Button } from '@/components/ui/button';

import type { PromoProps } from './promo.props';

const PromoDefaultComponent = (props: PromoProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Promo</span>
    </div>
  </div>
);

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { isEditing } = props.page.mode;

  if (props.fields) {
    return (
      <div
        data-class-change
        className={`component promo flex-1 shadow-lg pointer mb-5 lg:mb-0 ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <aside role="complementary" className="flex flex-col items-start justify-end h-full">
          <ContentSdkImage field={props.fields.PromoIcon} className="w-full h-auto object-cover" />
          <div className={`flex-1 relative pt-4 px-6 ${isEditing ? 'min-w-[300px] w-full' : ''}`}>
            {(props.fields.PromoText3?.value || isEditing) && (
              <ContentSdkRichText
                tag="div"
                className={`inline-block text-base font-bold px-2 py-1 mb-4 bg-[#ffb900] ${
                  isEditing ? 'min-w-[200px] w-full' : ''
                }`}
                field={props.fields.PromoText3}
              />
            )}
            {(props.fields.PromoText?.value || isEditing) && (
              <ContentSdkRichText
                tag="h2"
                className={`text-3xl font-bold mb-4 ${isEditing ? 'min-w-[250px] w-full' : ''}`}
                field={props.fields.PromoText}
              />
            )}
            {(props.fields.PromoText2?.value || isEditing) && (
              <ContentSdkRichText
                tag="div"
                className={`text-base mb-4 ${isEditing ? 'min-w-[200px] w-full' : ''}`}
                field={props.fields.PromoText2}
              />
            )}
          </div>
          <Button
            variant="default"
            className="font-bold py-1 px-3 mx-6 mb-4 mt-auto relative b-0"
            asChild
          >
            {props.fields.PromoLink ? <ContentSdkLink field={props.fields.PromoLink} /> : null}
          </Button>
        </aside>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};

export const CenteredCard = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { isEditing } = props.page.mode;

  if (props.fields) {
    return (
      <div
        data-class-change
        className={`component promo flex-1 w-full shadow-lg pointer mb-5 lg:mb-0 align-stretch ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <aside role="complementary" className="flex flex-col items-start justify-end">
          <ContentSdkImage field={props.fields.PromoIcon} className="w-full h-auto object-cover" />
          <div
            className={`flex-1 relative pt-4 px-4 w-full justify-center text-center ${
              isEditing ? 'min-w-[300px]' : ''
            }`}
          >
            {(props.fields.PromoText?.value || isEditing) && (
              <ContentSdkRichText
                tag="h2"
                className={`text-4xl font-bold mb-4 ${isEditing ? 'min-w-[250px] w-full' : ''}`}
                field={props.fields.PromoText}
              />
            )}
            {(props.fields.PromoText2?.value || isEditing) && (
              <ContentSdkRichText
                tag="div"
                className={`mb-4 ${isEditing ? 'min-w-[200px] w-full' : ''}`}
                field={props.fields.PromoText2}
              />
            )}
          </div>
          <Button
            variant="link"
            size="lg"
            className="font-bold text-xl text-center w-full py-1 px-3 ml-4 mb-4 relative b-0"
            asChild
          >
            {props.fields.PromoLink ? <ContentSdkLink field={props.fields.PromoLink} /> : null}
          </Button>
        </aside>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};
