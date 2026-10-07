'use client';

import { JSX } from 'react';
import { Field, ImageField, NextImage, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

interface TestimonialFields {
  Rating: Field<string>;
  Content: Field<string>;
  AuthorName: Field<string>;
  AuthorPosition: Field<string>;
  AuthorImage: ImageField;
}

export type TestimonialItemProps = {
  fields: TestimonialFields;
  name: string;
  url: string;
};

export type TestimonialsProps = {
  params: { [key: string]: string };
  fields: {
    items: TestimonialItemProps[];
  };
};

const StarRating = ({ item }: { item: TestimonialItemProps }): JSX.Element => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  const rating = item.fields?.Rating.value;
  const ratingField = isPageEditing && <Text field={item.fields?.Rating} />;

  if (!rating) return <></>;

  const maxStars = 5;
  const filledStars = Math.min(parseInt(rating), maxStars);
  const emptyStars = maxStars - filledStars;

  return (
    <div className="star-rating">
      {[...Array(filledStars)].map((_, index) => (
        <span key={index} className="star star-filled"></span>
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <span key={index} className="star star-empty"></span>
      ))}
      <span>{ratingField}</span>
    </div>
  );
};

const Testimonial = ({ item }: { item: TestimonialItemProps }): JSX.Element => {
  return (
    <div className="testimonial-item">
      <StarRating item={item} />
      <blockquote className="testimonial-content mt-5 mb-4">
        <Text field={item.fields.Content} />
      </blockquote>
      <div className="row align-items-center">
        <div className="col-auto">
          <NextImage
            field={item.fields.AuthorImage}
            className="author-image"
            width={100}
            height={100}
          />
        </div>
        <div className="col">
          <p className="author-name fs-4 fw-bold mb-1">
            <Text field={item.fields.AuthorName} />
          </p>
          <p className="author-position mb-0">
            <Text field={item.fields.AuthorPosition} />
          </p>
        </div>
      </div>
    </div>
  );
};

export const Default = (props: TestimonialsProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const testimonials = props.fields?.items;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`component testimonials ${sxaStyles}`} id={id ? id : undefined}>
      <div className="">
        <Swiper
          effect="coverflow"
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
          }}
          spaceBetween={0}
          slidesPerView={1}
          breakpoints={{
            992: {
              slidesPerView: 3,
            },
          }}
          pagination={{
            clickable: true,
          }}
          centeredSlides={true}
          loop={testimonials.length > 3}
          grabCursor={true}
          modules={[Autoplay, EffectCoverflow, Pagination]}
        >
          {testimonials?.map((item, i) => (
            <SwiperSlide key={`${item.url}${i}`}>
              <Testimonial key={item.url} item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
