import { z } from 'zod';

// Schema for form validation
export const zipcodeFormSchema = z.object({
  zipcode: z.string().regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/, {
    message: 'Please enter a valid zip code',
  }),
});

// Type for form values
export type ZipcodeFormValues = z.infer<typeof zipcodeFormSchema>;

// Props for the ZipcodeSearchForm component
export interface ZipcodeSearchFormProps {
  /**
   * Optional callback function that is called when the form is submitted
   */
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (values: ZipcodeFormValues) => void;

  /**
   * Optional default value for the zipcode field
   */
  defaultZipcode?: string;

  /**
   * Optional button text
   */
  buttonText?: string;

  /**
   * Optional placeholder text for the input field
   */
  placeholder?: string;
}
