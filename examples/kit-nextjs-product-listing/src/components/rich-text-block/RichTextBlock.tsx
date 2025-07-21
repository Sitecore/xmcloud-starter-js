import { RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { RichTextBlockProps } from './rich-text-block.props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<RichTextBlockProps> = (props) => {
  const { fields } = props;
  const text = props.fields ? (
    <ContentSdkRichText field={props.fields.text} />
  ) : (
    <span className="is-empty-hint">Rich text</span>
  );
  const id = props.params.RenderingIdentifier;
  if (fields) {
    return (
      <>
        <div
          className={cn('component rich-text', props.params.styles?.trimEnd())}
          id={id ? id : undefined}
        >
          <div className="component-content">{text}</div>
        </div>
      </>
    );
  }
  return <NoDataFallback componentName="Rich Text Block" />;
};
