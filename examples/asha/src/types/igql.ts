import type {
  GraphQLImageField,
  GraphQLLinkField,
  GraphQLRichTextField,
  GraphQLTextField,
} from '@/lib/component-props';

// Backward-compatible aliases. Prefer GraphQL*Field types from @/lib/component-props.
export type IGQLTextField = GraphQLTextField;
export type IGQLImageField = GraphQLImageField;
export type IGQLLinkField = GraphQLLinkField;
export type IGQLRichTextField = GraphQLRichTextField;
