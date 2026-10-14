/* eslint-disable */
import { Field } from '@sitecore-content-sdk/nextjs';
import { SiteMetadataProps } from '../../components/site-metadata/site-metadata.props';
import { mockPage } from '../test-utils/mockPage';

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;

// Default mock props with all metadata fields
export const defaultSiteMetadataProps: SiteMetadataProps = {
  rendering: { componentName: 'SiteMetadata' },
  params: {},
  page: mockPage,
  fields: {
    title: createMockField('SYNC - Premium Audio Equipment'),
    metadataTitle: createMockField(
      'SYNC Audio - Professional Headphones & Speakers | Premium Sound Equipment'
    ),
    metadataKeywords: createMockField(
      'audio equipment, headphones, speakers, premium sound, professional audio, SYNC, music gear'
    ),
    metadataDescription: createMockField(
      "Discover SYNC's premium audio equipment collection. Shop professional headphones, speakers, and sound gear designed for audiophiles and music professionals."
    ),
  },
};

// Mock props with only title (no metadata-specific fields)
export const siteMetadataPropsTitleOnly: SiteMetadataProps = {
  rendering: { componentName: 'SiteMetadata' },
  params: {},
  page: mockPage,
  fields: {
    title: createMockField('SYNC - Audio Store'),
    metadataTitle: createMockField(''),
    metadataKeywords: createMockField(''),
    metadataDescription: createMockField(''),
  },
};

// Mock props with metadata title but no regular title
export const siteMetadataPropsMetadataOnly: SiteMetadataProps = {
  rendering: { componentName: 'SiteMetadata' },
  params: {},
  page: mockPage,
  fields: {
    title: createMockField(''),
    metadataTitle: createMockField('Professional Audio Equipment - SYNC'),
    metadataKeywords: createMockField('pro audio, studio equipment'),
    metadataDescription: createMockField(
      'Professional-grade audio equipment for studios and performers.'
    ),
  },
};

// Mock props with empty fields
export const siteMetadataPropsEmpty: SiteMetadataProps = {
  rendering: { componentName: 'SiteMetadata' },
  params: {},
  page: mockPage,
  fields: {
    title: createMockField(''),
    metadataTitle: createMockField(''),
    metadataKeywords: createMockField(''),
    metadataDescription: createMockField(''),
  },
};

// Mock props with minimal content (only title)
export const siteMetadataPropsMinimal: SiteMetadataProps = {
  rendering: { componentName: 'SiteMetadata' },
  params: {},
  page: mockPage,
  fields: {
    title: createMockField('SYNC Audio'),
  },
};

// Mock props with no fields (should show fallback)
export const siteMetadataPropsNoFields: SiteMetadataProps = {
  rendering: { componentName: 'SiteMetadata' },
  params: {},
  page: mockPage,
  fields: null as any,
};

// Mock props with special characters
export const siteMetadataPropsSpecialChars: SiteMetadataProps = {
  rendering: { componentName: 'SiteMetadata' },
  params: {},
  page: mockPage,
  fields: {
    title: createMockField('SYNC™ - Ãudio Prõfessional & Spëcialty Equipment'),
    metadataTitle: createMockField(
      'SYNC™ Audio - "Premium" Headphones & <Speakers> | Pro Audio Equipment'
    ),
    metadataKeywords: createMockField(
      'ãudio, prõfessional, spëcialty, "quotes", <tags>, &amp; symbols'
    ),
    metadataDescription: createMockField(
      'Discover SYNC™ premium audio with "professional" quality <guaranteed> & specialized equipment for music lovers.'
    ),
  },
};

// Mock props with very long content
export const siteMetadataPropsLongContent: SiteMetadataProps = {
  rendering: { componentName: 'SiteMetadata' },
  params: {},
  page: mockPage,
  fields: {
    title: createMockField(
      'SYNC Audio Equipment Store - Premium Professional Headphones Speakers and Audio Gear for Musicians'
    ),
    metadataTitle: createMockField(
      'SYNC Audio Equipment Store - Premium Professional Headphones, Speakers, Microphones, Audio Interfaces, Studio Monitors, Mixing Consoles, and Pro Audio Gear for Musicians, Producers, DJs, and Audio Engineers'
    ),
    metadataKeywords: createMockField(
      'professional audio equipment, premium headphones, studio monitors, audio interfaces, mixing consoles, microphones, speakers, pro audio gear, music production equipment, recording studio gear, live sound equipment, DJ equipment, audio accessories, sound engineering tools, professional music gear, studio headphones, reference monitors, audio cables, rack equipment, portable audio'
    ),
    metadataDescription: createMockField(
      'SYNC Audio Equipment Store offers the most comprehensive selection of premium professional audio equipment including headphones, speakers, microphones, audio interfaces, studio monitors, mixing consoles, and specialized pro audio gear designed for musicians, producers, DJs, audio engineers, and music enthusiasts who demand exceptional sound quality and professional-grade performance for recording, mixing, mastering, live performances, and critical listening applications.'
    ),
  },
};

// Mock props with undefined fields
export const siteMetadataPropsUndefinedFields: SiteMetadataProps = {
  rendering: { componentName: 'SiteMetadata' },
  params: {},
  page: mockPage,
  fields: {
    title: undefined as any,
    metadataTitle: undefined as any,
    metadataKeywords: undefined as any,
    metadataDescription: undefined as any,
  },
};
