export type ZipcodeFormValues = {
  zipcode: string;
};

export type ZipcodeSearchFormProps = {
  onSubmit?: (values: ZipcodeFormValues) => void;
  defaultZipcode?: string;
  buttonText?: string;
  placeholder?: string;
};
