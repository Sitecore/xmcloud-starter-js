'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import { SubscriptionBannerProps } from './subscription-banner.props';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useState } from 'react';

type FormValues = {
  email: string;
};

export const Default: React.FC<SubscriptionBannerProps> = ({ fields }) => {
  const {
    titleRequired,
    descriptionOptional,
    buttonLink,
    emailPlaceholder,
    emailErrorMessage,
    thankYouMessage,
  } = fields || {};
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: FormValues) => {
    // Handle form submission
    console.log(data);
    setIsSubmitted(true);
    // Reset the form to clear the input, then set the thank you message
    form.reset({ email: thankYouMessage?.value || 'Thank you' });
  };

  return (
    <section className="w-full mx-auto px-4 py-16 text-center">
      <div className="max-w-5xl mx-auto @container">
        {titleRequired && (
          <Text
            tag="h2"
            field={titleRequired}
            className="text-primary font-heading font-normal leading-tight tracking-tight mb-6 [font-size:clamp(theme(fontSize.3xl),5cqi,theme(fontSize.7xl))]"
          />
        )}
        {descriptionOptional && (
          <Text
            tag="p"
            field={descriptionOptional}
            className="font-body text-lg text-secondary-foreground mb-12"
          />
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center max-w-md mx-auto"
          >
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: emailErrorMessage?.value || 'Email format is invalid',
                },
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={emailPlaceholder?.value || 'Enter your email address'}
                      className="flex-1 w-full rounded-full px-6 py-3 border-input"
                      disabled={isSubmitted}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-sm mt-2" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex-1 rounded-full px-8 py-2.5"
              disabled={isSubmitted}
            >
              {buttonLink?.value?.text || 'Subscribe'}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};
