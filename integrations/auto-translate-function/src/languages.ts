/** Sitecore language codes are case-insensitive ("en", "de-DE", "de-de"). */
export function sameLanguage(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export interface TargetLanguageSelection {
  /** Languages to translate into, spelled the way the site spells them. */
  targets: string[];
  /** Entries of the allow-list that the site doesn't use; they are skipped. */
  notOnSite: string[];
}

/**
 * Picks the languages to translate a page into: the site's languages minus the source
 * language, optionally narrowed to an allow-list (TARGET_LANGUAGES).
 */
export function pickTargetLanguages(
  siteLanguages: readonly string[],
  sourceLanguage: string,
  allowList: readonly string[] = []
): TargetLanguageSelection {
  const candidates = dedupe(siteLanguages).filter((language) => !sameLanguage(language, sourceLanguage));

  if (allowList.length === 0) return { targets: candidates, notOnSite: [] };

  const targets = candidates.filter((language) => allowList.some((allowed) => sameLanguage(allowed, language)));
  const notOnSite = dedupe(allowList).filter(
    (allowed) =>
      !sameLanguage(allowed, sourceLanguage) &&
      !candidates.some((language) => sameLanguage(language, allowed))
  );
  return { targets, notOnSite };
}

function dedupe(languages: readonly string[]): string[] {
  const result: string[] = [];
  for (const language of languages) {
    if (language && !result.some((existing) => sameLanguage(existing, language))) result.push(language);
  }
  return result;
}
