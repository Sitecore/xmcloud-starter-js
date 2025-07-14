import type React from 'react';
import { RichText as JssRichText, Field } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
type RichTextBlockProps = ComponentProps & RichTextFields;

interface RichTextFields {
  fields: {
    text: Field<string>;
  };
}

export const Default: React.FC<RichTextBlockProps> = (props) => {
  const { fields, params } = props;
  const text = fields ? (
    <JssRichText field={fields.text} />
  ) : (
    <span className="is-empty-hint">Rich text</span>
  );
  const id = params?.RenderingIdentifier;

  if (fields) {
    return (
      <div
        className={cn('prose', { [props?.params?.styles]: props?.params?.styles })}
        id={id ? id : undefined}
        data-component-name="rich-text-block"
      >
        {text}
      </div>
    );
  }
  return <NoDataFallback componentName="Rich Text Block" />;
};
