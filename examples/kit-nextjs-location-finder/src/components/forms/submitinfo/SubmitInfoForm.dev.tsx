'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import libphonenumber from 'google-libphonenumber';
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
import { SuccessCompact } from '../success/success-compact.dev';
import { EnumValues } from '@/enumerations/generic.enum';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';

interface SubmitInfoFormProps {
  fields?: {
    firstNameLabel?: Field<string>;
    firstNamePlaceholder?: Field<string>;
    lastNameLabel?: Field<string>;
    lastNamePlaceholder?: Field<string>;
    zipcodeLabel?: Field<string>;
    zipcodePlaceholder?: Field<string>;
    emailLabel?: Field<string>;
    emailPlaceholder?: Field<string>;
    emailErrorMessage?: Field<string>;
    phoneLabel?: Field<string>;
    phonePlaceholder?: Field<string>;
    buttonText?: Field<string>;
    successMessage?: Field<string>;
    buttonVariant?: EnumValues<typeof ButtonVariants>;
  };
  className?: string;
}

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const formSchema = z.object({
  firstName: z.string().nonempty({
    message: 'First name is required',
  }),
  lastName: z.string().nonempty({
    message: 'Last name is required',
  }),
  zipcode: z
    .string()
    .nonempty({
      message: 'Zipcode is required',
    })
    .regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/, {
      message: 'Please enter a valid zipcode',
    }),
  email: z
    .string()
    .nonempty({
      message: 'Email is required',
    })
    .email({
      message: 'Please enter a valid email address',
    }),
  phone: z
    .string()
    .nonempty({
      message: 'Phone number is required',
    })
    .refine(
      (number) => {
        try {
          const phoneNumber = phoneUtil.parse(number, 'US');
          return phoneUtil.isValidNumber(phoneNumber);
        } catch (error) {
          console.log(error);
          return false;
        }
      },
      { message: 'Please enter a valid phone number' }
    ),
});

const updateSchemaWithDictionary = (fields: SubmitInfoFormProps['fields']) => {
  return formSchema.extend({
    // Update the schema with the dictionary values here
    email: z.string().email({
      message: fields?.emailErrorMessage?.value || 'Please enter a valid email address',
    }),
  });
};

export const Default: React.FC<SubmitInfoFormProps> = (props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const schemaWithDiction = updateSchemaWithDictionary(props.fields);
  const form = useForm<z.infer<typeof schemaWithDiction>>({
    resolver: zodResolver(schemaWithDiction),
    defaultValues: {
      firstName: '',
      lastName: '',
      zipcode: '',
      email: '',
      phone: '',
    },
  });

  // arg - values: z.infer<typeof formSchema>
  function onSubmit() {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  }

  // Data assignments
  const firstNameLabel = props.fields?.firstNameLabel?.value || 'First name';
  const firstNamePlaceholder = props.fields?.firstNamePlaceholder?.value || 'Enter your first name';
  const lastNameLabel = props.fields?.lastNameLabel?.value || 'Last name';
  const lastNamePlaceholder =
    props.fields?.lastNamePlaceholder?.value || 'Enter your last (or family) name';
  const zipcodeLabel = props.fields?.zipcodeLabel?.value || 'Zipcode';
  const zipcodePlaceholder = props.fields?.zipcodePlaceholder?.value || 'Enter your zipcode';
  const emailLabel = props.fields?.emailLabel?.value || 'Email';
  const emailPlaceholder = props.fields?.emailPlaceholder?.value || 'Enter your email address';
  const phoneLabel = props.fields?.phoneLabel?.value || 'Phone';
  const phonePlaceholder = props.fields?.phonePlaceholder?.value || 'Enter your phone number';
  const buttonText = props.fields?.buttonText?.value || 'Finish Booking';
  const successMessage =
    props.fields?.successMessage?.value || 'Got it. Thank you! We will be in touch shortly.';
  const btnVariant = props.fields?.buttonVariant || 'default';

  if (isSubmitted) {
    return <SuccessCompact successMessage={successMessage} />;
  }

  // Repeated classes
  const formItemClasses = 'relative space-y-2';
  const labelClasses = 'block text-foreground text-left';
  const inputClasses = 'rounded-md px-2 py-3 border-foreground bg-background text-foreground';
  const errorClasses = 'absolute -translate-y-[5px] text-[#ff5252]';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[750px] space-y-9 group-[.position-center]:mx-auto group-[.position-right]:ml-auto"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className={formItemClasses}>
              <FormLabel className={labelClasses}>{firstNameLabel}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={firstNamePlaceholder}
                  className={inputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage className={errorClasses} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className={formItemClasses}>
              <FormLabel className={labelClasses}>{lastNameLabel}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={lastNamePlaceholder}
                  className={inputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage className={errorClasses} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem className={formItemClasses}>
              <FormLabel className={labelClasses}>{zipcodeLabel}</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder={zipcodePlaceholder}
                  className={inputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage className={errorClasses} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className={formItemClasses}>
              <FormLabel className={labelClasses}>{emailLabel}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={emailPlaceholder}
                  className={inputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage className={errorClasses} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className={formItemClasses}>
              <FormLabel className={labelClasses}>{phoneLabel}</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder={phonePlaceholder}
                  className={inputClasses}
                  {...field}
                />
              </FormControl>
              <FormMessage className={errorClasses} />
            </FormItem>
          )}
        />
        <div>
          <Button className="mt-4" type="submit" variant={btnVariant}>
            <Text field={{ value: buttonText }} />
          </Button>
        </div>
      </form>
    </Form>
  );
};
