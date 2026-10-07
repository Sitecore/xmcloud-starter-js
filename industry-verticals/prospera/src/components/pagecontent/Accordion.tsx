'use client';

import { useState, JSX } from 'react';
import { Field, ImageField, NextImage, RichText, Text } from '@sitecore-content-sdk/nextjs';

interface AccordionItemFields {
  Icon: ImageField;
  Title: Field<string>;
  Content: Field<string>;
}

export type AccordionItemProps = {
  fields: AccordionItemFields;
  name: string;
  url: string;
};

export type AccordionProps = {
  params: { [key: string]: string };
  fields: {
    items: AccordionItemProps[];
  };
};

const AccordionItem = ({ item }: { item: AccordionItemProps }): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="accordion-group">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`button-clear-appearance ${isExpanded ? 'expanded' : ''}`}
      >
        <div className="icon-wrapper">
          <NextImage field={item.fields.Icon} width={32} height={32} />
        </div>
        <h3 className="display-6 fw-bold mb-0">
          <Text field={item.fields.Title} />
        </h3>
        <span className="button-icon-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width={23}
            fill="currentColor"
          >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </span>
      </button>
      <div className={`content-wrapper ${isExpanded ? 'd-block' : 'd-none'}`}>
        <div className="row justify-content-end">
          <div className="col-12 col-lg-6">
            <div className="rich-text styled-list">
              <RichText field={item.fields.Content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Default = (props: AccordionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const accordionItems = props.fields?.items;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component accordion component-spaced ${sxaStyles}`} id={id ? id : undefined}>
      <div className="container">
        {accordionItems?.map((item) => (
          <AccordionItem key={item.url} item={item} />
        ))}
      </div>
    </div>
  );
};
