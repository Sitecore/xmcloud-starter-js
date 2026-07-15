// Mock props with car-related content for Alaris
export const mockCarouselProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: { value: 'Featured Vehicles' },
        },
        tagLine: {
          jsonValue: { value: 'Discover Your Perfect Car' },
        },
        children: {
          results: [
            {
              id: 'slide-1',
              title: {
                jsonValue: { value: 'Alaris Sedan 2024' },
              },
              bodyText: {
                jsonValue: { value: 'Luxury meets performance in our flagship sedan.' },
              },
              slideImage: {
                jsonValue: {
                  value: {
                    src: '/images/sedan-2024.jpg',
                    alt: 'Alaris Sedan 2024',
                    width: 1920,
                    height: 500,
                  },
                },
              },
              callToAction: {
                jsonValue: {
                  value: {
                    href: '/vehicles/sedan',
                    text: 'Learn More',
                    linktype: 'internal',
                  },
                },
              },
            },
            {
              id: 'slide-2',
              title: {
                jsonValue: { value: 'Alaris SUV Sport' },
              },
              bodyText: {
                jsonValue: { value: 'Adventure awaits with our versatile SUV.' },
              },
              slideImage: {
                jsonValue: {
                  value: {
                    src: '/images/suv-sport.jpg',
                    alt: 'Alaris SUV Sport',
                    width: 1920,
                    height: 500,
                  },
                },
              },
              callToAction: {
                jsonValue: {
                  value: {
                    href: '/vehicles/suv',
                    text: 'Discover',
                    linktype: 'internal',
                  },
                },
              },
            },
            {
              id: 'slide-3',
              title: {
                jsonValue: { value: 'Alaris Electric' },
              },
              bodyText: {
                jsonValue: { value: 'The future of driving is here.' },
              },
              slideImage: {
                jsonValue: {
                  value: {
                    src: '/images/electric.jpg',
                    alt: 'Alaris Electric Vehicle',
                    width: 1920,
                    height: 500,
                  },
                },
              },
              callToAction: {
                jsonValue: {
                  value: {
                    href: '/vehicles/electric',
                    text: 'Explore',
                    linktype: 'internal',
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
  params: {
    styles: 'car-carousel',
  },
};

// Mock props with single car
export const mockCarouselPropsSingle = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: { value: 'New Arrival' },
        },
        tagLine: {
          jsonValue: { value: 'Latest Model' },
        },
        children: {
          results: [
            {
              id: 'slide-single',
              title: {
                jsonValue: { value: 'Alaris Coupe' },
              },
              bodyText: {
                jsonValue: { value: 'Style meets speed.' },
              },
              slideImage: {
                jsonValue: {
                  value: {
                    src: '/images/coupe.jpg',
                    alt: 'Alaris Coupe',
                    width: 1920,
                    height: 500,
                  },
                },
              },
              callToAction: {
                jsonValue: {
                  value: {
                    href: '/vehicles/coupe',
                    text: 'View Details',
                    linktype: 'internal',
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
  params: {
    styles: 'single-car',
  },
};

// Mock props with minimal data
export const mockCarouselPropsMinimal = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: { value: 'Cars' },
        },
        tagLine: {
          jsonValue: { value: 'Available Models' },
        },
        children: {
          results: [
            {
              id: 'car-1',
              title: {
                jsonValue: { value: 'Car Model 1' },
              },
              bodyText: {
                jsonValue: { value: 'Great car for everyone.' },
              },
              slideImage: {
                jsonValue: {
                  value: {
                    src: '/images/car1.jpg',
                    alt: 'Car 1',
                    width: 800,
                    height: 400,
                  },
                },
              },
              callToAction: {
                jsonValue: {
                  value: {
                    href: '/car1',
                    text: 'View',
                    linktype: 'internal',
                  },
                },
              },
            },
            {
              id: 'car-2',
              title: {
                jsonValue: { value: 'Car Model 2' },
              },
              bodyText: {
                jsonValue: { value: 'Another excellent choice.' },
              },
              slideImage: {
                jsonValue: {
                  value: {
                    src: '/images/car2.jpg',
                    alt: 'Car 2',
                    width: 800,
                    height: 400,
                  },
                },
              },
              callToAction: {
                jsonValue: {
                  value: {
                    href: '/car2',
                    text: 'View',
                    linktype: 'internal',
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
  params: {},
};

// Mock props with no slides for empty state testing
export const mockCarouselPropsEmpty = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: { value: 'No Cars Available' },
        },
        tagLine: {
          jsonValue: { value: 'Check Back Soon' },
        },
        children: {
          results: [],
        },
      },
    },
  },
  params: {
    styles: 'empty-carousel',
  },
};
