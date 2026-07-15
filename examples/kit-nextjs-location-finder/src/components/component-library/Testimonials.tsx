import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'shadcn/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  Page,
} from '@sitecore-content-sdk/nextjs';
import { IGQLImageField, IGQLLinkField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';
import { useMemo, type JSX } from 'react';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Button } from 'shadcd/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'shadcd/components/ui/tabs';

interface Fields {
  data: {
    datasource: {
      children: {
        results: TestimonialFields[];
      };
      title: IGQLTextField;
      tagLine: IGQLTextField;
    };
  };
}

interface TestimonialFields {
  id: string;
  caseStudyLink: IGQLLinkField;
  customerName: IGQLTextField;
  customerCompany: IGQLTextField;
  customerIcon: IGQLImageField;
  testimonialBody: IGQLRichTextField;
  testimonialIcon: IGQLImageField;
  testimonialRating: IGQLTextField;
}

type TestimonialsProps = {
  params: { [key: string]: string };
  fields: Fields;
  page: Page;
};

type TestimonialCardProps = {
  testimonial: TestimonialFields;
  type: 'simple' | 'centered' | 'boxed' | 'large';
  withRating?: boolean;
  withLogo?: boolean;
  className?: string;
  page: Page;
};

const StarRating = ({ r: ratingField, page }: { r: IGQLTextField; page: Page }) => {
  const { isEditing } = page.mode;

  const rating = Math.min(Number(ratingField.jsonValue?.value) || 0, 5);
  const filledStars = Array.from({ length: rating }, (_, index) => (
    <FontAwesomeIcon icon={faStar} width={24} key={`filled-${index}`} />
  ));
  const emptyStars = Array.from({ length: 5 - rating }, (_, index) => (
    <FontAwesomeIcon icon={faStarOutline} width={24} key={`empty-${index}`} />
  ));

  return (
    <div className="flex gap-1 mb-6">
      {[...filledStars, ...emptyStars]}
      {isEditing && <ContentSdkText field={ratingField.jsonValue} />}
    </div>
  );
};

const TestimonialCard = (props: TestimonialCardProps) => {
  const testimonialHeader = useMemo(() => {
    return (
      <>
        {props.withRating ? (
          <StarRating r={props.testimonial.testimonialRating} page={props.page} />
        ) : props.withLogo ? (
          <div className="h-12 mb-12">
            <ContentSdkImage
              field={props.testimonial.testimonialIcon?.jsonValue}
              width={300}
              height={48}
              className="h-full w-auto object-contain"
            />
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }, [
    props.withRating,
    props.testimonial.testimonialRating,
    props.testimonial.testimonialIcon?.jsonValue,
    props.withLogo,
    props.page,
  ]);

  const testimonialAuthorCard = useMemo(() => {
    const author = (
      <>
        {props.type !== 'large' && (
          <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden">
            <ContentSdkImage
              field={props.testimonial.customerIcon?.jsonValue}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <div className="font-semibold">
            <ContentSdkText field={props.testimonial.customerName?.jsonValue} />
          </div>
          <div>
            <ContentSdkText field={props.testimonial.customerCompany?.jsonValue} />
          </div>
        </div>
      </>
    );

    return props.withRating && props.withLogo ? (
      <div className="flex mt-auto gap-4">
        <div className="flex items-center gap-4">{author}</div>
        <div className="h-12 border-s ps-4">
          <ContentSdkImage
            field={props.testimonial.testimonialIcon?.jsonValue}
            width={300}
            height={48}
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
    ) : (
      <div
        className={`flex gap-4 mt-auto ${
          props.type === 'centered' ? 'flex-col items-center text-center' : ''
        }`}
      >
        {author}
      </div>
    );
  }, [
    props.testimonial.customerCompany?.jsonValue,
    props.testimonial.customerIcon?.jsonValue,
    props.testimonial.customerName?.jsonValue,
    props.testimonial.testimonialIcon?.jsonValue,
    props.type,
    props.withLogo,
    props.withRating,
  ]);

  switch (props.type) {
    case 'boxed':
      return (
        <div className={`flex flex-col border p-8 ${props.className}`}>
          {testimonialHeader}
          <blockquote className="text-lg mb-6">
            <ContentSdkRichText field={props.testimonial.testimonialBody?.jsonValue} />
          </blockquote>
          {testimonialAuthorCard}
          <Button asChild variant={'link'} className="self-start px-0 mt-6">
            <ContentSdkLink
              field={props.testimonial.caseStudyLink?.jsonValue}
              className="inline-flex items-center"
              prefetch={false}
            >
              {props.testimonial.caseStudyLink?.jsonValue.value.text}
              <ArrowRight className="h-4 w-4" />
            </ContentSdkLink>
          </Button>
        </div>
      );
    case 'centered':
      return (
        <div className={`flex flex-col items-center max-w-3xl mx-auto ${props.className}`}>
          {testimonialHeader}
          <blockquote className="text-xl font-bold mb-12 text-center">
            <ContentSdkRichText field={props.testimonial.testimonialBody?.jsonValue} />
          </blockquote>
          {testimonialAuthorCard}
          <Button asChild variant={'link'} className="mt-6">
            <ContentSdkLink
              field={props.testimonial.caseStudyLink?.jsonValue}
              className="inline-flex items-center"
              prefetch={false}
            >
              {props.testimonial.caseStudyLink?.jsonValue.value.text}
              <ArrowRight className="h-4 w-4" />
            </ContentSdkLink>
          </Button>
        </div>
      );
    case 'large':
      return (
        <div className={`grid md:grid-cols-2 items-center gap-x-20 gap-y-12 ${props.className}`}>
          <div>
            <ContentSdkImage
              field={props.testimonial.customerIcon?.jsonValue}
              width={700}
              height={700}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div>
            {testimonialHeader}
            <blockquote className="text-xl font-bold mb-6">
              <ContentSdkRichText field={props.testimonial.testimonialBody?.jsonValue} />
            </blockquote>
            {testimonialAuthorCard}
            <Button asChild variant={'link'} className="self-start px-0 mt-6">
              <ContentSdkLink
                field={props.testimonial.caseStudyLink?.jsonValue}
                className="inline-flex items-center"
                prefetch={false}
              >
                {props.testimonial.caseStudyLink?.jsonValue.value.text}
                <ArrowRight className="h-4 w-4" />
              </ContentSdkLink>
            </Button>
          </div>
        </div>
      );
    default:
      return (
        <div className={`flex flex-col ${props.className}`}>
          {testimonialHeader}
          <blockquote className="text-xl font-bold mb-6">
            <ContentSdkRichText field={props.testimonial.testimonialBody?.jsonValue} />
          </blockquote>
          {testimonialAuthorCard}
          <Button asChild variant={'link'} className="self-start px-0 mt-6">
            <ContentSdkLink
              field={props.testimonial.caseStudyLink?.jsonValue}
              className="inline-flex items-center"
              prefetch={false}
            >
              {props.testimonial.caseStudyLink?.jsonValue.value.text}
              <ArrowRight className="h-4 w-4" />
            </ContentSdkLink>
          </Button>
        </div>
      );
  }
};

export const Default = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource?.tagLine?.jsonValue} />
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-x-12 gap-y-20">
          {datasource?.children?.results?.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              type="centered"
              withLogo
              className="flex-1"
              page={props.page}
            />
          )) || []}
        </div>
      </div>
    </section>
  );
};

export const Testimonials1 = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource?.tagLine?.jsonValue} />
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-12">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {datasource?.children?.results?.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} type="centered" withLogo withRating page={props.page} />
                </CarouselItem>
              )) || []}
            </CarouselContent>
            <CarouselPrevious className="disabled:hidden" />
            <CarouselNext className="disabled:hidden" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export const Testimonials2 = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mb-20">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource?.tagLine?.jsonValue} />
          </p>
        </div>

        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent>
            {datasource?.children?.results?.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pr-4 md:basis-1/2">
                <TestimonialCard testimonial={testimonial} type="simple" withLogo withRating page={props.page} />
              </CarouselItem>
            )) || []}
          </CarouselContent>
          <div className="flex items-center gap-2 mt-8">
            <CarouselPrevious className="static translate-0 disabled:hidden" />
            <CarouselNext className="static translate-0 disabled:hidden" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export const Testimonials3 = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12 md:gap-20">
          <div className="md:mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource?.title?.jsonValue} />
            </h2>
            <p className="text-lg">
              <ContentSdkText field={datasource?.tagLine?.jsonValue} />
            </p>
          </div>

          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent>
              {datasource?.children?.results?.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pr-2 md:basis-3/4">
                  <TestimonialCard
                    testimonial={testimonial}
                    type="boxed"
                    withLogo
                    className="h-full"
                    page={props.page}
                  />
                </CarouselItem>
              )) || []}
            </CarouselContent>
            <div className="flex items-center gap-2 mt-8">
              <CarouselPrevious className="static translate-0" />
              <CarouselNext className="static translate-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export const Testimonials4 = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12 md:gap-20">
          <div className="md:mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource?.title?.jsonValue} />
            </h2>
            <p className="text-lg">
              <ContentSdkText field={datasource?.tagLine?.jsonValue} />
            </p>
          </div>

          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent>
              {datasource?.children?.results?.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} type="boxed" withRating page={props.page} />
                </CarouselItem>
              )) || []}
            </CarouselContent>
            <div className="flex items-center justify-end gap-2 mt-8">
              <CarouselPrevious className="static translate-0 disabled:hidden" />
              <CarouselNext className="static translate-0 disabled:hidden" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export const Testimonials5 = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mb-20">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource?.tagLine?.jsonValue} />
          </p>
        </div>

        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent>
            {datasource?.children?.results?.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} type="large" withLogo withRating page={props.page} />
              </CarouselItem>
            )) || []}
          </CarouselContent>
          <div className="flex items-center justify-end gap-2 mt-8">
            <CarouselPrevious className="static translate-0 disabled:hidden" />
            <CarouselNext className="static translate-0 disabled:hidden" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export const Testimonials6 = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource?.tagLine?.jsonValue} />
          </p>
        </div>
        <div className="md:columns-3 gap-8">
          {datasource?.children?.results?.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              type="boxed"
              withRating
              className="mb-8"
              page={props.page}
            />
          )) || []}
        </div>
      </div>
    </section>
  );
};

export const Testimonials7 = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource?.tagLine?.jsonValue} />
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-x-12 gap-y-20">
          {datasource?.children?.results?.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              type="boxed"
              withRating
              className="flex-1"
              page={props.page}
            />
          )) || []}
        </div>
      </div>
    </section>
  );
};

export const Testimonials8 = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mb-20">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource?.tagLine?.jsonValue} />
          </p>
        </div>

        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent>
            {datasource?.children?.results?.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2">
                <TestimonialCard
                  testimonial={testimonial}
                  type="boxed"
                  withLogo
                  withRating
                  className="h-full"
                  page={props.page}
                />
              </CarouselItem>
            )) || []}
          </CarouselContent>
          <div className="flex items-center justify-end gap-2 mt-8">
            <CarouselPrevious className="static translate-0 disabled:hidden" />
            <CarouselNext className="static translate-0 disabled:hidden" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export const Testimonials9 = (props: TestimonialsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data?.datasource, [props.fields.data?.datasource]);

  if (!props.fields) {
    return <NoDataFallback componentName="Testimonials" />;
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource?.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource?.tagLine?.jsonValue} />
          </p>
        </div>

        <Tabs defaultValue={datasource?.children?.results?.[0]?.id || ''} className="mt-20">
          <TabsList>
            {datasource?.children?.results?.map((testimonial) => (
              <TabsTrigger value={testimonial.id} key={testimonial.id}>
                <ContentSdkImage
                  field={testimonial.testimonialIcon?.jsonValue}
                  width={200}
                  height={32}
                  className="object-contain"
                />
              </TabsTrigger>
            )) || []}
          </TabsList>

          {datasource?.children?.results?.map((testimonial) => (
            <TabsContent value={testimonial.id} key={testimonial.id} className="py-16">
              <TestimonialCard testimonial={testimonial} type="centered" withRating page={props.page} />
            </TabsContent>
          )) || []}
        </Tabs>
      </div>
    </section>
  );
};
