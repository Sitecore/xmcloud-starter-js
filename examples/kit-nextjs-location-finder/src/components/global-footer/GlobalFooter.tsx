'use client';

import type React from 'react';
import type { GlobalFooterProps } from './global-footer.props';
import { GlobalFooterDefault } from './GlobalFooterDefault.dev';
import { GlobalFooterBlackCompact } from './GlobalFooterBlackCompact.dev';
import { GlobalFooterBlackLarge } from './GlobalFooterBlackLarge.dev';
import { GlobalFooterBlueCentered } from './GlobalFooterBlueCentered.dev';
import { GlobalFooterBlueCompact } from './GlobalFooterBlueCompact.dev';
import { useTranslations } from 'next-intl';
import { dictionaryKeys } from '@/variables/dictionary';
// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<GlobalFooterProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    FOOTER_EmailSubmitLabel: t(dictionaryKeys.FOOTER_EmailSubmitLabel),
    FOOTER_EmailPlaceholder: t(dictionaryKeys.FOOTER_EmailPlaceholder),
    FOOTER_EmailErrorMessage: t(dictionaryKeys.FOOTER_EmailErrorMessage),
    FOOTER_EmailSuccessMessage: t(dictionaryKeys.FOOTER_EmailSuccessMessage),
  };
  props.fields.dictionary = dictionary;

  return <GlobalFooterDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const BlackCompactVariant: React.FC<GlobalFooterProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    FOOTER_EmailSubmitLabel: t(dictionaryKeys.FOOTER_EmailSubmitLabel),
    FOOTER_EmailPlaceholder: t(dictionaryKeys.FOOTER_EmailPlaceholder),
    FOOTER_EmailErrorMessage: t(dictionaryKeys.FOOTER_EmailErrorMessage),
    FOOTER_EmailSuccessMessage: t(dictionaryKeys.FOOTER_EmailSuccessMessage),
  };
  props.fields.dictionary = dictionary;

  return <GlobalFooterBlackCompact {...props} isPageEditing={isEditing} />;
};

export const BlackLargeVariant: React.FC<GlobalFooterProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    FOOTER_EmailSubmitLabel: t(dictionaryKeys.FOOTER_EmailSubmitLabel),
    FOOTER_EmailPlaceholder: t(dictionaryKeys.FOOTER_EmailPlaceholder),
    FOOTER_EmailErrorMessage: t(dictionaryKeys.FOOTER_EmailErrorMessage),
    FOOTER_EmailSuccessMessage: t(dictionaryKeys.FOOTER_EmailSuccessMessage),
  };
  props.fields.dictionary = dictionary;

  return <GlobalFooterBlackLarge {...props} isPageEditing={isEditing} />;
};

export const BlueCenteredVariant: React.FC<GlobalFooterProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    FOOTER_EmailSubmitLabel: t(dictionaryKeys.FOOTER_EmailSubmitLabel),
    FOOTER_EmailPlaceholder: t(dictionaryKeys.FOOTER_EmailPlaceholder),
    FOOTER_EmailErrorMessage: t(dictionaryKeys.FOOTER_EmailErrorMessage),
    FOOTER_EmailSuccessMessage: t(dictionaryKeys.FOOTER_EmailSuccessMessage),
  };
  props.fields.dictionary = dictionary;

  return <GlobalFooterBlueCentered {...props} isPageEditing={isEditing} />;
};

export const BlueCompactVariant: React.FC<GlobalFooterProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    FOOTER_EmailSubmitLabel: t(dictionaryKeys.FOOTER_EmailSubmitLabel),
    FOOTER_EmailPlaceholder: t(dictionaryKeys.FOOTER_EmailPlaceholder),
    FOOTER_EmailErrorMessage: t(dictionaryKeys.FOOTER_EmailErrorMessage),
    FOOTER_EmailSuccessMessage: t(dictionaryKeys.FOOTER_EmailSuccessMessage),
  };
  props.fields.dictionary = dictionary;

  return <GlobalFooterBlueCompact {...props} isPageEditing={isEditing} />;
};
