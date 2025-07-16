import React from 'react';
import {
  Link,
  useSitecore,
  Text,
  Field,
  ImageField,
  LinkField,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton as Button } from '@/components/button-component/ButtonComponent';
import { ComponentProps } from '@/lib/component-props';
import { ReferenceField } from '@/types/ReferenceField.props';
import { AuthorReferenceField } from '@/types/AuthorTaxonomy.props';

interface ArticleListingParams {
  [key: string]: any; // eslint-disable-line
}

type ArticleItemReferenceField = ReferenceField & {
  fields: ArticleItem;
};

interface ArticleItem {
  pageTitle: Field<string>;
  pageSummary: Field<string>;
  pageThumbnail: ImageField;
  pageReadTime: Field<string>;
  taxAuthor: AuthorReferenceField;
}

interface ArticleListingFields {
  titleOptional?: Field<string>;
  descriptionOptional?: Field<string>;
  linkOptional?: LinkField;
  featuredContent: ArticleItemReferenceField[];
}

interface ArticleListingProps extends ComponentProps {
  params: ArticleListingParams;
  fields: ArticleListingFields;
  isPageEditing?: boolean;
}

interface TransformedArticle {
  link: string;
  image: string;
  title: string;
  summary: string;
  author: string;
  authorImage: string;
  readTime: string;
}

export const Default: React.FC<ArticleListingProps> = ({
  fields,
  params,
  isPageEditing: propIsEditing,
}) => {
  const { titleOptional, descriptionOptional, linkOptional, featuredContent } = fields;
  const { page } = useSitecore();
  const contextIsEditing = page.mode.isEditing;

  // Use the prop value if provided, otherwise fall back to the context value
  const isPageEditing = propIsEditing !== undefined ? propIsEditing : contextIsEditing;

  // Transform the featuredContent array into the format needed for rendering
  const articles: TransformedArticle[] = React.useMemo(() => {
    if (!featuredContent?.length) return [];

    return featuredContent.map((article) => ({
      link: article.url || '',
      image: article.fields.pageThumbnail?.value?.src || '',
      title: article.fields.pageTitle?.value || '',
      summary: article.fields.pageSummary?.value || '',
      author: `${article.fields.taxAuthor?.fields?.personFirstName?.value || ''} ${
        article.fields.taxAuthor?.fields?.personLastName?.value || ''
      }`.trim(),
      authorImage: article.fields.taxAuthor?.fields?.personProfileImage?.value?.src || '',
      readTime: article.fields.pageReadTime?.value || '',
    }));
  }, [featuredContent]);

  if (fields) {
    // Split articles into featured (first 2) and regular (remaining)
    const featuredArticles = articles.slice(0, 2);
    const regularArticles = articles.slice(2);

    return (
      <div
        data-component="ArticleListing"
        className="@container"
        aria-label="Article listing section"
      >
        <div className={cn('w-full', params?.styles)}>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {(titleOptional || linkOptional?.value?.href || isPageEditing) && (
              <div className="@md:flex-row @md:justify-between @md:items-center mb-20 flex flex-col">
                {titleOptional && (
                  <div className="@md:mb-0 mb-4">
                    <Text
                      tag="h2"
                      field={titleOptional}
                      className="font-heading @md:text-6xl text-primary text-4xl font-normal leading-[1.20] tracking-tighter"
                    />

                    {descriptionOptional && (
                      <Text
                        tag="p"
                        field={descriptionOptional}
                        className="text-muted-foreground font-body mt-[20px] max-w-3xl text-lg font-normal leading-relaxed"
                      />
                    )}
                  </div>
                )}

                {(linkOptional?.value?.href || isPageEditing) && (
                  <div>
                    <Button
                      buttonLink={
                        linkOptional || {
                          value: {
                            href: '',
                            text: 'Add link',
                            linktype: 'external',
                            url: '',
                            anchor: '',
                            target: '',
                          },
                        }
                      }
                      isPageEditing={isPageEditing}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Featured articles - 2 column layout */}
            <div className="@md:grid-cols-2 mb-[28px] grid gap-8">
              {featuredArticles.map((article, index) => (
                <div key={index} className="@md:mb-0 group/article mb-6">
                  {isPageEditing ? (
                    <div className="rounded-default @md:mb-0 mb-4 aspect-[3/2] w-full overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="rounded-default @md:mb-0 mb-4 aspect-[3/2] w-full cursor-pointer overflow-hidden"
                      onClick={() => (window.location.href = article.link)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && (window.location.href = article.link)}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover/article:scale-105"
                      />
                    </div>
                  )}
                  <div className="@md:p-8">
                    {isPageEditing ? (
                      <h3 className="font-heading text-card-foreground text-3xl font-medium leading-[1.30] -tracking-[0.9px]">
                        {article.title}
                      </h3>
                    ) : (
                      <Link field={{ value: { href: article.link } }} className="block">
                        <h3 className="font-heading text-card-foreground text-3xl font-medium leading-[1.30] -tracking-[0.9px] decoration-1 underline-offset-4 group-hover/article:underline group-focus/article:underline">
                          {article.title}
                        </h3>
                      </Link>
                    )}
                    <p className="text-secondary-foreground text-normal mt-4 line-clamp-2 text-lg leading-[1.5] tracking-tighter">
                      {article.summary}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      {(article.authorImage || article.author) && (
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                          {article.authorImage ? (
                            <img
                              src={article.authorImage}
                              alt={`${article.author} avatar`}
                              className="h-full w-full object-cover"
                            />
                          ) : article.author ? (
                            <span className="text-xs font-medium">
                              {article.author
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          ) : null}
                        </div>
                      )}
                      <div className="flex items-center gap-[9px]">
                        {article.author && (
                          <p className="font-body text-accent-foreground text-sm font-medium">
                            {article.author}
                          </p>
                        )}
                        {article.author && article.readTime && (
                          <span className="text-accent text-sm">•</span>
                        )}
                        <p className="text-accent-foreground text-sm">{article.readTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Regular articles - 3 column compact layout */}
            <div className="@sm:grid-cols-2 @lg:grid-cols-3 grid gap-8">
              {regularArticles.map((article, index) => (
                <div
                  key={index}
                  className="@md:p-8 rounded-default hover:bg-tertiary-hover focus:ring-accent group/article flex h-full flex-col p-4 transition-colors focus:outline-none focus:ring-2"
                >
                  <div>
                    {isPageEditing ? (
                      <h3 className="font-heading text-card-foreground text-2xl font-medium leading-normal tracking-tighter">
                        {article.title}
                      </h3>
                    ) : (
                      <Link field={{ value: { href: article.link } }} className="block">
                        <h3 className="font-heading text-card-foreground text-2xl font-medium leading-normal tracking-tighter decoration-1 underline-offset-4 group-hover/article:underline group-focus/article:underline">
                          {article.title}
                        </h3>
                      </Link>
                    )}
                  </div>
                  <div className="mt-auto flex items-center gap-4 pt-6">
                    {(article.authorImage || article.author) && (
                      <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                        {article.authorImage ? (
                          <img
                            src={article.authorImage}
                            alt={`${article.author} avatar`}
                            className="h-full w-full object-cover"
                          />
                        ) : article.author ? (
                          <span className="text-xs font-medium">
                            {article.author
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        ) : null}
                      </div>
                    )}
                    <div className="flex items-center gap-[9px]">
                      {article.author && (
                        <p className="font-body text-accent-foreground text-sm font-medium">
                          {article.author}
                        </p>
                      )}
                      {article.author && article.readTime && (
                        <span className="text-accent text-sm">•</span>
                      )}
                      <p className="text-accent-foreground text-sm">{article.readTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="ArticleListing" />;
};
