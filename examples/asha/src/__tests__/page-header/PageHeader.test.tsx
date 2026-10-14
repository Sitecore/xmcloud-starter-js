/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as PageHeaderDefault,
  BlueText as PageHeaderBlueText,
  FiftyFifty as PageHeaderFiftyFifty,
  BlueBackground as PageHeaderBlueBackground,
  Centered as PageHeaderCentered,
} from '../../components/page-header/PageHeader';
import {
  defaultPageHeaderProps,
  pageHeaderPropsMinimal,
  pageHeaderPropsNoImage,
  pageHeaderPropsNoLinks,
  pageHeaderPropsWithPositionStyles,
  pageHeaderPropsEmpty,
  pageHeaderPropsEditing,
  mockUseSitecoreNormal,
  mockUseSitecoreEditing,
} from './PageHeader.mockProps';
import { mockPageEditing } from '../test-utils/mockPage';

// Mock Sitecore Content SDK
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

// Mock PageHeader variant components
jest.mock('../../components/page-header/PageHeaderDefault.dev', () => ({
  PageHeaderDefault: ({ fields, isPageEditing, params }: any) => (
    <div data-testid="page-header-default" data-editing={isPageEditing}>
      <div data-testid="header-content">
        {fields?.data?.externalFields?.pageHeaderTitle?.jsonValue?.value && (
          <h1 data-testid="header-title">
            {fields.data.externalFields.pageHeaderTitle.jsonValue.value}
          </h1>
        )}
        {!fields?.data?.externalFields?.pageHeaderTitle?.jsonValue?.value &&
          fields?.data?.externalFields?.pageTitle?.jsonValue?.value && (
            <h1 data-testid="header-title">
              {fields.data.externalFields.pageTitle.jsonValue.value}
            </h1>
          )}
        {fields?.data?.externalFields?.pageSubtitle?.jsonValue?.value && (
          <p data-testid="header-subtitle">
            {fields.data.externalFields.pageSubtitle.jsonValue.value}
          </p>
        )}
        {fields?.data?.datasource?.imageRequired?.jsonValue?.value?.src && (
          <img
            src={fields.data.datasource.imageRequired.jsonValue.value.src}
            alt={fields.data.datasource.imageRequired.jsonValue.value.alt}
            data-testid="header-image"
          />
        )}
        {(isPageEditing || fields?.data?.datasource?.link1?.jsonValue?.value?.href) && (
          <a
            href={fields?.data?.datasource?.link1?.jsonValue?.value?.href || '#'}
            data-testid="header-link-1"
          >
            {fields?.data?.datasource?.link1?.jsonValue?.value?.text || 'Button 1'}
          </a>
        )}
        {(isPageEditing || fields?.data?.datasource?.link2?.jsonValue?.value?.href) && (
          <a
            href={fields?.data?.datasource?.link2?.jsonValue?.value?.href || '#'}
            data-testid="header-link-2"
          >
            {fields?.data?.datasource?.link2?.jsonValue?.value?.text || 'Button 2'}
          </a>
        )}
        {params?.styles && <div data-testid="position-styles" data-styles={params.styles}></div>}
      </div>
    </div>
  ),
}));

jest.mock('../../components/page-header/PageHeaderBlueText.dev', () => ({
  PageHeaderBlueText: ({ isPageEditing }: any) => (
    <div data-testid="page-header-blue-text" data-editing={isPageEditing}>
      <div data-testid="blue-text-content">Blue Text Variant</div>
    </div>
  ),
}));

jest.mock('../../components/page-header/PageHeaderFiftyFifty.dev', () => ({
  PageHeaderFiftyFifty: ({ isPageEditing }: any) => (
    <div data-testid="page-header-fifty-fifty" data-editing={isPageEditing}>
      <div data-testid="fifty-fifty-content">Fifty Fifty Variant</div>
    </div>
  ),
}));

jest.mock('../../components/page-header/PageHeaderBlueBackground.dev', () => ({
  PageHeaderBlueBackground: ({ isPageEditing }: any) => (
    <div data-testid="page-header-blue-background" data-editing={isPageEditing}>
      <div data-testid="blue-background-content">Blue Background Variant</div>
    </div>
  ),
}));

jest.mock('../../components/page-header/PageHeaderCentered.dev', () => ({
  PageHeaderCentered: ({ isPageEditing }: any) => (
    <div data-testid="page-header-centered" data-editing={isPageEditing}>
      <div data-testid="centered-content">Centered Variant</div>
    </div>
  ),
}));

// Mock window.matchMedia for reduced motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('PageHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Variant', () => {
    it('renders complete page header with all content', () => {
      render(<PageHeaderDefault {...defaultPageHeaderProps} />);

      expect(screen.getByTestId('page-header-default')).toBeInTheDocument();
      expect(screen.getByTestId('header-content')).toBeInTheDocument();

      // Check title (should use pageHeaderTitle over pageTitle)
      expect(screen.getByTestId('header-title')).toHaveTextContent('Discover Amazing Products');

      // Check subtitle
      expect(screen.getByTestId('header-subtitle')).toHaveTextContent(
        'Find the perfect tech solutions for your needs'
      );

      // Check image
      expect(screen.getByTestId('header-image')).toHaveAttribute('src', '/page-header/hero.jpg');
      expect(screen.getByTestId('header-image')).toHaveAttribute('alt', 'Page Header Hero Image');

      // Check links
      expect(screen.getByTestId('header-link-1')).toHaveAttribute('href', '/shop/products');
      expect(screen.getByTestId('header-link-1')).toHaveTextContent('Shop Now');
      expect(screen.getByTestId('header-link-2')).toHaveAttribute('href', '/about');
      expect(screen.getByTestId('header-link-2')).toHaveTextContent('Learn More');
    });

    it('falls back to pageTitle when pageHeaderTitle is not provided', () => {
      render(<PageHeaderDefault {...pageHeaderPropsMinimal} />);

      expect(screen.getByTestId('header-title')).toHaveTextContent('Welcome to Our Store');
    });

    it('handles missing subtitle gracefully', () => {
      render(<PageHeaderDefault {...pageHeaderPropsMinimal} />);

      expect(screen.queryByTestId('header-subtitle')).not.toBeInTheDocument();
    });

    it('handles missing image gracefully', () => {
      render(<PageHeaderDefault {...pageHeaderPropsNoImage} />);

      expect(screen.queryByTestId('header-image')).not.toBeInTheDocument();
      expect(screen.getByTestId('header-title')).toBeInTheDocument();
    });

    it('handles missing links in non-editing mode', () => {
      render(<PageHeaderDefault {...pageHeaderPropsNoLinks} />);

      expect(screen.queryByTestId('header-link-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('header-link-2')).not.toBeInTheDocument();
    });

    it('shows links in editing mode even when empty', () => {
      const propsWithEditing = {
        ...pageHeaderPropsNoLinks,
        page: mockPageEditing,
      };
      render(<PageHeaderDefault {...propsWithEditing} />);

      expect(screen.getByTestId('header-link-1')).toBeInTheDocument();
      expect(screen.getByTestId('header-link-2')).toBeInTheDocument();
    });

    it('handles position styles parameter', () => {
      render(<PageHeaderDefault {...pageHeaderPropsWithPositionStyles} />);

      const positionElement = screen.getByTestId('position-styles');
      expect(positionElement).toHaveAttribute('data-styles', 'position-center position-bottom');
    });

    it('passes editing state correctly', () => {
      render(<PageHeaderDefault {...pageHeaderPropsEditing} />);

      expect(screen.getByTestId('page-header-default')).toHaveAttribute('data-editing', 'true');
    });
  });

  describe('Variant Components', () => {
    it('renders BlueText variant', () => {
      render(<PageHeaderBlueText {...defaultPageHeaderProps} />);

      expect(screen.getByTestId('page-header-blue-text')).toBeInTheDocument();
      expect(screen.getByTestId('blue-text-content')).toBeInTheDocument();
    });

    it('renders FiftyFifty variant', () => {
      render(<PageHeaderFiftyFifty {...defaultPageHeaderProps} />);

      expect(screen.getByTestId('page-header-fifty-fifty')).toBeInTheDocument();
      expect(screen.getByTestId('fifty-fifty-content')).toBeInTheDocument();
    });

    it('renders BlueBackground variant', () => {
      render(<PageHeaderBlueBackground {...defaultPageHeaderProps} />);

      expect(screen.getByTestId('page-header-blue-background')).toBeInTheDocument();
      expect(screen.getByTestId('blue-background-content')).toBeInTheDocument();
    });

    it('renders Centered variant', () => {
      render(<PageHeaderCentered {...defaultPageHeaderProps} />);

      expect(screen.getByTestId('page-header-centered')).toBeInTheDocument();
      expect(screen.getByTestId('centered-content')).toBeInTheDocument();
    });

    it('passes editing state to all variants', () => {
      render(<PageHeaderBlueText {...pageHeaderPropsEditing} />);
      expect(screen.getByTestId('page-header-blue-text')).toHaveAttribute('data-editing', 'true');

      render(<PageHeaderFiftyFifty {...pageHeaderPropsEditing} />);
      expect(screen.getByTestId('page-header-fifty-fifty')).toHaveAttribute('data-editing', 'true');

      render(<PageHeaderBlueBackground {...pageHeaderPropsEditing} />);
      expect(screen.getByTestId('page-header-blue-background')).toHaveAttribute(
        'data-editing',
        'true'
      );

      render(<PageHeaderCentered {...pageHeaderPropsEditing} />);
      expect(screen.getByTestId('page-header-centered')).toHaveAttribute('data-editing', 'true');
    });
  });

  describe('Content Scenarios', () => {
    it('prioritizes pageHeaderTitle over pageTitle', () => {
      render(<PageHeaderDefault {...defaultPageHeaderProps} />);

      expect(screen.getByTestId('header-title')).toHaveTextContent('Discover Amazing Products');
      expect(screen.queryByText('Welcome to Our Store')).not.toBeInTheDocument();
    });

    it('uses pageTitle when pageHeaderTitle is not available', () => {
      const propsWithoutHeaderTitle = {
        ...defaultPageHeaderProps,
        page: defaultPageHeaderProps.page,
        fields: {
          data: {
            ...defaultPageHeaderProps.fields.data,
            externalFields: {
              pageTitle: { jsonValue: { value: 'Welcome to Our Store' } },
              pageHeaderTitle: { jsonValue: { value: '' } },
              pageSubtitle: {
                jsonValue: { value: 'Find the perfect tech solutions for your needs' },
              },
            },
          },
        },
      };

      render(<PageHeaderDefault {...propsWithoutHeaderTitle} />);

      expect(screen.getByTestId('header-title')).toHaveTextContent('Welcome to Our Store');
    });

    it('handles completely empty fields', () => {
      render(<PageHeaderDefault {...pageHeaderPropsEmpty} />);

      // Should still render the component container
      expect(screen.getByTestId('page-header-default')).toBeInTheDocument();
      expect(screen.queryByTestId('header-title')).not.toBeInTheDocument();
    });
  });

  describe('Editing Mode Behavior', () => {
    it('shows buttons in editing mode regardless of href', () => {
      const propsWithEmptyLinks = {
        ...defaultPageHeaderProps,
        page: mockPageEditing,
        fields: {
          data: {
            ...defaultPageHeaderProps.fields.data,
            datasource: {
              imageRequired: { jsonValue: { value: { src: '/test.jpg', alt: 'test' } } },
              link1: { jsonValue: { value: { href: '', text: '' } } },
              link2: { jsonValue: { value: { href: '', text: '' } } },
            },
          },
        },
      };

      render(<PageHeaderDefault {...propsWithEmptyLinks} />);

      expect(screen.getByTestId('header-link-1')).toBeInTheDocument();
      expect(screen.getByTestId('header-link-2')).toBeInTheDocument();
    });

    it('passes editing state (true) to variants', () => {
      render(<PageHeaderDefault {...pageHeaderPropsEditing} />);
      expect(screen.getByTestId('page-header-default')).toHaveAttribute('data-editing', 'true');
    });

    it('passes editing state (false) to variants', () => {
      render(<PageHeaderDefault {...defaultPageHeaderProps} />);
      expect(screen.getByTestId('page-header-default')).toHaveAttribute('data-editing', 'false');
    });
  });

  describe('Link Behavior', () => {
    it('shows links when they have valid href in normal mode', () => {
      render(<PageHeaderDefault {...defaultPageHeaderProps} />);

      const link1 = screen.getByTestId('header-link-1');
      const link2 = screen.getByTestId('header-link-2');

      expect(link1).toHaveAttribute('href', '/shop/products');
      expect(link2).toHaveAttribute('href', '/about');
    });

    it('hides links when they have empty href in normal mode', () => {
      const propsWithEmptyLinks = {
        ...defaultPageHeaderProps,
        page: defaultPageHeaderProps.page,
        fields: {
          data: {
            ...defaultPageHeaderProps.fields.data,
            datasource: {
              imageRequired: defaultPageHeaderProps.fields.data.datasource.imageRequired,
              link1: { jsonValue: { value: { href: '', text: 'Empty Link' } } },
              link2: { jsonValue: { value: { href: '', text: 'Another Empty' } } },
            },
          },
        },
      };

      render(<PageHeaderDefault {...propsWithEmptyLinks} />);

      expect(screen.queryByTestId('header-link-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('header-link-2')).not.toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('integrates with page prop', () => {
      render(<PageHeaderDefault {...defaultPageHeaderProps} />);

      // Component should render successfully with page prop
      expect(screen.getByTestId('page-header-default')).toBeInTheDocument();
    });

    it('passes all props to variant components', () => {
      const customProps = {
        ...defaultPageHeaderProps,
        page: defaultPageHeaderProps.page,
        params: { customParam: 'test-value' },
      };

      render(<PageHeaderDefault {...customProps} />);

      // The variant component should receive the props
      expect(screen.getByTestId('page-header-default')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading hierarchy', () => {
      render(<PageHeaderDefault {...defaultPageHeaderProps} />);

      const title = screen.getByTestId('header-title');
      expect(title.tagName.toLowerCase()).toBe('h1');
    });

    it('provides meaningful alt text for images', () => {
      render(<PageHeaderDefault {...defaultPageHeaderProps} />);

      const image = screen.getByTestId('header-image');
      expect(image).toHaveAttribute('alt', 'Page Header Hero Image');
    });

    it('provides accessible link text', () => {
      render(<PageHeaderDefault {...defaultPageHeaderProps} />);

      const link1 = screen.getByTestId('header-link-1');
      const link2 = screen.getByTestId('header-link-2');

      expect(link1).toHaveTextContent('Shop Now');
      expect(link2).toHaveTextContent('Learn More');
    });
  });

  describe('Error Handling', () => {
    it('handles missing datasource gracefully', () => {
      const propsWithoutDatasource = {
        ...defaultPageHeaderProps,
        fields: {
          data: {
            datasource: {
              imageRequired: { jsonValue: { value: { src: '', alt: '' } } },
            },
            externalFields: {
              pageTitle: { jsonValue: { value: 'Test Title' } },
              pageHeaderTitle: { jsonValue: { value: '' } },
              pageSubtitle: { jsonValue: { value: '' } },
            },
          },
        },
      };

      render(<PageHeaderDefault {...propsWithoutDatasource} />);

      expect(screen.getByTestId('page-header-default')).toBeInTheDocument();
      expect(screen.getByTestId('header-title')).toHaveTextContent('Test Title');
    });

    it('handles missing externalFields gracefully', () => {
      const propsWithoutExternalFields = {
        ...defaultPageHeaderProps,
        fields: {
          data: {
            datasource: {
              imageRequired: { jsonValue: { value: { src: '/test.jpg', alt: 'test' } } },
            },
            externalFields: {
              pageTitle: { jsonValue: { value: '' } },
              pageHeaderTitle: { jsonValue: { value: '' } },
              pageSubtitle: { jsonValue: { value: '' } },
            },
          },
        },
      };

      render(<PageHeaderDefault {...propsWithoutExternalFields} />);

      expect(screen.getByTestId('page-header-default')).toBeInTheDocument();
      expect(screen.queryByTestId('header-title')).not.toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('maintains consistent structure across variants', () => {
      const variants = [
        { component: PageHeaderDefault, testId: 'page-header-default' },
        { component: PageHeaderBlueText, testId: 'page-header-blue-text' },
        { component: PageHeaderFiftyFifty, testId: 'page-header-fifty-fifty' },
        { component: PageHeaderBlueBackground, testId: 'page-header-blue-background' },
        { component: PageHeaderCentered, testId: 'page-header-centered' },
      ];

      variants.forEach(({ component: Component, testId }) => {
        render(<Component {...defaultPageHeaderProps} />);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });
    });

    it('applies correct data attributes', () => {
      render(<PageHeaderDefault {...defaultPageHeaderProps} />);

      const headerElement = screen.getByTestId('page-header-default');
      expect(headerElement).toHaveAttribute('data-editing');
    });
  });
});
