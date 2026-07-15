import { RichText, Text, Field, ImageField, LinkField, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Default as Icon } from '@/components/icon/Icon';
import { IconName } from '@/enumerations/Icon.enum';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Link } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import type { CardFields, CardProps } from './card.props';

export const Default: React.FC<CardProps> = (props) => {
  // Handle both ComponentProps structure and flat structure for backward compatibility
  const fields = (props.fields ?? (props.rendering as ComponentRendering & { fields?: CardFields })?.fields ?? props) as CardFields;
  const params = props.params ?? props.rendering?.params ?? {};
  const page = props.page;
  
  const { image, heading, description, link } = fields || {};
  const { className, icon, editable } = params || {};

  return (
    <Card className={cn('flex flex-col overflow-hidden', className)}>
      <ImageWrapper image={image} className="aspect-video w-full object-cover" page={page} />
      <CardHeader>
        <CardTitle>
          <Text field={heading} />
        </CardTitle>
        <RichText field={description} />
      </CardHeader>
      {link && (
        <CardFooter>
          <Button asChild>
            <Link editable={editable} field={link}>
              {editable && (
                <>
                  {link?.value?.text} <Icon iconName={icon ? icon : IconName.INTERNAL} />
                </>
              )}
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
