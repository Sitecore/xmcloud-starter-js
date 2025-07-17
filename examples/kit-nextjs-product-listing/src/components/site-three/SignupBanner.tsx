import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Field,
  Image as ContentSdkImage,
  ImageField,
  RichText as ContentSdkRichText,
  RichTextField,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { useI18n } from 'next-localization';

interface Fields {
  Heading: Field<string>;
  Subheading: RichTextField;
  Image: ImageField;
  Image2: ImageField;
}

type SignupBannerProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const DICTIONARY_KEYS = {
  SIGNUPBANNER_ButtonLabel: 'Signup_Form_Button_Label',
  SIGNUPBANNER_InputPlaceholder: 'Signup_Form_Input_Placeholder',
};

export const Default = (props: SignupBannerProps) => {
  const { fields } = props;
  const { t } = useI18n();

  return (
    <section className={`relative px-4 ${props.params.styles}`} data-class-change>
      <div className="absolute inset-0 z-10">
        <ContentSdkImage field={fields.Image} className="w-full h-full object-cover" />
      </div>

      <div className="relative container mx-auto overflow-hidden backdrop-blur-[20px] bg-[linear-gradient(136deg,rgba(78,76,76,0.15)_2.61%,rgba(78,76,76,0.30)_73.95%)] z-20">
        <div className="relative px-4 sm:px-8 py-14 sm:py-16 text-center text-white h-full flex flex-col justify-center">
          <div className="max-w-[38rem] mx-auto">
            <h3 className="lg:text-5xl text-2xl mb-4 uppercase">
              <ContentSdkText field={fields.Heading} />
            </h3>

            <div className="text-lg leading-relaxed mb-6">
              <ContentSdkRichText field={fields.Subheading} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder={t(DICTIONARY_KEYS.SIGNUPBANNER_InputPlaceholder)}
                  className="px-4 text-sm text-gray-900 bg-muted placeholder-muted-foreground transition-all duration-200 rounded-full focus:outline-none focus:ring-0 focus:border-transparent border-0 outline-none focus:shadow-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
                />
              </div>

              <Button className="btn btn-primary">
                {t(DICTIONARY_KEYS.SIGNUPBANNER_ButtonLabel)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContentLeft = (props: SignupBannerProps) => {
  const { fields } = props;
  const { t } = useI18n();

  return (
    <section className={`relative px-4 ${props.params.styles}`} data-class-change>
      <div className="absolute inset-0 z-10">
        <ContentSdkImage field={fields.Image} className="w-full h-full object-cover" />
      </div>
      <div className="relative container mx-auto z-20">
        <div className="lg:max-w-[60%] h-full overflow-hidden backdrop-blur-[20px] bg-[linear-gradient(136deg,rgba(78,76,76,0.15)_2.61%,rgba(78,76,76,0.30)_73.95%)]">
          <div className="relative px-4 sm:px-8 py-8 sm:py-16 py-14 text-white h-full flex flex-col justify-center">
            <div className="max-w-[38rem] mx-auto">
              <h1 className="text-2xl lg:text-5xl mb-4 text-left">
                <ContentSdkText field={fields.Heading} />
              </h1>

              <div className="text-lg mb-6 leading-relaxed text-left">
                <ContentSdkRichText field={fields.Subheading} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder={t(DICTIONARY_KEYS.SIGNUPBANNER_InputPlaceholder)}
                    className="px-4 text-sm text-gray-900 bg-muted placeholder-muted-foreground transition-all duration-200 rounded-full focus:outline-none focus:ring-0 focus:border-transparent border-0 outline-none focus:shadow-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
                  />
                </div>

                <Button className="btn btn-primary">
                  {t(DICTIONARY_KEYS.SIGNUPBANNER_ButtonLabel)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BackgroundPrimary = (props: SignupBannerProps) => {
  const { fields } = props;
  const { t } = useI18n();

  return (
    <section
      className={`relative bg-primary overflow-hidden py-8 px-4 ${props.params.styles}`}
      data-class-change
    >
      <div className="absolute bottom-8 lg:top-1/2 left-0 lg:-left-[16%] lg:-translate-y-1/2 bg-sound-waves bg-repeat lg:bg-no-repeat lg:bg-contain bg-center w-full h-20 lg:w-2/5 lg:h-auto lg:aspect-3/1"></div>
      <div className="hidden lg:block absolute top-0 lg:top-1/2 right-0 lg:-right-[16%] lg:-translate-y-1/2 bg-sound-waves bg-repeat lg:bg-no-repeat lg:bg-contain bg-center w-1/2 lg:w-2/5 aspect-3/1"></div>

      <div className="relative container mx-auto pb-28 lg:py-16 text-center h-full flex flex-col justify-center z-20">
        <div className="lg:w-1/2 max-w-[38rem] mx-auto">
          <h3 className="lg:text-5xl text-2xl mb-4 uppercase">
            <ContentSdkText field={fields.Heading} />
          </h3>

          <div className="text-lg leading-relaxed mb-6">
            <ContentSdkRichText field={fields.Subheading} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder={t(DICTIONARY_KEYS.SIGNUPBANNER_InputPlaceholder)}
                className="px-4 text-sm text-gray-900 bg-muted placeholder-muted-foreground transition-all duration-200 rounded-full focus:outline-none focus:ring-0 focus:border-transparent border-0 outline-none focus:shadow-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>

            <Button className="btn btn-primary outline">
              {t(DICTIONARY_KEYS.SIGNUPBANNER_ButtonLabel)}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BackgroundDark = (props: SignupBannerProps) => {
  const { fields } = props;
  const { t } = useI18n();

  return (
    <section className={`relative bg-black py-8 px-4 ${props.params.styles}`} data-class-change>
      <div className="absolute h-20 lg:h-auto bottom-8 left-0 right-0 lg:inset-0 mask-add mask-[var(--background-image-sound-waves),var(--background-image-sound-waves)] mask-[position:center] lg:mask-[position:-27%_50%,127%_50%] mask-size-[contain] lg:mask-size-[40%] lg:mask-no-repeat bg-primary z-10">
        <ContentSdkImage
          field={fields.Image}
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </div>

      <div className="relative z-40 container mx-auto pb-28 lg:py-16 text-center text-white h-full flex flex-col justify-center">
        <div className="lg:w-1/2 max-w-[38rem] mx-auto">
          <h3 className="lg:text-5xl text-2xl mb-4 uppercase">
            <ContentSdkText field={fields.Heading} />
          </h3>

          <div className="text-lg leading-relaxed mb-6">
            <ContentSdkRichText field={fields.Subheading} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder={t(DICTIONARY_KEYS.SIGNUPBANNER_InputPlaceholder)}
                className="px-4 text-sm text-gray-900 bg-muted placeholder-muted-foreground transition-all duration-200 rounded-full focus:outline-none focus:ring-0 focus:border-transparent border-0 outline-none focus:shadow-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>

            <Button className="btn btn-outline">
              {t(DICTIONARY_KEYS.SIGNUPBANNER_ButtonLabel)}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
