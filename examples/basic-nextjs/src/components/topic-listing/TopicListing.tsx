import { Text } from '@sitecore-content-sdk/nextjs';
import { TopicListingProps } from './topic-listing.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { TopicItem } from './TopicItem.dev';
import { getDatasource, getFieldValue } from '@/lib/component-props';

/**
 * Dark gradient band with a large faint watermark, a heading and a grid of
 * topic links separated by hairlines.
 */
export const Default: React.FC<TopicListingProps> = (props) => {
  const { fields, params } = props;
  const datasource = getDatasource(fields);
  const { title, children } = datasource ?? {};
  const titleField = getFieldValue(title);
  const topics = (children?.results ?? []).filter((topic) => Boolean(topic) && typeof topic === 'object');
  const watermark = params?.watermark || 'Results';

  if (!fields) {
    return <NoDataFallback componentName="Topic Listing" />;
  }

  return (
    <section
      data-component="TopicListing"
      className="bg-brand-outcomes relative isolate w-full overflow-hidden px-6 py-28 text-white"
    >
      <p
        className="pointer-events-none absolute inset-x-0 top-10 -z-10 select-none text-center text-[clamp(5rem,13vw,10rem)] font-bold uppercase leading-none tracking-wide text-white/15"
        aria-hidden="true"
      >
        {watermark}
      </p>
      <div className="relative mx-auto max-w-[1311px] pt-32 md:pt-44">
        {titleField && (
          <Text tag="h2" field={titleField} className="mb-12 text-3xl font-medium leading-tight md:text-[2.25rem]" />
        )}
        {!!topics.length && (
          <ul className="grid grid-cols-1 gap-x-12 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <li key={index}>
                <TopicItem {...topic} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
