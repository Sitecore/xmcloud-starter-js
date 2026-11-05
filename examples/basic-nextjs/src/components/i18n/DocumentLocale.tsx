'use client';

import { useEffect } from 'react';
import { directionFor } from '@/i18n/locale-preference';

/**
 * Keeps <html lang dir> in step with the page language. The root layout sits above the
 * [locale] segment and renders lang="en"; the page also wraps its content in an element with
 * the right lang/dir so the first paint is already correct.
 */
export const DocumentLocale = ({ locale }: { locale: string }): null => {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = directionFor(locale);
  }, [locale]);
  return null;
};
