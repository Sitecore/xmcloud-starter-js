import type React from 'react';
import { useSitecoreContext } from '@sitecore-content-sdk/nextjs';
import type { HeroProps } from './hero.props';
import { HeroDefault } from './HeroDefault.dev';
import { HeroImageBottom } from './HeroImageBottom.dev';
import { HeroImageBottomInset } from './HeroImageBottomInset.dev';
import { HeroImageBackground } from './HeroImageBackground.dev';
import { HeroImageRight } from './HeroImageRight.dev';
import { useI18n } from 'next-localization';
import { dictionaryKeys } from '@/variables/dictionary';
// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<HeroProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  const { t } = useI18n();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel),
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder),
  };
  props.fields.dictionary = dictionary;

  return <HeroDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const ImageBottom: React.FC<HeroProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  const { t } = useI18n();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel),
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder),
  };
  props.fields.dictionary = dictionary;

  return <HeroImageBottom {...props} isPageEditing={isPageEditing} />;
};

export const ImageBottomInset: React.FC<HeroProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  const { t } = useI18n();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel),
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder),
  };
  props.fields.dictionary = dictionary;

  return <HeroImageBottomInset {...props} isPageEditing={isPageEditing} />;
};

export const ImageBackground: React.FC<HeroProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  const { t } = useI18n();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel),
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder),
  };
  props.fields.dictionary = dictionary;

  return <HeroImageBackground {...props} isPageEditing={isPageEditing} />;
};

export const ImageRight: React.FC<HeroProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;
  const { t } = useI18n();
  const dictionary = {
    SubmitCTALabel: t(dictionaryKeys.HERO_SubmitCTALabel),
    ZipPlaceholder: t(dictionaryKeys.HERO_ZipPlaceholder),
  };
  props.fields.dictionary = dictionary;
  return <HeroImageRight {...props} isPageEditing={isPageEditing} />;
};
