import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContentSdkRichText from '@/components/content-sdk-rich-text/ContentSdkRichText';

// 🧪 Mock the RichText component from Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: ({ field }: { field?: { value?: string } }) => <div>{field?.value}</div>,
}));

describe('ContentSdkRichText Component', () => {
  it('renders RichText content correctly', () => {
    const mockField = { value: '<p>This is rich text</p>' };

    render(<ContentSdkRichText field={mockField} />);

    expect(screen.getByText('<p>This is rich text</p>')).toBeInTheDocument();
  });

  it('wraps RichText with the correct class', () => {
    const mockField = { value: 'Wrapped content' };

    const { container } = render(<ContentSdkRichText field={mockField} />);
    const wrapper = container.querySelector('.content-sdk-rich-text');

    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveTextContent('Wrapped content');
  });
});
