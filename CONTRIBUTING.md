# Contributing to XMCloud Starter JS examples

Want to contribute to XMCloud Starter JS? There are a few things you need to know.

## Pre-requisites:

- `node.js` (Use an [Active LTS](https://nodejs.org/en/about/releases/) version (cmd `node -v` to test)).
- `npm` (`>= 9`) installed (cmd `npm -v` to test).

## Developing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.

2. Create a new branch and use meaningful branch names, e.g. `git switch -c feature/starter-kit-feature`

3. Working on a example
   NOTE: Make sure to populate the necessary env variables in your .env file to connect to your xmcloud instance.

```shell
cd examples/kit-nextjs-article-starter.
npm install
npm run dev
```

4. Coding Guidelines

- Follow existing patterns and naming conventions.
- Prefer functional components and modern TypeScript practices.
- Keep components small and modular.
- Use existing scripts/utilities whenever possible.

5. When you're happy with your changes, open a Pull Request targeting the `dev` branch of the `sitecore/xmcloud-starter-js` repository.Before submitting:

- Run code formatters or linters if configured.
- Remove unused code and files.
- Rebase or squash commits into a clean history.

6. When opening a Pull Request, please:
   - Make sure your branch is up-to-date with upstream/main.
   - Write a clear PR title and description.
   - Include:
     - What was changed and why
     - Screenshots or logs if applicable
     - Manual testing steps

7. Code Review Process

- A maintainer will review your PR and may request changes
- Address any feedback and update your PR
- Once approved, your changes will be merged
