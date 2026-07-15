/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the Sitecore RichText component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: ({ field }: { field?: Record<string, unknown> }) => (
    <div data-testid="richtext">{(field as Record<string, any>)?.value ?? 'no-value'}</div>
  ),
}));

import ContentSdkRichText from '@/components/content-sdk-rich-text/ContentSdkRichText';

describe('ContentSdkRichText', () => {
  it('renders RichText with provided field value', () => {
    const field = { value: 'Hello <strong>World</strong>' };

    render(<ContentSdkRichText field={field as unknown as Record<string, unknown>} />);

    expect(screen.getByTestId('richtext')).toHaveTextContent('Hello <strong>World</strong>');
  });

  it('renders no-value when field is empty', () => {
    render(<ContentSdkRichText field={undefined as unknown as Record<string, unknown>} />);

    expect(screen.getByTestId('richtext')).toHaveTextContent('no-value');
  });
});
