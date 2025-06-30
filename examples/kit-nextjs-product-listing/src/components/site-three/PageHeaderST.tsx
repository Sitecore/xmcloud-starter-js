import {
  RichText as JssRichText,
  Text as JssText,
  Image as JssImage,
  ImageField,
  Field,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  Title: Field<string>;
  Body: RichTextField;
  Image: ImageField;
}

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: PageHeaderSTProps) => {
  return (
    <section
      className={`relative min-h-[20rem] lg:min-h-[40rem] flex items-center py-18 ${props.params.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <JssImage
          field={props.fields.Image}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative container px-4 mx-auto z-20">
        <div className="grid gap-12 items-center w-full lg:grid-cols-2">
          <h1 className="text-primary text-4xl lg:text-7xl">
            <JssText field={props.fields.Title} />
          </h1>
          <div className="text-white text-xl lg:text-3xl font-medium">
            <JssRichText field={props.fields.Body} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const TextRight = (props: PageHeaderSTProps) => {
  return (
    <section
      className={`relative min-h-[20rem] lg:min-h-[40rem] flex items-center py-18 ${props.params.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <JssImage
          field={props.fields.Image}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative container px-4 mx-auto z-20">
        <div className="grid gap-12 max-w-[36rem]">
          <h1 className="text-primary text-4xl lg:text-7xl">
            <JssText field={props.fields.Title} />
          </h1>
          <div className="text-white text-xl lg:text-3xl font-medium">
            <JssRichText field={props.fields.Body} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const SplitScreen = (props: PageHeaderSTProps) => {
  return (
    <section
      className={`relative min-h-[20rem] lg:min-h-[40rem] flex flex-col lg:flex-row items-center pb-18 lg:py-18 bg-primary ${props.params.styles}`}
      data-class-change
    >
      <div className="w-full mb-18 lg:absolute lg:inset-0 lg:mb-0 lg:z-10">
        <JssImage
          field={props.fields.Image}
          width={1920}
          height={1080}
          className="w-full h-[20rem] lg:h-full object-cover lg:w-1/2 lg:ml-auto"
        />
      </div>
      <div className="relative container px-4 mx-auto z-20">
        <div className="grid gap-8 lg:max-w-[50%] pr-8">
          <h1 className="text-foreground text-4xl lg:text-7xl">
            <JssText field={props.fields.Title} />
          </h1>
          <div className="text-foreground text-xl lg:text-3xl font-medium">
            <JssRichText field={props.fields.Body} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Stacked = (props: PageHeaderSTProps) => {
  return (
    <section className={`relative py-18 ${props.params.styles}`} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="grid gap-x-12 gap-y-8 items-center w-full lg:grid-cols-2">
          <h1 className="text-4xl lg:text-7xl">
            <JssText field={props.fields.Title} />
          </h1>
          <div className="text-xl lg:text-3xl font-medium">
            <JssRichText field={props.fields.Body} />
          </div>
        </div>
      </div>
      <JssImage
        field={props.fields.Image}
        width={1920}
        height={1080}
        className="w-full h-[20rem] object-cover mt-18 lg:h-[33rem]"
      />
    </section>
  );
};

export const TwoColumn = (props: PageHeaderSTProps) => {
  return (
    <section className={`relative pt-18 bg-primary ${props.params.styles}`} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="grid gap-x-12 gap-y-8 w-full lg:grid-cols-2">
          <div>
            <h1 className="text-4xl lg:text-7xl mb-8">
              <JssText field={props.fields.Title} />
            </h1>
            <div className="text-xl lg:text-3xl font-medium">
              <JssRichText field={props.fields.Body} />
            </div>
          </div>
          <JssImage
            field={props.fields.Image}
            width={1080}
            height={1080}
            className="w-full h-full aspect-3/2 object-cover lg:aspect-square"
          />
        </div>
      </div>
    </section>
  );
};
