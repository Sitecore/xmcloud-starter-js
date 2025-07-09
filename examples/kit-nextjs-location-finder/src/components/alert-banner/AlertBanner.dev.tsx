import { useState } from 'react';
import { Text, Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ComponentProps } from '@/lib/component-props';

type AlertBannerProps = ComponentProps & AlertBannerParams & AlertBannerFields & AlertBannerData;

type AlertBannerParams = {
  params: {
    mock_param?: string;
  };
};

// Non-component data source fields
// TODO_SCAFFOLD_BE: Populate if needed, remove if not
type AlertBannerData = {
  externalFields: {
    mock_external_data: Field<string>;
  };
};

type AlertBannerFields = {
  fields: {
    title: Field<string>; // Sitecore editable text field
    description: Field<string>; // Sitecore editable text field
    image?: ImageField; // Sitecore editable image field
    link?: LinkField; // Sitecore editable link field
  };
};

export const Default: React.FC<AlertBannerProps> = (props) => {
  const { fields } = props;
  const { title, description, link } = fields;
  const [isHidden, setIsHidden] = useState(false);

  if (fields) {
    return (
      <Alert className={cn('relative border-none', { hidden: isHidden })}>
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-4 py-1 xl:px-8">
          <div className="space-y-1">
            <AlertTitle className="text-base font-semibold leading-none tracking-tight">
              <Text className="font-heading text-lg font-semibold" field={title} />
            </AlertTitle>
            <AlertDescription className="text-muted-foreground text-sm">
              <Text tag="p" className="font-body" field={description} />
            </AlertDescription>
          </div>
          <div className="flex items-center gap-2">
            {link?.value?.href && <ButtonBase buttonLink={link} variant="default" />}
            <Button variant="default" size="icon" onClick={() => setIsHidden(true)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Alert>
    );
  }
  return <NoDataFallback componentName="Alert Banner" />;
};
