import { Button } from '@/components/ui/button';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  ImageField,
  Field,
  LinkField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  HeroTitle: Field<string>;
  HeroBody: Field<string>;
  HeroLink1: LinkField;
  HeroLink2: LinkField;
  HeroImage1: ImageField;
  HeroImage2: ImageField;
}

type HeroProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: HeroProps) => {
  return <Hero1 {...props} />;
};

export const Hero1 = (props: HeroProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section
      className={`px-[5%] py-12 md:py-24 bg-primary ${props.params.styles}`}
      data-class-change
    >
      <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
        {/* Text Content */}
        <div className="flex flex-col space-y-8 md:col-span-4 md:space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-4xl xl:text-5xl">
            <ContentSdkText field={props.fields.HeroTitle} prefetch={false} />
          </h1>
          <div className="text-muted-foreground text-xl md:text-base">
            <ContentSdkRichText field={props.fields.HeroBody} />
          </div>
          <div className="flex gap-4 flex-wrap">
            {props.fields.HeroLink1.value.href || isEditing ? (
              <Button
                className="h-14 w-full md:w-auto px-8 text-lg md:h-10 md:px-4 md:text-sm"
                asChild={true}
              >
                <ContentSdkLink field={props.fields.HeroLink1} prefetch={false} />
              </Button>
            ) : null}
            {props.fields.HeroLink2.value.href || isEditing ? (
              <Button
                variant="outline"
                className="h-14 w-full md:w-auto px-8 text-lg md:h-10 md:px-4 md:text-sm"
                asChild={true}
              >
                <ContentSdkLink field={props.fields.HeroLink2} prefetch={false} />
              </Button>
            ) : null}
          </div>
        </div>

        {/* Images Container */}
        <div className="grid grid-cols-2 gap-4 md:col-span-8 md:grid-cols-8 md:gap-8">
          {/* Main Image */}
          <div className="relative col-span-1 h-[500px] md:col-span-5 md:h-[600px]">
            {props.fields.HeroImage1?.value?.src || isEditing ? (
              <ContentSdkImage
                field={props.fields.HeroImage1}
                className="max-h-full rounded-lg object-cover"
                width={500}
                height={1000}
                prefetch={false}
              />
            ) : null}
          </div>

          {/* Secondary Image */}
          <div className="relative col-span-1 h-[300px] max-h-[300px] md:col-span-3">
            {props.fields.HeroImage2?.value?.src || isEditing ? (
              <ContentSdkImage
                field={props.fields.HeroImage2}
                className="max-h-full rounded-lg object-cover"
                width={300}
                height={1000}
                prefetch={false}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Hero2 = (props: HeroProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section className={`px-[5%] py-12 md:py-24 ${props.params.styles}`} data-class-change>
      <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
        {/* Text Content */}
        <div className="flex flex-col space-y-8 md:col-span-6 md:space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-4xl xl:text-5xl">
            <ContentSdkText field={props.fields.HeroTitle} />
          </h1>
          <div className="text-muted-foreground text-xl md:text-base">
            <ContentSdkRichText field={props.fields.HeroBody} />
          </div>
          <div className="flex gap-4 flex-wrap">
            {props.fields.HeroLink1.value.href || isEditing ? (
              <Button
                className="h-14 w-full md:w-auto px-8 text-lg md:h-10 md:px-4 md:text-sm"
                asChild={true}
              >
                <ContentSdkLink field={props.fields.HeroLink1} />
              </Button>
            ) : null}
            {props.fields.HeroLink2.value.href || isEditing ? (
              <Button
                variant="outline"
                className="h-14 w-full md:w-auto px-8 text-lg md:h-10 md:px-4 md:text-sm"
                asChild={true}
              >
                <ContentSdkLink field={props.fields.HeroLink2} />
              </Button>
            ) : null}
          </div>
        </div>

        {/* Images Container */}
        <div className="gap-4 md:col-span-6 md:grid-cols-8 md:gap-8">
          {/* Main Image */}
          <div className="relative col-span-2">
            {props.fields.HeroImage1?.value?.src || isEditing ? (
              <ContentSdkImage
                field={props.fields.HeroImage1}
                className="object-cover"
                width={500}
                height={1000}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Hero3 = (props: HeroProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  const backgroundImageUrl = props.fields.HeroImage1?.value?.src;
  const backgroundStyle = {
    backgroundImage: `url('${backgroundImageUrl}')`,
    filter: 'brightness(0.6)',
  };

  return (
    <div
      className={`relative flex min-h-screen items-center overflow-hidden bg-zinc-600 px-[5%] ${props.params.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={backgroundStyle} />
      <div className="container relative z-10 mx-auto px-6 py-24 md:py-32 md:pl-16 lg:py-40 lg:pl-24">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            <ContentSdkText field={props.fields.HeroTitle} />
          </h1>
          <div className="text-lg leading-relaxed text-white/90">
            <ContentSdkRichText field={props.fields.HeroBody} />
          </div>
          <div className="flex flex-wrap gap-4">
            {props.fields.HeroLink1.value.href || isEditing ? (
              <Button
                className="bg-white w-full md:w-auto text-zinc-900 hover:bg-white/90"
                asChild={true}
              >
                <ContentSdkLink field={props.fields.HeroLink1} />
              </Button>
            ) : null}
            {props.fields.HeroLink2.value.href || isEditing ? (
              <Button
                variant="outline"
                className="border-white w-full md:w-auto text-white hover:bg-white/10"
                asChild={true}
              >
                <ContentSdkLink field={props.fields.HeroLink2} />
              </Button>
            ) : null}
          </div>
          {isEditing ? (
            <div className="flex gap-4">
              <p className="text-lg leading-relaxed text-white/90">
                To change teh background image, edit the image field in the content item:
              </p>
              <ContentSdkImage
                field={props.fields.HeroImage1}
                className="rounded-lg object-cover"
                width={150}
                height={150}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const Hero4 = (props: HeroProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section className={`w-full px-[5%] ${props.params.styles}`} data-class-change>
      <div className="relative mb-12 h-[400px] w-full">
        {/* Main Image */}
        {props.fields.HeroImage1?.value?.src || isEditing ? (
          <ContentSdkImage
            field={props.fields.HeroImage1}
            className="h-full object-cover"
            width={1920}
            height={500}
          />
        ) : null}
      </div>
      {/* Text Content */}
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl items-start gap-4 md:grid-cols-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <ContentSdkText field={props.fields.HeroTitle} />
          </h1>
          <div className="space-y-6">
            <div className="text-muted-foreground text-lg">
              <ContentSdkRichText field={props.fields.HeroBody} />
            </div>
            <div className="flex gap-4 flex-wrap">
              {props.fields.HeroLink1.value.href || isEditing ? (
                <Button
                  className="h-14 w-full md:w-auto px-8 text-lg md:h-10 md:px-4 md:text-sm"
                  asChild={true}
                >
                  <ContentSdkLink field={props.fields.HeroLink1} />
                </Button>
              ) : null}
              {props.fields.HeroLink2.value.href || isEditing ? (
                <Button
                  variant="outline"
                  className="h-14 w-full md:w-auto px-8 text-lg md:h-10 md:px-4 md:text-sm"
                  asChild={true}
                >
                  <ContentSdkLink field={props.fields.HeroLink2} />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Hero5 = (props: HeroProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section className={`px-[5%] py-12 md:py-24 ${props.params.styles}`} data-class-change>
      <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
        {/* Images Container */}
        <div className="gap-4 md:col-span-6 md:grid-cols-8 md:gap-8">
          {/* Main Image */}
          <div className="relative col-span-2">
            {props.fields.HeroImage1?.value?.src || isEditing ? (
              <ContentSdkImage
                field={props.fields.HeroImage1}
                className="object-cover"
                width={500}
                height={1000}
              />
            ) : null}
          </div>
        </div>
        {/* Text Content */}
        <div className="flex flex-col space-y-8 md:col-span-6 md:space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-4xl xl:text-5xl">
            <ContentSdkText field={props.fields.HeroTitle} />
          </h1>
          <div className="text-muted-foreground text-xl md:text-base">
            <ContentSdkRichText field={props.fields.HeroBody} />
          </div>
          <div className="flex gap-4 flex-wrap">
            {props.fields.HeroLink1.value.href || isEditing ? (
              <Button
                className="h-14 w-full md:w-auto px-8 text-lg md:h-10 md:px-4 md:text-sm"
                asChild={true}
              >
                <ContentSdkLink field={props.fields.HeroLink1} />
              </Button>
            ) : null}
            {props.fields.HeroLink2.value.href || isEditing ? (
              <Button
                variant="outline"
                className="h-14 w-full md:w-auto px-8 text-lg md:h-10 md:px-4 md:text-sm"
                asChild={true}
              >
                <ContentSdkLink field={props.fields.HeroLink2} />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Hero6 = (props: HeroProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section className={`px-[5%] ${props.params.styles}`} data-class-change>
      <div className="container mx-auto py-[7rem]">
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 md:grid-cols-2">
          {/* Text Content */}
          <div className="m-0">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              <ContentSdkText field={props.fields.HeroTitle} />
            </h1>
            <div className="text-muted-foreground mb-6 text-xl md:text-base">
              <ContentSdkRichText field={props.fields.HeroBody} />
            </div>
            <div className="flex flex-wrap gap-4">
              {props.fields.HeroLink1.value.href || isEditing ? (
                <Button
                  className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                  asChild={true}
                >
                  <ContentSdkLink field={props.fields.HeroLink1} />
                </Button>
              ) : null}
              {props.fields.HeroLink2.value.href || isEditing ? (
                <Button
                  variant="outline"
                  className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                  asChild={true}
                >
                  <ContentSdkLink field={props.fields.HeroLink2} />
                </Button>
              ) : null}
            </div>
          </div>

          {/* Images Container */}
          <div className="relative flex w-full">
            {/* Main Image */}
            <div className="mr-[30%]">
              {props.fields.HeroImage1?.value?.src || isEditing ? (
                <ContentSdkImage
                  field={props.fields.HeroImage1}
                  className="aspect-2/3 h-fulli w-full max-w-full object-cover"
                  width={500}
                  height={1000}
                />
              ) : null}
            </div>

            {/* Secondary Image */}
            <div className="absolute bottom-auto left-auto right-0 top-[10%] w-1/2 shadow-md">
              {props.fields.HeroImage2?.value?.src || isEditing ? (
                <ContentSdkImage
                  field={props.fields.HeroImage2}
                  className="aspect-square h-full max-h-full w-full object-cover"
                  width={300}
                  height={1000}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
