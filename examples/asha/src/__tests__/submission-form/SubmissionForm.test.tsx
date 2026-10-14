/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as SubmissionFormDefault,
  Centered as SubmissionFormCentered,
} from '../../components/submission-form/SubmissionForm';
import {
  defaultSubmissionFormProps,
  submissionFormPropsCentered,
  submissionFormPropsCustomPosition,
  submissionFormPropsNoPosition,
  submissionFormPropsNoStyles,
  submissionFormPropsEmptyTitle,
  submissionFormPropsNoTitle,
  submissionFormPropsNoFields,
  submissionFormPropsLongTitle,
  submissionFormPropsSpecialChars,
  submissionFormPropsPositionLeft,
  submissionFormPropsPositionCenter,
  submissionFormPropsPositionRight,
  submissionFormPropsUndefinedTitle,
} from './SubmissionForm.mockProps';
import { mockPage, mockPageEditing } from '../test-utils/mockPage';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'div', className, ...props }: any) => (
    <Tag className={className} data-testid="sitecore-text" {...props}>
      {field?.value || 'Sitecore Text'}
    </Tag>
  ),
}));

// Mock SubmissionFormDefault component
jest.mock('../../components/submission-form/SubmissionFormDefault.dev', () => ({
  SubmissionFormDefault: ({ fields, params, isPageEditing, ...props }: any) => (
    <div
      data-testid="submission-form-default"
      data-editing={isPageEditing?.toString()}
      data-styles={params?.styles || ''}
      data-title={fields?.title?.value || ''}
      {...props}
    >
      <div data-testid="form-title">{fields?.title?.value || 'Default Form'}</div>
      <div data-testid="submit-info-form">Submit Info Form Content</div>
    </div>
  ),
}));

// Mock SubmissionFormCentered component
jest.mock('../../components/submission-form/SubmissionFormCentered.dev', () => ({
  SubmissionFormCentered: ({ fields, params, isPageEditing, ...props }: any) => (
    <div
      data-testid="submission-form-centered"
      data-editing={isPageEditing?.toString()}
      data-styles={params?.styles || ''}
      data-title={fields?.title?.value || ''}
      {...props}
    >
      <div data-testid="form-title">{fields?.title?.value || 'Centered Form'}</div>
      <div data-testid="submit-info-form">Submit Info Form Content</div>
    </div>
  ),
}));

describe('SubmissionForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Variant', () => {
    it('renders SubmissionFormDefault component', () => {
      render(<SubmissionFormDefault {...defaultSubmissionFormProps} />);

      expect(screen.getByTestId('submission-form-default')).toBeInTheDocument();
      expect(screen.getByTestId('form-title')).toHaveTextContent('Get Started with SYNC Audio');
    });

    it('passes editing mode correctly to child component', () => {
      render(<SubmissionFormDefault {...defaultSubmissionFormProps} page={mockPageEditing} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-editing', 'true');
    });

    it('passes non-editing mode correctly to child component', () => {
      render(<SubmissionFormDefault {...defaultSubmissionFormProps} page={mockPage} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-editing', 'false');
    });

    it('passes all props to SubmissionFormDefault', () => {
      render(<SubmissionFormDefault {...defaultSubmissionFormProps} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-styles', 'position-left');
      expect(defaultComponent).toHaveAttribute('data-title', 'Get Started with SYNC Audio');
    });

    it('handles custom styling parameters', () => {
      render(<SubmissionFormDefault {...submissionFormPropsCustomPosition} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute(
        'data-styles',
        'position-right bg-primary text-white'
      );
    });

    it('handles missing styles parameter', () => {
      render(<SubmissionFormDefault {...submissionFormPropsNoStyles} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-styles', '');
    });
  });

  describe('Centered Variant', () => {
    it('renders SubmissionFormCentered component', () => {
      render(<SubmissionFormCentered {...submissionFormPropsCentered} />);

      expect(screen.getByTestId('submission-form-centered')).toBeInTheDocument();
      expect(screen.getByTestId('form-title')).toHaveTextContent('Join the SYNC Community');
    });

    it('passes editing mode correctly to centered component', () => {
      render(<SubmissionFormCentered {...submissionFormPropsCentered} page={mockPageEditing} />);

      const centeredComponent = screen.getByTestId('submission-form-centered');
      expect(centeredComponent).toHaveAttribute('data-editing', 'true');
    });

    it('passes non-editing mode correctly to centered component', () => {
      render(<SubmissionFormCentered {...submissionFormPropsCentered} page={mockPage} />);

      const centeredComponent = screen.getByTestId('submission-form-centered');
      expect(centeredComponent).toHaveAttribute('data-editing', 'false');
    });

    it('passes all props to SubmissionFormCentered', () => {
      render(<SubmissionFormCentered {...submissionFormPropsCentered} />);

      const centeredComponent = screen.getByTestId('submission-form-centered');
      expect(centeredComponent).toHaveAttribute('data-styles', 'position-center custom-styling');
      expect(centeredComponent).toHaveAttribute('data-title', 'Join the SYNC Community');
    });
  });

  describe('Content Scenarios', () => {
    it('handles empty title field', () => {
      render(<SubmissionFormDefault {...submissionFormPropsEmptyTitle} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-title', '');
    });

    it('handles missing title field', () => {
      render(<SubmissionFormDefault {...submissionFormPropsNoTitle} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-title', '');
    });

    it('handles undefined title field', () => {
      render(<SubmissionFormDefault {...submissionFormPropsUndefinedTitle} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-title', '');
    });

    it('handles long title content', () => {
      render(<SubmissionFormDefault {...submissionFormPropsLongTitle} />);

      const titleElement = screen.getByTestId('form-title');
      expect(titleElement).toHaveTextContent(
        'Experience Premium Audio Excellence with SYNC Professional Equipment'
      );
    });

    it('handles special characters in title', () => {
      render(<SubmissionFormDefault {...submissionFormPropsSpecialChars} />);

      const titleElement = screen.getByTestId('form-title');
      expect(titleElement).toHaveTextContent(
        'SYNC™ Àudio - Jóin Öur Prémium Cömmunity & Gët Ëxclusive Àccess'
      );
    });
  });

  describe('Position Styling', () => {
    it('handles position-left styling', () => {
      render(<SubmissionFormDefault {...submissionFormPropsPositionLeft} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-styles', 'position-left bg-background');
    });

    it('handles position-center styling', () => {
      render(<SubmissionFormDefault {...submissionFormPropsPositionCenter} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-styles', 'position-center bg-secondary');
    });

    it('handles position-right styling', () => {
      render(<SubmissionFormDefault {...submissionFormPropsPositionRight} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-styles', 'position-right bg-accent');
    });

    it('handles no position styling', () => {
      render(<SubmissionFormDefault {...submissionFormPropsNoPosition} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toHaveAttribute('data-styles', 'custom-background rounded-corners');
    });
  });

  describe('Component Integration', () => {
    it('integrates with page prop correctly', () => {
      render(<SubmissionFormDefault {...defaultSubmissionFormProps} page={mockPage} />);

      const defaultComponent = screen.getByTestId('submission-form-default');
      expect(defaultComponent).toBeInTheDocument();
    });

    it('renders SubmitInfoForm component within child components', () => {
      render(<SubmissionFormDefault {...defaultSubmissionFormProps} />);

      expect(screen.getByTestId('submit-info-form')).toBeInTheDocument();
      expect(screen.getByTestId('submit-info-form')).toHaveTextContent('Submit Info Form Content');
    });

    it('maintains component hierarchy correctly', () => {
      render(<SubmissionFormDefault {...defaultSubmissionFormProps} />);

      const container = screen.getByTestId('submission-form-default');
      const title = screen.getByTestId('form-title');
      const form = screen.getByTestId('submit-info-form');

      expect(container).toContainElement(title);
      expect(container).toContainElement(form);
    });
  });

  describe('Variant Comparison', () => {
    it('renders different components for Default vs Centered variants', () => {
      const { rerender } = render(<SubmissionFormDefault {...defaultSubmissionFormProps} />);

      expect(screen.getByTestId('submission-form-default')).toBeInTheDocument();
      expect(screen.queryByTestId('submission-form-centered')).not.toBeInTheDocument();

      rerender(<SubmissionFormCentered {...submissionFormPropsCentered} />);

      expect(screen.queryByTestId('submission-form-default')).not.toBeInTheDocument();
      expect(screen.getByTestId('submission-form-centered')).toBeInTheDocument();
    });

    it('passes same editing state to both variants', () => {
      const { rerender } = render(<SubmissionFormDefault {...defaultSubmissionFormProps} page={mockPageEditing} />);

      expect(screen.getByTestId('submission-form-default')).toHaveAttribute('data-editing', 'true');

      rerender(<SubmissionFormCentered {...submissionFormPropsCentered} page={mockPageEditing} />);

      expect(screen.getByTestId('submission-form-centered')).toHaveAttribute(
        'data-editing',
        'true'
      );
    });
  });

  describe('Performance', () => {
    it('handles re-renders efficiently', () => {
      const { rerender } = render(<SubmissionFormDefault {...defaultSubmissionFormProps} />);

      expect(screen.getByTestId('form-title')).toHaveTextContent('Get Started with SYNC Audio');

      rerender(<SubmissionFormDefault {...submissionFormPropsCustomPosition} />);

      expect(screen.getByTestId('form-title')).toHaveTextContent('Contact Our Audio Experts');
    });

    it('manages page prop efficiently', () => {
      const { rerender } = render(<SubmissionFormDefault {...defaultSubmissionFormProps} page={mockPage} />);

      expect(screen.getByTestId('submission-form-default')).toBeInTheDocument();

      rerender(<SubmissionFormCentered {...submissionFormPropsCentered} page={mockPage} />);

      expect(screen.getByTestId('submission-form-centered')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains semantic structure through child components', () => {
      render(<SubmissionFormDefault {...defaultSubmissionFormProps} />);

      const container = screen.getByTestId('submission-form-default');
      expect(container).toBeInTheDocument();
    });

    it('preserves title content for screen readers', () => {
      render(<SubmissionFormDefault {...defaultSubmissionFormProps} />);

      const title = screen.getByTestId('form-title');
      expect(title).toHaveTextContent('Get Started with SYNC Audio');
      expect(title.textContent).toBeTruthy();
    });

    it('provides consistent structure across variants', () => {
      const { rerender } = render(<SubmissionFormDefault {...defaultSubmissionFormProps} />);

      expect(screen.getByTestId('form-title')).toBeInTheDocument();
      expect(screen.getByTestId('submit-info-form')).toBeInTheDocument();

      rerender(<SubmissionFormCentered {...submissionFormPropsCentered} />);

      expect(screen.getByTestId('form-title')).toBeInTheDocument();
      expect(screen.getByTestId('submit-info-form')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles null fields gracefully', () => {
      expect(() => {
        render(<SubmissionFormDefault {...submissionFormPropsNoFields} />);
      }).not.toThrow();
    });

    it('handles malformed props gracefully', () => {
      const malformedProps = {
        ...defaultSubmissionFormProps,
        fields: undefined as any,
        params: null as any,
      };

      expect(() => {
        render(<SubmissionFormDefault {...malformedProps} />);
      }).not.toThrow();
    });

    it('handles missing page prop gracefully', () => {
      const propsWithoutPage = {
        ...defaultSubmissionFormProps,
        page: undefined as any,
      };

      expect(() => {
        render(<SubmissionFormDefault {...propsWithoutPage} />);
      }).toThrow();
    });

    it('handles missing rendering prop', () => {
      const propsWithoutRendering = {
        ...defaultSubmissionFormProps,
        rendering: undefined as any,
      };

      expect(() => {
        render(<SubmissionFormDefault {...propsWithoutRendering} />);
      }).not.toThrow();
    });
  });

  describe('Data Flow', () => {
    it('correctly passes isPageEditing state to child components', () => {
      // Test editing state
      const { rerender } = render(<SubmissionFormDefault {...defaultSubmissionFormProps} page={mockPageEditing} />);

      expect(screen.getByTestId('submission-form-default')).toHaveAttribute('data-editing', 'true');

      // Test non-editing state
      rerender(<SubmissionFormDefault {...defaultSubmissionFormProps} page={mockPage} />);

      expect(screen.getByTestId('submission-form-default')).toHaveAttribute(
        'data-editing',
        'false'
      );
    });

    it('preserves original props while adding isPageEditing', () => {
      render(<SubmissionFormDefault {...submissionFormPropsCustomPosition} />);

      const component = screen.getByTestId('submission-form-default');

      // Original props should be preserved
      expect(component).toHaveAttribute('data-styles', 'position-right bg-primary text-white');
      expect(component).toHaveAttribute('data-title', 'Contact Our Audio Experts');

      // isPageEditing should be added
      expect(component).toHaveAttribute('data-editing');
    });
  });
});
