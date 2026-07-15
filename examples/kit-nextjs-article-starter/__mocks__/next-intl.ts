// Mock for next-intl to handle translations in tests
export const useTranslations = () => {
  // Map dictionary keys to translated values
  const translations: Record<string, string> = {
    // SubscriptionBanner dictionary keys
    'Demo1_SubscriptionBanner_EmailFieldPlaceholder': 'Enter your email address',
    'Demo1_SubscriptionBanner_ButtonLabel': 'Subscribe',
    'Demo1_SubscriptionBanner_FormSuccess': 'Thank you for subscribing!',
    'Demo1_SubscriptionBanner_EmailFormatError': 'Please enter a valid email address',
    // ArticleHeader dictionary keys
    'Demo1_ArticleHeader_Author': 'Author',
    'Demo1_ArticleHeader_WrittenBy': 'Written by',
  };

  return (key: string) => translations[key] || key;
};

export const useLocale = () => 'en';

export const useMessages = () => ({});

export const NextIntlClientProvider = ({ children }: { children: React.ReactNode }) => children;
