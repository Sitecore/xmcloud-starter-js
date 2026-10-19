/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as FeatureBannerDefault,
  Vertical as FeatureBannerVertical,
  Accent as FeatureBannerAccent,
  SolidColorColumns as FeatureBannerSolidColorColumns,
} from '@/components/site-three/FeatureBanner';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  Link: ({ field, className, style, children, ...props }: any) => (
    <a href={field?.value?.href || field?.value?.url || ''} className={className} style={style} {...props}>
      {field?.value?.text || children || ''}
    </a>
  ),
}));

describe('FeatureBanner', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      data: {
        datasource: {
          title: {
            jsonValue: {
              value: 'Our Features',
            },
          },
          link: {
            jsonValue: {
              value: {
                href: '/features',
                text: 'Learn More',
              },
            },
          },
          children: {
            results: [
              {
                id: 'feature-1',
                image: {
                  jsonValue: {
                    value: {
                      src: '/icons/feature1.svg',
                      alt: 'Feature 1',
                    },
                  },
                },
                heading: {
                  jsonValue: {
                    value: 'High Quality',
                  },
                },
              },
              {
                id: 'feature-2',
                image: {
                  jsonValue: {
                    value: {
                      src: '/icons/feature2.svg',
                      alt: 'Feature 2',
                    },
                  },
                },
                heading: {
                  jsonValue: {
                    value: 'Fast Delivery',
                  },
                },
              },
              {
                id: 'feature-3',
                image: {
                  jsonValue: {
                    value: {
                      src: '/icons/feature3.svg',
                      alt: 'Feature 3',
                    },
                  },
                },
                heading: {
                  jsonValue: {
                    value: '24/7 Support',
                  },
                },
              },
            ],
          },
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders feature banner with title', () => {
      render(<FeatureBannerDefault {...mockProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });

    it('renders all feature items', () => {
      render(<FeatureBannerDefault {...mockProps} />);
      expect(screen.getByText('High Quality')).toBeInTheDocument();
      expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });

    it('renders feature icons', () => {
      render(<FeatureBannerDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });

    it('handles empty children results', () => {
      const emptyProps = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [],
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...emptyProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });

    it('handles null datasource', () => {
      const missingDatasourceProps: any = {
        params: {},
        fields: {
          data: {
            datasource: null,
          },
        },
      };
      render(<FeatureBannerDefault {...missingDatasourceProps} />);
      // Check that the section still renders
      expect(document.querySelector('section')).toBeInTheDocument();
    });

    it('applies dark theme styles from the Dark Theme styling parameter', () => {
      const darkThemeProps = {
        ...mockProps,
        params: {
          styles: 'dark-theme',
        },
      };
      render(<FeatureBannerDefault {...darkThemeProps} />);

      const section = document.querySelector('section');
      expect(section).toHaveAttribute('data-feature-banner-theme', 'dark');
      expect(section).toHaveClass('bg-primary');
      expect(section).not.toHaveClass('uppercase');
    });

    it('distributes feature items evenly across the remaining width', () => {
      render(<FeatureBannerDefault {...mockProps} />);

      const itemsRow = screen.getByTestId('feature-banner-items');
      expect(itemsRow).toHaveClass('w-full', 'flex-1', 'flex-wrap', 'justify-evenly');
      expect(itemsRow).not.toHaveClass('lg:flex-nowrap');
      expect(itemsRow.firstElementChild).toHaveClass('flex-1', 'basis-0');
    });

    it('handles missing title field', () => {
      const missingTitleProps: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              title: undefined,
            },
          },
        },
      };
      render(<FeatureBannerDefault {...missingTitleProps} />);
      // Should still render the component structure
      expect(document.querySelector('section')).toBeInTheDocument();
      // Should still render the feature items
      expect(screen.getByText('High Quality')).toBeInTheDocument();
    });

    it('handles null children results', () => {
      const nullChildrenProps: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: null,
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...nullChildrenProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });
  });

  describe('Vertical variant', () => {
    it('renders Vertical layout correctly', () => {
      render(<FeatureBannerVertical {...mockProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
      expect(screen.getByText('High Quality')).toBeInTheDocument();
    });

    it('renders all features in Vertical layout', () => {
      render(<FeatureBannerVertical {...mockProps} />);
      expect(screen.getByText('High Quality')).toBeInTheDocument();
      expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });

    it('handles empty results in Vertical layout', () => {
      const emptyProps = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [],
              },
            },
          },
        },
      };
      render(<FeatureBannerVertical {...emptyProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });

    it('renders a bold title, subtitle, and circular images', () => {
      render(
        <FeatureBannerVertical
          {...mockProps}
          fields={{
            data: {
              datasource: {
                ...mockProps.fields.data.datasource,
                subTitle: {
                  jsonValue: { value: 'Explore Our Product Categories' },
                },
              },
            },
          }}
        />
      );

      const heading = screen.getByRole('heading', { name: 'Our Features' });
      expect(heading).toHaveClass('font-bold');
      expect(heading.className).not.toContain('uppercase');
      expect(screen.getByTestId('feature-banner-subtitle')).toHaveTextContent(
        'Explore Our Product Categories'
      );
      expect(screen.getAllByRole('img')[0]).toHaveClass('rounded-full');
    });
  });

  describe('Accent variant', () => {
    it('renders Accent layout correctly', () => {
      render(<FeatureBannerAccent {...mockProps} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
      expect(screen.getByText('High Quality')).toBeInTheDocument();
    });

    it('renders all features in Accent layout', () => {
      render(<FeatureBannerAccent {...mockProps} />);
      expect(screen.getByText('High Quality')).toBeInTheDocument();
      expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });

    it('handles null datasource in Accent variant', () => {
      const missingDatasourceProps: any = {
        params: {},
        fields: {
          data: {
            datasource: null,
          },
        },
      };
      render(<FeatureBannerAccent {...missingDatasourceProps} />);
      // Check that the section still renders with the accent styling
      expect(document.querySelector('section')).toBeInTheDocument();
      expect(document.querySelector('.bg-primary')).toBeInTheDocument();
    });
  });

  describe('SolidColorColumns variant', () => {
    const columnProps = {
      params: { styles: 'inset-row', RenderingIdentifier: 'member-links' },
      fields: {
        data: {
          datasource: {
            title: { jsonValue: { value: '' } },
            link: { jsonValue: { value: { href: '', text: '' } } },
            children: {
              results: [
                {
                  id: 'column-1',
                  link: {
                    jsonValue: {
                      value: {
                        href: 'https://www.asha.org/members/',
                        text: 'ASHA Member Center',
                      },
                    },
                  },
                  backgroundColor: { jsonValue: { value: 'teal' } },
                },
                {
                  id: 'column-2',
                  link: {
                    jsonValue: {
                      value: {
                        href: 'https://www.asha.org/members/benefits/',
                        text: 'Member Benefits',
                      },
                    },
                  },
                  backgroundColor: { jsonValue: { value: 'navy' } },
                },
                {
                  id: 'column-3',
                  link: {
                    jsonValue: {
                      value: {
                        href: 'https://www.asha.org/certification/',
                        text: 'Certification Benefits',
                      },
                    },
                  },
                  backgroundColor: { jsonValue: { value: '#9A2F73' } },
                },
              ],
            },
          },
        },
      },
    };

    it('renders equal solid-color link columns with the label as the accessible name', () => {
      render(<FeatureBannerSolidColorColumns {...columnProps} />);

      const banner = screen.getByTestId('feature-banner-solid-color-columns');
      expect(banner).toHaveClass('@container', 'px-6');
      expect(banner).toHaveAttribute('id', 'member-links');
      expect(banner.firstElementChild).toHaveClass('grid', 'grid-cols-1', 'gap-5', '@md:grid-cols-3');

      const memberCenter = screen.getByRole('link', { name: 'ASHA Member Center' });
      const memberBenefits = screen.getByRole('link', { name: 'Member Benefits' });
      const certification = screen.getByRole('link', { name: 'Certification Benefits' });

      expect(memberCenter).toHaveAttribute('href', 'https://www.asha.org/members/');
      expect(memberCenter).toHaveClass('text-white', 'font-semibold', 'no-underline', 'min-h-14');
      expect(memberCenter).toHaveStyle({ backgroundColor: '#0E7C86' });
      expect(memberBenefits).toHaveStyle({ backgroundColor: '#1B2A78' });
      expect(certification).toHaveStyle({ backgroundColor: '#9A2F73' });
      expect(screen.queryAllByRole('img')).toHaveLength(0);
    });

    it('renders the empty-state fallback when fields are missing', () => {
      render(<FeatureBannerSolidColorColumns params={{}} fields={undefined as any} />);

      expect(screen.getByText(/Feature Banner/i)).toBeInTheDocument();
      expect(screen.queryByTestId('feature-banner-solid-color-columns')).not.toBeInTheDocument();
    });
  });

  describe('FeatureItem component', () => {
    it('handles missing image field', () => {
      const propsWithMissingImage: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [
                  {
                    id: 'feature-1',
                    image: undefined,
                    heading: {
                      jsonValue: {
                        value: 'High Quality',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...propsWithMissingImage} />);
      expect(screen.getByText('High Quality')).toBeInTheDocument();
    });

    it('handles missing heading field', () => {
      const propsWithMissingHeading: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [
                  {
                    id: 'feature-1',
                    image: {
                      jsonValue: {
                        value: {
                          src: '/icons/feature1.svg',
                          alt: 'Feature 1',
                        },
                      },
                    },
                    heading: undefined,
                  },
                ],
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...propsWithMissingHeading} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
    });

    it('handles completely empty feature item', () => {
      const propsWithEmptyFeature: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [
                  {
                    id: 'feature-1',
                    image: null,
                    heading: null,
                  },
                ],
              },
            },
          },
        },
      };
      render(<FeatureBannerDefault {...propsWithEmptyFeature} />);
      expect(screen.getByText('Our Features')).toBeInTheDocument();
    });
  });
});
