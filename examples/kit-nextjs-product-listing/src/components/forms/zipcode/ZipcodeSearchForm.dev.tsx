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
import {
  zipcodeFormSchema,
  type ZipcodeFormValues,
  type ZipcodeSearchFormProps,
} from './zipcode-search-form.props';

export const Default: React.FC<ZipcodeSearchFormProps> = ({
  onSubmit = (values) => console.log(values),
  defaultZipcode = '',
  buttonText = 'Find Availability',
  placeholder = 'Enter your zip code',
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
                  <Input type="tel" placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage className="absolute top-[100%] pt-1 text-[#ff5252]" />
              </FormItem>
            )}
          />
          <Button type="submit" className="flex-shrink-0">
            {buttonText}
          </Button>
        </form>
      </div>
    </Form>
  );
};
