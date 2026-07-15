# Cursor Rules for XM Cloud Starter Applications

This directory contains AI coding agent guidance files to help maintain consistent code quality and follow Sitecore XM Cloud best practices across all starter applications in this repository.

## Rules Overview

### Core Rules (Always Applied)
- **`general.mdc`** - Universal coding principles and architecture patterns
- **`code-style.mdc`** - Vibe-coding principles, TypeScript standards, and quality guidelines
- **`project-context.mdc`** - Repository-specific context and multi-starter architecture
- **`safety.mdc`** - Safety rules to prevent editing compiled artifacts and generated files

### Scoped Rules (Applied to Specific Files)
- **`javascript.mdc`** - JavaScript/TypeScript naming conventions, performance, and import patterns
- **`sitecore.mdc`** - Sitecore XM Cloud development patterns and component guidelines
- **`nextjs.mdc`** - Next.js specific patterns, routing, and API development
- **`testing.mdc`** - Testing strategies for XM Cloud components and integrations

## Usage

When using AI coding assistants like Cursor:
1. Rules automatically provide context based on the files you're working with
2. Follow the naming conventions and architectural guidance provided
3. Refer to specific rules when uncertain about implementation approaches
4. All starter applications inherit these rules for consistent development

## XM Cloud Starter Context

This repository contains multiple starter applications:
- **basic-nextjs** - Simple Next.js starter with basic XM Cloud integration
- **kit-nextjs-article-starter** - Editorial-style template (Solterra & Co.)
- **kit-nextjs-location-finder** - Car brand template with location finder (Alaris)
- **kit-nextjs-product-listing** - Product-focused template (SYNC)
- **kit-nextjs-skate-park** - Simple demo site with component examples
- **basic-spa** - SPA starter kit with Angular and Node proxy

Each starter follows the same patterns and conventions defined in these rules while maintaining their unique functionality and design.

## Contributing

To improve these rules:
1. Edit the relevant `.mdc` files in this directory
2. Keep rules under 500 lines and focused on specific concerns
3. Include concrete examples and file references using `@filepath` syntax
4. Test changes with AI coding assistants to ensure effectiveness
5. Consider impact across all starter applications

For more details, see the [Contributing Guide](../CONTRIBUTING.md#ai-assisted-development).

## Development Workflow

When working on any starter application:
- The AI assistant will automatically apply relevant rules based on file types
- XM Cloud-specific patterns will be suggested for component development
- Next.js best practices will be enforced for routing and API development
- Consistent naming and code organization will be maintained across all starters

These rules ensure that all starter applications maintain high code quality and follow established XM Cloud development patterns.
