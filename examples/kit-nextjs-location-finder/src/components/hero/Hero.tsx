'use client';

import type React from 'react';
import type { HeroProps } from './hero.props';
import { HeroDefault } from './HeroDefault.dev';
import { HeroImageBottom } from './HeroImageBottom.dev';
import { HeroImageBottomInset } from './HeroImageBottomInset.dev';
import { HeroImageBackground } from './HeroImageBackground.dev';
import { HeroImageRight } from './HeroImageRight.dev';
import { useTranslations } from 'next-intl';
import { dictionaryKeys } from '@/variables/dictionary';
// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<HeroProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel) || '',
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder) || '',
  };
  if (props.fields) {
    props.fields.dictionary = dictionary;
  }

  return <HeroDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const ImageBottom: React.FC<HeroProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel) || '',
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder) || '',
  };
  if (props.fields) {
    props.fields.dictionary = dictionary;
  }

  return <HeroImageBottom {...props} isPageEditing={isEditing} />;
};

export const ImageBottomInset: React.FC<HeroProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel) || '',
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder) || '',
  };
  if (props.fields) {
    props.fields.dictionary = dictionary;
  }

  return <HeroImageBottomInset {...props} isPageEditing={isEditing} />;
};

export const ImageBackground: React.FC<HeroProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel) || '',
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder) || '',
  };
  if (props.fields) {
    props.fields.dictionary = dictionary;
  }

  return <HeroImageBackground {...props} isPageEditing={isEditing} />;
};

export const ImageRight: React.FC<HeroProps> = (props) => {
  const { isEditing } = props.page.mode;
  const t = useTranslations();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel) || '',
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder) || '',
  };
  if (props.fields) {
    props.fields.dictionary = dictionary;
  }
  return <HeroImageRight {...props} isPageEditing={isEditing} />;
};
