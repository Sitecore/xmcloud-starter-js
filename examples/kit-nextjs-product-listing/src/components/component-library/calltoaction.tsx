import { Button } from 'shadcn/components/ui/button';
import {
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  Image as ContentSdkImage,
  ImageField,
  Field,
  LinkField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  CTATitle: Field<string>;
  CTABody: Field<string>;
  CTALink1: LinkField;
  CTALink2: LinkField;
  CTAImage: ImageField;
}

type CTAProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: CTAProps) => {
  return <CallToAction1 {...props} />;
};

export const CallToAction1 = (props: CTAProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section className={`px-[5%] py-12 md:py-24 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="py-3 md:py-4">
          <div className="auto-cols-1fr grid grid-cols-1 gap-2.5">
            <div className="align-start relative flex flex-col justify-center p-12">
              <div className="w-full max-w-3xl">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <ContentSdkText field={props.fields.CTATitle} />
                  </h1>
                </div>
                <div>
                  <ContentSdkRichText field={props.fields.CTABody} />
                </div>
              </div>
              <div className="mt-8">
                <div className="align-center grid-col-1 md:grid-col-2 flex grid flex-wrap gap-4">
                  {props.fields.CTALink1?.value?.href || isEditing ? (
                    <Button
                      className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                      asChild={true}
                    >
                      <ContentSdkLink field={props.fields.CTALink1} prefetch={false} />
                    </Button>
                  ) : null}
                  {props.fields.CTALink2?.value?.href || isEditing ? (
                    <Button
                      variant="outline"
                      className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                      asChild={true}
                    >
                      <ContentSdkLink field={props.fields.CTALink2} prefetch={false} />
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className="-z-1 absolute bottom-0 left-0 right-0 top-0">
                <div className="z-1 position-absolute bottom-0 left-0 right-0 top-0 bg-black/50"></div>
                <ContentSdkImage
                  field={props.fields.CTAImage}
                  className="absolute bottom-0 left-0 right-0 top-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CallToAction2 = (props: CTAProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section className={`px-[5%] py-12 md:py-24 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="py-3 md:py-4">
          <div className="grid-rows-auto align-center grid grid-cols-1 items-center gap-20 md:grid-cols-2">
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
                  <ContentSdkText field={props.fields.CTATitle} />
                </h1>
              </div>
              <div>
                <ContentSdkRichText field={props.fields.CTABody} />
              </div>
              <div className="mt-8">
                <div className="align-center grid-cols-1 md:grid-cols-2 flex grid flex-wrap gap-4">
                  {props.fields.CTALink1?.value?.href || isEditing ? (
                    <Button
                      className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                      asChild={true}
                    >
                      <ContentSdkLink field={props.fields.CTALink1} prefetch={false} />
                    </Button>
                  ) : null}
                  {props.fields.CTALink2?.value?.href || isEditing ? (
                    <Button
                      variant="outline"
                      className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                      asChild={true}
                    >
                      <ContentSdkLink field={props.fields.CTALink2} prefetch={false} />
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
            <div>
              <ContentSdkImage field={props.fields.CTAImage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CallToAction3 = (props: CTAProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section className={`px-[5%] py-12 md:py-24 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="py-3 md:py-4">
          <div className="grid-rows-auto align-center grid grid-cols-1 items-center gap-20 md:grid-cols-2">
            <div>
              <ContentSdkImage field={props.fields.CTAImage} />
            </div>
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
                  <ContentSdkText field={props.fields.CTATitle} />
                </h1>
              </div>
              <div>
                <ContentSdkRichText field={props.fields.CTABody} />
              </div>
              <div className="mt-8">
                <div className="align-center grid-cols-1 md:grid-cols-2 flex grid flex-wrap gap-4">
                  {props.fields.CTALink1?.value?.href || isEditing ? (
                    <Button
                      className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                      asChild={true}
                    >
                      <ContentSdkLink field={props.fields.CTALink1} prefetch={false} />
                    </Button>
                  ) : null}
                  {props.fields.CTALink2?.value?.href || isEditing ? (
                    <Button
                      variant="outline"
                      className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                      asChild={true}
                    >
                      <ContentSdkLink field={props.fields.CTALink2} prefetch={false} />
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CallToAction4 = (props: CTAProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section className={`px-[5%] py-12 md:py-24 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="py-3 md:py-4">
          {/* Row 1: Title and Content */}
          <div className="grid-rows-auto grid grid-cols-1 items-start gap-8 md:grid-cols-2 mb-12">
            {/* Left Column - Title */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
                <ContentSdkText field={props.fields.CTATitle} />
              </h1>
            </div>
            {/* Right Column - Body and Buttons */}
            <div>
              <div className="mb-8">
                <ContentSdkRichText field={props.fields.CTABody} />
              </div>
              <div className="align-center grid-cols-1 md:grid-cols-2 flex grid flex-wrap gap-4">
                {props.fields.CTALink1?.value?.href || isEditing ? (
                  <Button
                    className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                    asChild={true}
                  >
                    <ContentSdkLink field={props.fields.CTALink1} prefetch={false} />
                  </Button>
                ) : null}
                {props.fields.CTALink2?.value?.href || isEditing ? (
                  <Button
                    variant="outline"
                    className="h-14 w-full px-8 text-lg md:h-10 md:w-auto md:px-4 md:text-sm"
                    asChild={true}
                  >
                    <ContentSdkLink field={props.fields.CTALink2} prefetch={false} />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
          {/* Row 2: Full-width Image */}
          <div className="w-full">
            <ContentSdkImage field={props.fields.CTAImage} className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};
