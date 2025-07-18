import { useContainerOffsets } from '@/hooks/useContainerOffsets';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  Eyebrow: Field<string>;
  Title: Field<string>;
  Image1: ImageField;
  Image2: ImageField;
  Link1: LinkField;
  Link2: LinkField;
}

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: PageHeaderSTProps) => {
  const { containerRef, rightOffset } = useContainerOffsets();

  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props.params.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <ContentSdkImage
          field={props.fields.Image1}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative lg:container w-full lg:flex mx-auto z-20" ref={containerRef}>
        <div className="flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[50rem] px-4 py-8 lg:p-8 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)]">
          <div className="lg:max-w-3xl">
            <h5 className="text-primary text-xl lg:text-3xl pb-4 uppercase">
              <ContentSdkText field={props.fields.Eyebrow} />
            </h5>
            <h1 className="text-4xl lg:text-7xl uppercase">
              <ContentSdkText field={props.fields.Title} />
            </h1>
            <div className="mt-8">
              <ContentSdkLink
                field={props.fields.Link1}
                prefetch={false}
                className="btn btn-primary mr-4"
              />
              <ContentSdkLink
                field={props.fields.Link2}
                prefetch={false}
                className="btn btn-secondary"
              />
            </div>
          </div>
        </div>
        <div
          className={`lg:absolute top-0 bottom-0 left-2/3`}
          style={{ right: `-${rightOffset - 16}px` }}
        >
          <ContentSdkImage
            field={props.fields.Image1}
            width={1920}
            height={1080}
            priority={true}
            className="aspect-7/4 lg:aspect-auto w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export const Right = (props: PageHeaderSTProps) => {
  const { containerRef, leftOffset } = useContainerOffsets();

  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props.params.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <ContentSdkImage
          field={props.fields.Image1}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="relative lg:container w-full lg:flex lg:flex-row-reverse mx-auto z-20"
        ref={containerRef}
      >
        <div className="flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[50rem] px-4 py-8 lg:p-8 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)]">
          <div className="lg:max-w-3xl lg:ml-auto text-right">
            <h5 className="text-primary text-xl lg:text-3xl pb-4 uppercase">
              <ContentSdkText field={props.fields.Eyebrow} />
            </h5>
            <h1 className="text-4xl lg:text-7xl uppercase">
              <ContentSdkText field={props.fields.Title} />
            </h1>
            <div className="mt-8">
              <ContentSdkLink
                field={props.fields.Link1}
                prefetch={false}
                className="btn btn-primary mr-4"
              />
              <ContentSdkLink
                field={props.fields.Link2}
                prefetch={false}
                className="btn btn-secondary"
              />
            </div>
          </div>
        </div>
        <div
          className={`lg:absolute top-0 bottom-0 right-2/3`}
          style={{ left: `-${leftOffset - 16}px` }}
        >
          <ContentSdkImage
            field={props.fields.Image1}
            width={1920}
            height={1080}
            className="aspect-7/4 lg:aspect-auto w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export const Centered = (props: PageHeaderSTProps) => {
  const { containerRef, rightOffset } = useContainerOffsets();

  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props.params.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <ContentSdkImage
          field={props.fields.Image1}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative lg:container w-full lg:flex mx-auto z-20" ref={containerRef}>
        <div className="lg:relative lg:left-1/6 flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[50rem] px-4 py-8 lg:p-8 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)]">
          <div className="lg:max-w-3xl lg:mx-auto text-center">
            <h5 className="text-primary text-xl lg:text-3xl pb-4 uppercase">
              <ContentSdkText field={props.fields.Eyebrow} />
            </h5>
            <h1 className="text-4xl lg:text-7xl uppercase">
              <ContentSdkText field={props.fields.Title} />
            </h1>
            <div className="mt-8">
              <ContentSdkLink
                field={props.fields.Link1}
                prefetch={false}
                className="btn btn-primary mr-4"
              />
              <ContentSdkLink
                field={props.fields.Link2}
                prefetch={false}
                className="btn btn-secondary"
              />
            </div>
          </div>
        </div>
        <div
          className={`lg:absolute top-0 bottom-0 left-5/6`}
          style={{ right: `-${rightOffset - 16}px` }}
        >
          <ContentSdkImage
            field={props.fields.Image1}
            width={1920}
            height={1080}
            className="aspect-7/4 lg:aspect-auto w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export const SplitScreen = (props: PageHeaderSTProps) => {
  return (
    <section
      className={`relative bg-primary border-8 lg:border-16 border-background ${props.params.styles}`}
      data-class-change
    >
      <div className="flex flex-col lg:flex-row lg:min-h-[50rem]">
        <div className="p-8 lg:basis-full lg:self-center lg:p-14">
          <h5 className="text-xl lg:text-3xl pb-4 uppercase">
            <ContentSdkText field={props.fields.Eyebrow} />
          </h5>
          <h1 className="text-4xl lg:text-6xl uppercase">
            <ContentSdkText field={props.fields.Title} />
          </h1>
          <div className="mt-8">
            <ContentSdkLink
              field={props.fields.Link1}
              prefetch={false}
              className="btn btn-secondary mr-4"
            />
            <ContentSdkLink
              field={props.fields.Link2}
              prefetch={false}
              className="btn btn-secondary"
            />
          </div>
        </div>
        <div className="relative aspect-3/2 lg:basis-full lg:aspect-auto">
          <ContentSdkImage
            field={props.fields.Image1}
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative h-full backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)] z-20">
            <div className="absolute  inset-8 lg:inset-14">
              <ContentSdkImage
                field={props.fields.Image1}
                width={1920}
                height={1080}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Stacked = (props: PageHeaderSTProps) => {
  return (
    <section
      className={`relative flex flex-col bg-primary lg:flex-row lg:items-center lg:min-h-[50rem] lg:bg-transparent ${props.params.styles}`}
      data-class-change
    >
      <div className="container px-4 mx-auto">
        <div className="relative lg:w-1/2 px-6 py-12 bg-primary z-20">
          <h5 className="text-xl lg:text-3xl pb-4 uppercase">
            <ContentSdkText field={props.fields.Eyebrow} />
          </h5>
          <h1 className="text-4xl lg:text-6xl uppercase">
            <ContentSdkText field={props.fields.Title} />
          </h1>
          <div className="mt-8">
            <ContentSdkLink
              field={props.fields.Link1}
              prefetch={false}
              className="btn btn-secondary mr-4"
            />
            <ContentSdkLink
              field={props.fields.Link2}
              prefetch={false}
              className="btn btn-secondary"
            />
          </div>
        </div>
      </div>
      <div className="relative aspect-3/2 lg:absolute lg:aspect-auto inset-0 flex z-10">
        <div className="relative w-1/3">
          <ContentSdkImage
            field={props.fields.Image2}
            width={1920}
            height={1080}
            className="absolute w-full h-full inset-0 object-cover"
          />
        </div>
        <div className="relative w-2/3">
          <ContentSdkImage
            field={props.fields.Image1}
            width={1920}
            height={1080}
            className="absolute w-full h-full inset-0 object-cover z-10"
          />
          <div className="absolute inset-0 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)] z-20">
            <ContentSdkImage
              field={props.fields.Image1}
              width={1920}
              height={1080}
              className="absolute w-[calc(100%-5rem)] h-full left-20 top-0 right-0 bottom-0 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
