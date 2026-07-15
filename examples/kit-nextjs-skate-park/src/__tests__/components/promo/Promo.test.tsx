import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Promo, WithText as PromoWithText } from '../../../components/promo/Promo';
import {
  mockPromoPropsDefault,
  mockPromoPropsWithText,
  mockPromoPropsMinimal,
  mockPromoPropsNoFields,
} from './Promo.mockProps';

const getPromoDiv = () => document.querySelector('.promo');

describe('Promo Component (Default variant) should', () => {
  it('render without crashing', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    expect(getPromoDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    expect(getPromoDiv()).toHaveClass('component', 'promo', 'promo-styles');
  });

  it('have correct ID attribute', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    expect(getPromoDiv()).toHaveAttribute('id', 'promo-test-id');
  });

  it('render promo icon with correct attributes', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    const iconImage = screen.getByAltText('Promo Icon');
    expect(iconImage).toBeInTheDocument();
    expect(iconImage).toHaveAttribute('src', '/promo-icon.png');
  });

  it('render promo icon inside field-promoicon div', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    expect(document.querySelector('.field-promoicon')).toBeInTheDocument();
  });

  it('render promotional text with HTML formatting', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    const emphasisText = screen.getByText('emphasis');
    expect(emphasisText).toBeInTheDocument();
    expect(emphasisText.tagName).toBe('STRONG');
  });

  it('render promotional text inside field-promotext div', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    expect(document.querySelector('.field-promotext')).toBeInTheDocument();
  });

  it('render promo link', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('render promo link inside field-promolink div', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    expect(document.querySelector('.field-promolink')).toBeInTheDocument();
  });

  it('render promo-text wrapper div', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    expect(document.querySelector('.promo-text')).toBeInTheDocument();
  });

  it('render component-content div', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    expect(document.querySelector('.component-content')).toBeInTheDocument();
  });

  it('show empty hint when no fields are provided', () => {
    render(<Promo {...mockPromoPropsNoFields} />);
    const emptyHint = screen.getByText('Promo');
    expect(emptyHint).toBeInTheDocument();
    expect(emptyHint).toHaveClass('is-empty-hint');
  });

  it('render with minimal fields', () => {
    render(<Promo {...mockPromoPropsMinimal} />);
    expect(getPromoDiv()).toBeInTheDocument();
    expect(screen.getByAltText('Minimal Icon')).toBeInTheDocument();
  });
});

describe('Promo Component (WithText variant) should', () => {
  it('render without crashing', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);
    expect(getPromoDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes for WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);
    expect(getPromoDiv()).toHaveClass('component', 'promo', 'promo-withtext-styles');
  });

  it('have correct ID attribute for WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);
    expect(getPromoDiv()).toHaveAttribute('id', 'promo-withtext-id');
  });

  it('render promo icon in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);
    const iconImage = screen.getByAltText('Promo Icon 2');
    expect(iconImage).toBeInTheDocument();
    expect(iconImage).toHaveAttribute('src', '/promo-icon-2.png');
  });

  it('render both PromoText fields in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);
    expect(screen.getByText('First promotional text.')).toBeInTheDocument();
    expect(screen.getByText('Second promotional text for WithText variant.')).toBeInTheDocument();
  });

  it('render two field-promotext divs in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);
    expect(document.querySelectorAll('.field-promotext')).toHaveLength(2);
  });

  it('not render field-promolink div in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);
    expect(document.querySelector('.field-promolink')).toBeNull();
  });

  it('render promo-text class in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);
    expect(document.querySelectorAll('.promo-text').length).toBeGreaterThan(0);
  });
});

describe('Promo Component Accessibility should', () => {
  it('have accessible images with alt text', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    const image = screen.getByRole('img', { name: /Promo Icon/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Promo Icon');
  });

  it('have accessible links in Default variant', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    const link = screen.getByRole('link', { name: /Learn More/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/promo-link');
  });

  it('provide meaningful image descriptions', () => {
    render(<Promo {...mockPromoPropsWithText} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt');
    expect(image.getAttribute('alt')).toBeTruthy();
  });
});

describe('Promo Component Edge Cases should', () => {
  it('render correct DOM structure', () => {
    render(<Promo {...mockPromoPropsDefault} />);
    const container = getPromoDiv();
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('component', 'promo');
    
    const contentDiv = container?.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
    
    const iconDiv = contentDiv?.querySelector('.field-promoicon');
    expect(iconDiv).toBeInTheDocument();
    
    const textDiv = contentDiv?.querySelector('.field-promotext');
    expect(textDiv).toBeInTheDocument();
  });

  it('handle missing params gracefully', () => {
    const propsWithoutParams = {
      ...mockPromoPropsDefault,
      params: {} as typeof mockPromoPropsDefault.params,
    };
    
    render(<Promo {...propsWithoutParams} />);
    expect(screen.getByAltText('Promo Icon')).toBeInTheDocument();
  });

  it('handle null fields gracefully', () => {
    const propsWithNullFields = {
      ...mockPromoPropsDefault,
      fields: null as unknown as typeof mockPromoPropsDefault.fields,
    };
    
    render(<Promo {...propsWithNullFields} />);
    expect(screen.getByText('Promo')).toBeInTheDocument();
  });

  it('handle undefined fields gracefully', () => {
    const propsWithUndefinedFields = {
      ...mockPromoPropsDefault,
      fields: undefined as unknown as typeof mockPromoPropsDefault.fields,
    };
    
    render(<Promo {...propsWithUndefinedFields} />);
    expect(screen.getByText('Promo')).toBeInTheDocument();
  });

  it('handle missing PromoLink field', () => {
    const propsWithoutLink = {
      ...mockPromoPropsDefault,
      fields: {
        PromoIcon: mockPromoPropsDefault.fields.PromoIcon,
        PromoText: mockPromoPropsDefault.fields.PromoText,
        PromoText2: mockPromoPropsDefault.fields.PromoText2,
      } as unknown as typeof mockPromoPropsDefault.fields,
    };
    
    render(<Promo {...propsWithoutLink} />);
    expect(screen.getByAltText('Promo Icon')).toBeInTheDocument();
    const text = screen.getByText(/promotional text/i);
    expect(text).toBeInTheDocument();
  });
});
