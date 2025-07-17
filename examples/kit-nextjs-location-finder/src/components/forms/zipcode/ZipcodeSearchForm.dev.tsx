import { useForm } from 'react-hook-form';
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
import { z } from 'zod';

// Schema for form validation
const zipcodeFormSchema = z.object({
  zipcode: z.string().regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/, {
    message: 'Please enter a valid zip code',
  }),
});

// Type for form values
type ZipcodeFormValues = z.infer<typeof zipcodeFormSchema>;

// Props for the ZipcodeSearchForm component
interface ZipcodeSearchFormProps {
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

export const Default: React.FC<ZipcodeSearchFormProps> = ({
  onSubmit = (values) => console.log(values),
  defaultZipcode = '',
  buttonText,
  placeholder,
}) => {
  const form = useForm<ZipcodeFormValues>({
    resolver: zodResolver(zipcodeFormSchema),
    defaultValues: {
      zipcode: defaultZipcode,
    },
  });

  function handleSubmit(values: ZipcodeFormValues) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <div className="@container/zipform w-full">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="@[20rem]/zipform:flex-nowrap relative flex w-full flex-wrap gap-2 group-[.position-right]:justify-end group-[.position-center]:justify-center"
        >
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem className="min-w-51 mt-0 flex-shrink basis-64 space-y-0">
                <FormLabel className="sr-only">Enter your zip code</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder={placeholder || 'Enter your zip code'} {...field} />
                </FormControl>
                <FormMessage className="absolute top-[100%] pt-1 text-[#ff5252]" />
              </FormItem>
            )}
          />
          <Button type="submit" className="flex-shrink-0">
            {buttonText || 'Find Availability'}
          </Button>
        </form>
      </div>
    </Form>
  );
};
