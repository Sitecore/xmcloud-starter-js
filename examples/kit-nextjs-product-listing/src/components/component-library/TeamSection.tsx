import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { IGQLImageField, IGQLLinkField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';
import { Button } from 'shadcd/components/ui/button';
import { ReactNode, useMemo, type JSX } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'shadcd/components/ui/carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';

interface Fields {
  data: {
    datasource: {
      children: {
        results: TeamMemberFields[];
      };
      tagLine: IGQLTextField;
      heading: IGQLTextField;
      text: IGQLRichTextField;
      heading2: IGQLTextField;
      text2: IGQLRichTextField;
      link: IGQLLinkField;
    };
  };
}

interface TeamMemberFields {
  id: string;
  image: IGQLImageField;
  fullName: IGQLTextField;
  jobTitle: IGQLTextField;
  description: IGQLRichTextField;
  facebook: IGQLLinkField;
  instagram: IGQLLinkField;
  linkedIn: IGQLLinkField;
  twitterX: IGQLLinkField;
}

type TeamSectionProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type TeamMemberImageProps = {
  image: IGQLImageField;
  type: 'circle' | 'square' | 'rectangle';
  className?: string;
};

type TeamMemberStyleProps = {
  type: 'simple' | 'horizontal';
  imageType: TeamMemberImageProps['type'];
  centered?: boolean;
};

type TeamMemberCardProps = TeamMemberStyleProps & {
  tm: TeamMemberFields;
};

type TeamSectionTemplateVerticalProps = TeamSectionProps & {
  teamMemberProps: TeamMemberStyleProps;
  columns: 1 | 2 | 3 | 4;
  centered?: boolean;
  children?: ReactNode;
};

type TeamSectionTemplateHorizontalProps = TeamSectionProps & {
  teamMemberProps: TeamMemberStyleProps;
  columns: 1 | 2;
};

const TeamMemberImage = (props: TeamMemberImageProps) => {
  switch (props.type) {
    case 'circle':
      return (
        <ContentSdkImage
          field={props.image?.jsonValue}
          width={80}
          height={80}
          className={`inline-block object-cover rounded-full ${props.className}`}
        />
      );
    case 'rectangle':
      return (
        <ContentSdkImage
          field={props.image?.jsonValue}
          width={400}
          height={300}
          className={`inline-block w-full object-cover aspect-3/2 ${props.className}`}
        />
      );
    default:
      return (
        <ContentSdkImage
          field={props.image?.jsonValue}
          width={400}
          height={400}
          className={`inline-block w-full object-cover aspect-square ${props.className}`}
        />
      );
  }
};

const TeamMemberCard = (props: TeamMemberCardProps) => {
  const socialLinks = useMemo(
    () => (
      <div className={`flex ${props.centered ? 'justify-center' : ''} gap-4 mt-6`}>
        <ContentSdkLink field={props.tm.facebook?.jsonValue} prefetch={false}>
          <FontAwesomeIcon icon={faFacebook} width={20} height={20} />
        </ContentSdkLink>
        <ContentSdkLink field={props.tm.instagram?.jsonValue} prefetch={false}>
          <FontAwesomeIcon icon={faInstagram} width={22} height={22} />
        </ContentSdkLink>
        <ContentSdkLink field={props.tm.linkedIn?.jsonValue} prefetch={false}>
          <FontAwesomeIcon icon={faLinkedinIn} width={24} height={24} />
        </ContentSdkLink>
        <ContentSdkLink field={props.tm.twitterX?.jsonValue} prefetch={false}>
          <FontAwesomeIcon icon={faXTwitter} width={22} height={22} />
        </ContentSdkLink>
      </div>
    ),
    [
      props.centered,
      props.tm.facebook?.jsonValue,
      props.tm.instagram?.jsonValue,
      props.tm.linkedIn?.jsonValue,
      props.tm.twitterX?.jsonValue,
    ]
  );

  switch (props.type) {
    case 'horizontal':
      return (
        <div className="flex items-start gap-12">
          <TeamMemberImage
            image={props.tm.image}
            type={props.imageType}
            className="shrink-0 max-w-1/3"
          />
          <div>
            <h3 className="text-lg font-bold">
              <ContentSdkText field={props.tm.fullName?.jsonValue} />
            </h3>
            <h6 className="text-lg mb-4">
              <ContentSdkText field={props.tm.jobTitle?.jsonValue} />
            </h6>
            <div>
              <ContentSdkRichText field={props.tm.description?.jsonValue} />
            </div>
            {socialLinks}
          </div>
        </div>
      );
    default:
      return (
        <div className={props.centered ? 'text-center' : ''}>
          <TeamMemberImage image={props.tm.image} type={props.imageType} />
          <h3 className="text-lg font-bold mt-6">
            <ContentSdkText field={props.tm.fullName?.jsonValue} />
          </h3>
          <h6 className="text-lg mb-4">
            <ContentSdkText field={props.tm.jobTitle?.jsonValue} />
          </h6>
          <div>
            <ContentSdkRichText field={props.tm.description?.jsonValue} />
          </div>
          {socialLinks}
        </div>
      );
  }
};

const TeamSectionTemplateVertical = (props: TeamSectionTemplateVerticalProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className={`${props.centered ? 'max-w-3xl mx-auto text-center' : ''}`}>
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text?.jsonValue} />
          </div>
        </div>
        <div
          className={`grid ${
            props.columns !== 1 ? `md:grid-cols-2 lg:grid-cols-${props.columns}` : ''
          } ${props.columns === 2 ? 'gap-16' : 'gap-x-8 gap-y-16'} my-20`}
        >
          {!!props.children
            ? props.children
            : datasource.children.results.map((tm) => (
                <TeamMemberCard key={tm.id} tm={tm} {...props.teamMemberProps} />
              ))}
        </div>
        <div className={`${props.centered ? 'max-w-3xl mx-auto text-center' : ''}`}>
          <h3 className="text-3xl font-bold mb-4">
            <ContentSdkText field={datasource.heading2?.jsonValue} />
          </h3>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text2?.jsonValue} />
          </div>
          <Button asChild={true} className="mt-8">
            <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
          </Button>
        </div>
      </div>
    </section>
  );
};

const TeamSectionTemplateHorizontal = (props: TeamSectionTemplateHorizontalProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className={`grid md:grid-cols-${props.columns + 1} gap-x-16 gap-y-12`}>
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.text?.jsonValue} />
            </div>
            <Button asChild={true} className="mt-8">
              <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
            </Button>
          </div>
          <div className={`grid md:grid-cols-${props.columns} gap-8 md:col-span-${props.columns}`}>
            {datasource.children.results.map((tm) => (
              <TeamMemberCard key={tm.id} tm={tm} {...props.teamMemberProps} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamSectionTemplateCarousel = (props: TeamSectionTemplateVerticalProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <TeamSectionTemplateVertical {...props}>
      <Carousel>
        <CarouselContent className="pb-16">
          {datasource.children.results.map((tm) => (
            <CarouselItem key={tm.id} className="md:basis-1/2 lg:basis-1/3">
              <TeamMemberCard tm={tm} {...props.teamMemberProps} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-0 right-0 flex items-center gap-2">
          <CarouselPrevious className="relative inset-0 translate-0" />
          <CarouselNext className="relative inset-0 translate-0" />
        </div>
      </Carousel>
    </TeamSectionTemplateVertical>
  );
};

export const Default = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateVertical
      columns={3}
      centered
      teamMemberProps={{ type: 'simple', imageType: 'circle', centered: true }}
      {...props}
    />
  );
};

export const TeamSection1 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateVertical
      columns={3}
      {...props}
      centered
      teamMemberProps={{ type: 'simple', imageType: 'rectangle', centered: true }}
    />
  );
};

export const TeamSection2 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateVertical
      columns={4}
      centered
      teamMemberProps={{ type: 'simple', imageType: 'circle' }}
      {...props}
    />
  );
};

export const TeamSection3 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateVertical
      columns={4}
      centered
      teamMemberProps={{ type: 'simple', imageType: 'square' }}
      {...props}
    />
  );
};

export const TeamSection4 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateVertical
      columns={2}
      centered
      teamMemberProps={{ type: 'horizontal', imageType: 'circle' }}
      {...props}
    />
  );
};

export const TeamSection5 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateVertical
      columns={2}
      centered
      teamMemberProps={{ type: 'horizontal', imageType: 'square' }}
      {...props}
    />
  );
};

export const TeamSection6 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateHorizontal
      columns={2}
      teamMemberProps={{ type: 'simple', imageType: 'circle' }}
      {...props}
    />
  );
};

export const TeamSection7 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateHorizontal
      columns={2}
      teamMemberProps={{ type: 'simple', imageType: 'rectangle' }}
      {...props}
    />
  );
};

export const TeamSection8 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateHorizontal
      columns={1}
      teamMemberProps={{ type: 'horizontal', imageType: 'circle' }}
      {...props}
    />
  );
};

export const TeamSection9 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateHorizontal
      columns={1}
      teamMemberProps={{ type: 'horizontal', imageType: 'square' }}
      {...props}
    />
  );
};

export const TeamSection10 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateCarousel
      columns={1}
      teamMemberProps={{ type: 'simple', imageType: 'circle' }}
      {...props}
    />
  );
};

export const TeamSection11 = (props: TeamSectionProps): JSX.Element => {
  return (
    <TeamSectionTemplateCarousel
      columns={1}
      teamMemberProps={{ type: 'simple', imageType: 'square' }}
      {...props}
    />
  );
};
