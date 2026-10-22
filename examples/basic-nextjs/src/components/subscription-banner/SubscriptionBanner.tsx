'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import { Mail } from 'lucide-react';
import { SubscriptionBannerProps } from './subscription-banner.props';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useState } from 'react';

type FormValues = {
  email: string;
};

/**
 * Brand-blue newsletter strip: icon, title and supporting line on the left,
 * an inline email form on the right.
 */
export const Default: React.FC<SubscriptionBannerProps> = ({ fields }) => {
  const { titleRequired, descriptionOptional, buttonLink, emailPlaceholder, emailErrorMessage, thankYouMessage } =
    fields || {};
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<FormValues>({ defaultValues: { email: '' }, mode: 'onTouched' });

  const onSubmit = async () => {
    setIsSubmitted(true);
    form.reset({ email: thankYouMessage?.value || 'Thank you for subscribing' });
  };

  return (
    <section data-component="SubscriptionBanner" className="w-full bg-white px-6 py-12">
      <div className="bg-primary text-primary-foreground mx-auto flex max-w-[1311px] flex-col gap-6 px-8 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-start gap-4">
          <Mail className="mt-1 size-7 shrink-0" aria-hidden="true" />
          <div>
            {titleRequired && (
              <Text tag="h2" field={titleRequired} className="text-xl font-light leading-snug md:text-[1.375rem]" />
            )}
            {descriptionOptional?.value && (
              <Text tag="p" field={descriptionOptional} className="mt-1 text-sm font-light text-white/80" />
            )}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3 sm:flex-row md:max-w-md">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: emailErrorMessage?.value || 'Please enter a valid email address',
                },
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={emailPlaceholder?.value || 'Your work email'}
                      className="h-11 w-full rounded-none border-white bg-white text-black"
                      disabled={isSubmitted}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-2 text-sm text-white" />
                </FormItem>
              )}
            />
            <Button type="submit" variant="secondary" className="h-11 rounded-none px-5" disabled={isSubmitted}>
              {buttonLink?.value?.text || 'Subscribe'}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};
