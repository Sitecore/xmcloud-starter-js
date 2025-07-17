import { RichText, RichTextProps } from '@sitecore-content-sdk/nextjs';

import type { JSX } from 'react';

const ContentSdkRichText = (props: RichTextProps): JSX.Element => {
  const { field, ...rest } = props;

  return (
    <div className="content-sdk-rich-text">
      <RichText field={field} {...rest} />
    </div>
  );
};

export default ContentSdkRichText;
