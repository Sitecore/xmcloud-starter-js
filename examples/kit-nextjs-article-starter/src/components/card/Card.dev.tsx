import {
  RichText,
  Text,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Default as Icon } from '@/components/icon/Icon';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { IconName } from '@/enumerations/Icon.enum';
import { cn } from '@/lib/utils';
import { getDescriptiveLinkText } from '@/utils/link-text';
import { CardProps } from './card.props';

export const Default: React.FC<CardProps> = (props) => {
  const { image, heading, description, link, className, icon, editable } =
    props;

  // Generate descriptive link text for SEO (only in production, preserve CMS text in editing mode)
  const displayText = editable
    ? link?.value?.text
    : getDescriptiveLinkText(link, heading?.value);

  // Create a modified link field with descriptive text for SEO
  const enhancedLink = !editable && displayText && displayText !== link?.value?.text
    ? {
        ...link,
        value: {
          ...link?.value,
          text: displayText,
        },
      }
    : link;

  return (
    <Card className={cn('flex flex-col overflow-hidden', className)}>
      <ImageWrapper
        image={image}
        className="aspect-video w-full object-cover"
      />
      <CardHeader>
        <CardTitle>
          <Text field={heading} />
        </CardTitle>
        <RichText field={description} />
      </CardHeader>
      {link && (
        <CardFooter>
          <Button asChild>
            <Link editable={editable} field={enhancedLink}>
              {editable && (
                <>
                  {link?.value?.text}{' '}
                  <Icon iconName={icon ? icon : IconName.INTERNAL} />
                </>
              )}
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
