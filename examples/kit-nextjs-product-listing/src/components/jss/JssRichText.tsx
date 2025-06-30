import { RichText, RichTextProps } from '@sitecore-content-sdk/nextjs';

import type { JSX } from 'react';

const JssRichText = (props: RichTextProps): JSX.Element => {
  const { field, ...rest } = props;

  return (
    <div className="jss-rich-text">
      <RichText field={field} {...rest} />
    </div>
  );
};

export default JssRichText;
