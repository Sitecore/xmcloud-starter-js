'use client';

import { cn } from '@/lib/utils';
import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as SubmitInfoForm } from '@/components/forms/submitinfo/SubmitInfoForm.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { SubmissionFormProps } from './submission-form.props';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';
import { useTranslations } from 'next-intl';
import { dictionaryKeys } from '@/variables/dictionary';

export const SubmissionFormCentered: React.FC<SubmissionFormProps> = (props) => {
  const { fields } = props || {};
  const { title } = fields || {};

  const t = useTranslations();
  const dictionary = {
    SUBMITINFOFORM_FirstNameLabel: t(dictionaryKeys.SUBMITINFOFORM_FirstNameLabel),
    SUBMITINFOFORM_FirstNamePlaceholder: t(dictionaryKeys.SUBMITINFOFORM_FirstNamePlaceholder),
    SUBMITINFOFORM_LastNameLabel: t(dictionaryKeys.SUBMITINFOFORM_LastNameLabel),
    SUBMITINFOFORM_LastNamePlaceholder: t(dictionaryKeys.SUBMITINFOFORM_LastNamePlaceholder),
    SUBMITINFOFORM_ZipcodeLabel: t(dictionaryKeys.SUBMITINFOFORM_ZipcodeLabel),
    SUBMITINFOFORM_ZipcodePlaceholder: t(dictionaryKeys.SUBMITINFOFORM_ZipcodePlaceholder),
    SUBMITINFOFORM_EmailLabel: t(dictionaryKeys.SUBMITINFOFORM_EmailLabel),
    SUBMITINFOFORM_EmailPlaceholder: t(dictionaryKeys.SUBMITINFOFORM_EmailPlaceholder),
    SUBMITINFOFORM_EmailErrorMessage: t(dictionaryKeys.SUBMITINFOFORM_EmailErrorMessage),
    SUBMITINFOFORM_PhoneLabel: t(dictionaryKeys.SUBMITINFOFORM_PhoneLabel),
    SUBMITINFOFORM_PhonePlaceholder: t(dictionaryKeys.SUBMITINFOFORM_PhonePlaceholder),
    SUBMITINFOFORM_ButtonText: t(dictionaryKeys.SUBMITINFOFORM_ButtonText),
    SUBMITINFOFORM_SuccessMessage: t(dictionaryKeys.SUBMITINFOFORM_SuccessMessage),
  };

  if (fields) {
    const hasPagesPositionStyles: boolean = props?.params?.styles
      ? props?.params?.styles.includes('position-')
      : false;

    return (
      <section
        data-component="SubmissionForm"
        data-class-change
        className={cn('@md:my-24 group my-12 w-full', {
          'position-center': !hasPagesPositionStyles,
          [props?.params?.styles]: props?.params?.styles,
        })}
      >
        <div className="@container/submissionform">
          <div className="@md/submissionform:space-y-0 space-y-6">
            {title && (
              <Text
                tag="h2"
                className="@md/submissionform:mt-2 mb-10 max-w-[15ch] text-balance text-center group-[.position-center]:mx-auto group-[.position-left]:mr-auto group-[.position-right]:ml-auto group-[.position-left]:text-left group-[.position-right]:text-right"
                field={title}
              />
            )}
            <SubmitInfoForm
              fields={{
                firstNameLabel: {
                  value: dictionary.SUBMITINFOFORM_FirstNameLabel,
                },
                firstNamePlaceholder: {
                  value: dictionary.SUBMITINFOFORM_FirstNamePlaceholder,
                },
                lastNameLabel: {
                  value: dictionary.SUBMITINFOFORM_LastNameLabel,
                },
                lastNamePlaceholder: {
                  value: dictionary.SUBMITINFOFORM_LastNamePlaceholder,
                },
                zipcodeLabel: {
                  value: dictionary.SUBMITINFOFORM_ZipcodeLabel,
                },
                zipcodePlaceholder: {
                  value: dictionary.SUBMITINFOFORM_ZipcodePlaceholder,
                },
                emailLabel: {
                  value: dictionary.SUBMITINFOFORM_EmailLabel,
                },
                emailPlaceholder: {
                  value: dictionary.SUBMITINFOFORM_EmailPlaceholder,
                },
                emailErrorMessage: {
                  value: dictionary.SUBMITINFOFORM_EmailErrorMessage,
                },
                phoneLabel: {
                  value: dictionary.SUBMITINFOFORM_PhoneLabel,
                },
                phonePlaceholder: {
                  value: dictionary.SUBMITINFOFORM_PhonePlaceholder,
                },
                buttonText: {
                  value: dictionary.SUBMITINFOFORM_ButtonText,
                },
                successMessage: {
                  value: dictionary.SUBMITINFOFORM_SuccessMessage,
                },
                buttonVariant: ButtonVariants.PRIMARY,
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="SubmissionForm" />;
};
