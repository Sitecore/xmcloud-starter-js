'use client';

import type React from 'react';
import { EnumValues } from '@/enumerations/generic.enum';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Text, Field } from '@sitecore-content-sdk/nextjs';
import { useState } from 'react';
import { SuccessCompact } from '../success/success-compact.dev';
import { cn } from '@/lib/utils';

interface EmailSignupFormProps {
  fields?: {
    emailPlaceholder?: Field<string>;
    emailErrorMessage?: Field<string>;
    emailSubmitLabel?: Field<string>;
    emailSuccessMessage?: Field<string>;
    buttonVariant?: EnumValues<typeof ButtonVariants>;
  };
}

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
});
const updateSchemaWithDictionary = (fields: EmailSignupFormProps['fields']) => {
  return formSchema.extend({
    // Update the schema with the dictionary values here
    email: z.string().email({
      message: fields?.emailErrorMessage?.value || 'Please enter a valid email address',
    }),
  });
};
export const Default: React.FC<EmailSignupFormProps> = (props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const schemaWithDictionary = updateSchemaWithDictionary(props.fields);

  const form = useForm<z.infer<typeof schemaWithDictionary>>({
    resolver: zodResolver(schemaWithDictionary),
    defaultValues: {
      email: '',
    },
  });

  // arg - values: z.infer<typeof formSchema>
  function onSubmit() {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  }

  const emailPlaceholder = props.fields?.emailPlaceholder?.value || 'Enter your email address';
  const buttonText = props.fields?.emailSubmitLabel?.value || 'Subscribe';
  const successMessage = props.fields?.emailSuccessMessage?.value || 'Thank you for subscribing!';
  const btnVariant = props.fields?.buttonVariant || 'default';

  if (isSubmitted) {
    return <SuccessCompact successMessage={successMessage} />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('@sm:flex-nowrap @sm:flex-row relative flex h-auto w-full gap-2')}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="@sm:min-w-52 shrink-1 grow-1 mt-0 basis-full space-y-0">
              <FormLabel className="sr-only">Email address</FormLabel>
              <FormControl>
                <Input type="email" placeholder={emailPlaceholder} {...field} />
              </FormControl>
              <FormMessage className=" absolute top-[100%] pt-1 text-inherit" />
            </FormItem>
          )}
        />
        <Button type="submit" variant={btnVariant}>
          <Text field={{ value: buttonText }} />
        </Button>
      </form>
    </Form>
  );
};
