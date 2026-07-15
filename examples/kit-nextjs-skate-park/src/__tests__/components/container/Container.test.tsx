import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Container } from '../../../components/container/Container';
import {
  mockContainerPropsWithBackground,
  mockContainerPropsNoBackground,
  mockContainerPropsWithWrapper,
  mockContainerPropsWithoutWrapper,
  mockContainerPropsDifferentPlaceholder,
} from './Container.mockProps';

const getContainerDiv = () => document.querySelector('.container-default');
const getContentDiv = () => document.querySelector('.component-content');

describe('Container Component should', () => {
  it('render without crashing', () => {
    render(<Container {...mockContainerPropsWithBackground} />);
    expect(getContainerDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Container {...mockContainerPropsWithBackground} />);
    expect(getContainerDiv()).toHaveClass('component', 'container-default', 'container-styles');
  });

  it('have correct ID attribute', () => {
    render(<Container {...mockContainerPropsWithBackground} />);
    expect(getContainerDiv()).toHaveAttribute('id', 'container-test-id');
  });

  it('extract and apply background image from BackgroundImage parameter', () => {
    render(<Container {...mockContainerPropsWithBackground} />);
    expect(getContentDiv()).toHaveStyle({ backgroundImage: "url('/path/to/background.jpg')" });
  });

  it('not apply background image when BackgroundImage is undefined', () => {
    render(<Container {...mockContainerPropsNoBackground} />);
    expect(getContentDiv()).not.toHaveStyle({ backgroundImage: "url('/path/to/background.jpg')" });
  });

  it('render Placeholder component with correct name', () => {
    render(<Container {...mockContainerPropsWithBackground} />);
    const placeholder = screen.getByTestId('placeholder-container-1');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Placeholder: container-1');
  });

  it('render Placeholder with different DynamicPlaceholderId', () => {
    render(<Container {...mockContainerPropsDifferentPlaceholder} />);
    const placeholder = screen.getByTestId('placeholder-container-99');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Placeholder: container-99');
  });

  it('render with container-wrapper when styles include "container"', () => {
    render(<Container {...mockContainerPropsWithWrapper} />);
    expect(document.querySelector('.container-wrapper')).toBeInTheDocument();
  });

  it('not render container-wrapper when styles do not include "container"', () => {
    render(<Container {...mockContainerPropsWithoutWrapper} />);
    expect(document.querySelector('.container-wrapper')).toBeNull();
  });

  it('render row div inside component-content', () => {
    render(<Container {...mockContainerPropsWithBackground} />);
    expect(document.querySelector('.row')).toBeInTheDocument();
  });

  it('apply different styles correctly', () => {
    render(<Container {...mockContainerPropsNoBackground} />);
    expect(getContainerDiv()).toHaveClass('component', 'container-default', 'no-bg-styles');
  });

  it('handle multiple classes in styles parameter', () => {
    render(<Container {...mockContainerPropsWithWrapper} />);
    expect(getContainerDiv()).toHaveClass('component', 'container-default', 'container', 'other-class');
  });
});

describe('Container Component Error Handling should', () => {
  it('handle missing BackgroundImage parameter', () => {
    render(<Container {...mockContainerPropsNoBackground} />);
    expect(getContentDiv()).toBeInTheDocument();
  });

  it('handle invalid mediaurl format', () => {
    render(<Container {...{ ...mockContainerPropsWithBackground, params: { ...mockContainerPropsWithBackground.params, BackgroundImage: 'invalid-format' } }} />);
    expect(getContainerDiv()).toBeInTheDocument();
  });

  it('handle empty DynamicPlaceholderId', () => {
    render(<Container {...{ ...mockContainerPropsWithBackground, params: { ...mockContainerPropsWithBackground.params, DynamicPlaceholderId: '' } }} />);
    expect(screen.getByTestId('placeholder-container-')).toBeInTheDocument();
  });

  it('render without styles parameter', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { styles, ...paramsWithoutStyles } = mockContainerPropsWithBackground.params;
    render(<Container {...{ ...mockContainerPropsWithBackground, params: paramsWithoutStyles }} />);
    expect(getContainerDiv()).toBeInTheDocument();
  });
});
