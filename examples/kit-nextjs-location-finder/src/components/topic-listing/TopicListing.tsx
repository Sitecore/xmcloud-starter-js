import { Meteors } from '@/components/magicui/meteors';
import { Text } from '@sitecore-content-sdk/nextjs';
import { TopicListingProps } from './topic-listing.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { TopicItem } from './TopicItem.dev';

export const Default: React.FC<TopicListingProps> = (props) => {
  const { fields } = props;
  const { title, children } = fields?.data?.datasource ?? {};

  if (fields?.data?.datasource) {
    return (
      <div className="bg-primary relative overflow-hidden py-24 md:pb-[128px] md:pt-28 @container">
        <div
          className="absolute inset-0 z-10"
          style={
            {
              '--meteor-color': '255, 255, 255',
              '--meteor-opacity': '0.6',
            } as React.CSSProperties
          }
        >
          <Meteors
            number={40}
            minDelay={0.2}
            maxDelay={1.5}
            minDuration={18}
            maxDuration={38}
            angle={310}
            size="3"
          />
        </div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-16 text-center md:gap-24">
            <div className="flex max-w-4xl flex-col items-center gap-4">
              {title && (
                <Text
                  tag="h2"
                  field={title?.jsonValue}
                  className="font-heading text-4xl @sm:text-5xl @md:text-6xl @lg:text-7xl font-semibold tracking-normal leading-tight text-white"
                />
              )}
            </div>
            {children?.results && (
              <div className="flex flex-wrap items-center justify-center gap-6">
                {children.results.map((topic, index) => (
                  <TopicItem key={index} {...topic} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="Topic Listing" />;
};
