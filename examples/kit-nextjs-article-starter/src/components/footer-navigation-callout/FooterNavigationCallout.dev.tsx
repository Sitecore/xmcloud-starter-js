import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text, Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';

interface FooterNavigationCalloutFields {
  title?: Field<string>;
  description?: Field<string>;
  linkOptional?: LinkField;
}

interface FooterNavigationCalloutProps {
  fields: FooterNavigationCalloutFields;
}

export const Default: React.FC<FooterNavigationCalloutProps> = ({ fields }) => {
  const { title, description, linkOptional } = fields;

  return (
    <Card className="bg-accent text-accent-foreground rounded-[24px] border-none p-2 ">
      <CardHeader className="flex flex-row justify-between pb-4">
        <CardTitle className="font-heading text-xl font-medium">
          <Text tag="span" field={title} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text field={description} className="font-body text-sm" />
        {linkOptional && (
          <Button className="mt-10 block w-full text-center" buttonLink={linkOptional} />
        )}
      </CardContent>
    </Card>
  );
};
