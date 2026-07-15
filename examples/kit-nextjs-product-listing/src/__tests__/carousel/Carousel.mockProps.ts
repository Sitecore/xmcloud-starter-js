import type { IGQLImageField, IGQLLinkField, IGQLTextField } from '@/lib/component-props';

// Mock carousel slide
const mockSlide1 = {
  id: 'slide-1',
  callToAction: {
    jsonValue: {
      value: {
        href: '/sustainability',
        text: 'Learn More',
        linktype: 'internal',
      },
    },
  } as IGQLLinkField,
  title: {
    jsonValue: {
      value: 'Sustainable Energy',
    },
  } as IGQLTextField,
  bodyText: {
    jsonValue: {
      value: 'Committed to renewable energy sources',
    },
  } as IGQLTextField,
  slideImage: {
    jsonValue: {
      value: {
        src: '/test-slide-1.jpg',
        alt: 'Sustainable Energy',
      },
    },
  } as IGQLImageField,
};

const mockSlide2 = {
  id: 'slide-2',
  callToAction: {
    jsonValue: {
      value: {
        href: '/green-initiatives',
        text: 'Discover More',
        linktype: 'internal',
      },
    },
  } as IGQLLinkField,
  title: {
    jsonValue: {
      value: 'Green Initiatives',
    },
  } as IGQLTextField,
  bodyText: {
    jsonValue: {
      value: 'Leading the way in environmental conservation',
    },
  } as IGQLTextField,
  slideImage: {
    jsonValue: {
      value: {
        src: '/test-slide-2.jpg',
        alt: 'Green Initiatives',
      },
    },
  } as IGQLImageField,
};

const mockSlide3 = {
  id: 'slide-3',
  callToAction: {
    jsonValue: {
      value: {
        href: '/carbon-neutral',
        text: 'Read More',
        linktype: 'internal',
      },
    },
  } as IGQLLinkField,
  title: {
    jsonValue: {
      value: 'Carbon Neutral',
    },
  } as IGQLTextField,
  bodyText: {
    jsonValue: {
      value: 'Achieving net-zero emissions by 2030',
    },
  } as IGQLTextField,
  slideImage: {
    jsonValue: {
      value: {
        src: '/test-slide-3.jpg',
        alt: 'Carbon Neutral',
      },
    },
  } as IGQLImageField,
};

// Default carousel props
export const defaultCarouselProps = {
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        children: {
          results: [mockSlide1, mockSlide2, mockSlide3],
        },
        title: {
          jsonValue: {
            value: 'Sustainability Initiatives',
          },
        } as IGQLTextField,
        tagLine: {
          jsonValue: {
            value: 'Building a greener future',
          },
        } as IGQLTextField,
      },
    },
  },
};

// Carousel with single slide
export const carouselWithSingleSlide = {
  params: { styles: '' },
  fields: {
    data: {
      datasource: {
        children: {
          results: [mockSlide1],
        },
        title: {
          jsonValue: {
            value: 'Single Slide',
          },
        } as IGQLTextField,
        tagLine: {
          jsonValue: {
            value: 'One slide carousel',
          },
        } as IGQLTextField,
      },
    },
  },
};

// Carousel with custom styles
export const carouselWithStyles = {
  params: { styles: 'custom-carousel-class' },
  fields: {
    data: {
      datasource: {
        children: {
          results: [mockSlide1, mockSlide2],
        },
        title: {
          jsonValue: {
            value: 'Styled Carousel',
          },
        } as IGQLTextField,
        tagLine: {
          jsonValue: {
            value: 'With custom styling',
          },
        } as IGQLTextField,
      },
    },
  },
};
