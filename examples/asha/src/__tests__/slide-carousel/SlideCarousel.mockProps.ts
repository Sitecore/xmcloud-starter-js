import React from 'react';

type SlideCarouselProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

// Mock children for carousel items (using React.createElement to avoid JSX compilation issues in mock files)
export const createMockSlideChildren = () => [
  React.createElement('div', { key: 'slide-1', 'data-testid': 'slide-1' }, 'Slide 1 Content'),
  React.createElement('div', { key: 'slide-2', 'data-testid': 'slide-2' }, 'Slide 2 Content'),
  React.createElement('div', { key: 'slide-3', 'data-testid': 'slide-3' }, 'Slide 3 Content'),
];

export const createSingleSlideChildren = () => [
  React.createElement(
    'div',
    { key: 'single-slide', 'data-testid': 'single-slide' },
    'Single Slide Content'
  ),
];

export const createManySlideChildren = () => [
  React.createElement('div', { key: 'slide-1', 'data-testid': 'slide-1' }, 'Slide 1'),
  React.createElement('div', { key: 'slide-2', 'data-testid': 'slide-2' }, 'Slide 2'),
  React.createElement('div', { key: 'slide-3', 'data-testid': 'slide-3' }, 'Slide 3'),
  React.createElement('div', { key: 'slide-4', 'data-testid': 'slide-4' }, 'Slide 4'),
  React.createElement('div', { key: 'slide-5', 'data-testid': 'slide-5' }, 'Slide 5'),
  React.createElement('div', { key: 'slide-6', 'data-testid': 'slide-6' }, 'Slide 6'),
];

// Default props for SlideCarousel
export const defaultSlideCarouselProps: SlideCarouselProps = {
  title: 'Featured Products',
  description: 'Discover our latest collection of premium audio equipment',
  children: createMockSlideChildren(),
  className: 'featured-carousel',
};

// Props without optional fields
export const slideCarouselPropsMinimal: SlideCarouselProps = {
  children: createMockSlideChildren(),
};

// Props with custom styling
export const slideCarouselPropsCustom: SlideCarouselProps = {
  title: 'Premium Audio Collection',
  description: 'Explore professional-grade headphones, speakers, and audio accessories',
  children: createMockSlideChildren(),
  className: 'custom-carousel premium-styling dark-theme',
};

// Props with single slide
export const slideCarouselPropsSingleSlide: SlideCarouselProps = {
  title: 'Single Product Highlight',
  description: 'Featured product of the month',
  children: createSingleSlideChildren(),
  className: 'single-slide-carousel',
};

// Props with many slides
export const slideCarouselPropsManySlides: SlideCarouselProps = {
  title: 'Complete Product Range',
  description: 'Browse our extensive catalog of audio equipment and accessories',
  children: createManySlideChildren(),
  className: 'full-catalog-carousel',
};

// Props with empty children
export const slideCarouselPropsNoChildren: SlideCarouselProps = {
  title: 'Empty Carousel',
  description: 'No content available',
  children: [],
  className: 'empty-carousel',
};

// Props with long text content
export const slideCarouselPropsLongText: SlideCarouselProps = {
  title: 'SYNC Audio Professional Equipment Store - Premium Collection of High-Quality Audio Gear',
  description:
    'Discover our comprehensive selection of professional-grade audio equipment including studio-quality headphones, reference monitors, premium speakers, audio interfaces, microphones, and specialized accessories designed for musicians, producers, audio engineers, and discerning music enthusiasts who demand exceptional sound quality and reliable performance for recording, mixing, mastering, live performances, and critical listening applications.',
  children: createMockSlideChildren(),
  className: 'long-text-carousel professional-equipment-showcase premium-collection-display',
};

// Props with special characters
export const slideCarouselPropsSpecialChars: SlideCarouselProps = {
  title: 'SYNC™ Àudio - Prémium Équipment & Spëcialty Gëar',
  description:
    'Découvrez notre collection "premium" d\'équipements audio <professionnels> & accessoires spécialisés.',
  children: [
    React.createElement(
      'div',
      { key: 'special-1', 'data-testid': 'special-slide-1' },
      'Prodüct Ønë - Spëciäl Chäractërs'
    ),
    React.createElement(
      'div',
      { key: 'special-2', 'data-testid': 'special-slide-2' },
      'Prodüct Twö - Ümlauts & Äccents'
    ),
  ],
  className: 'spëcial-chars-carousel',
};
