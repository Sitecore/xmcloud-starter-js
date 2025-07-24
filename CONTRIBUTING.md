# ✨ Contributing to XMCloud Starter JS Examples

Thank you for your interest in contributing to **XMCloud Starter JS**!  
This guide will help you get started and ensure a smooth contribution process.

---

## ✅ Pre-requisites

Ensure the following tools are installed on your system:

- **Node.js**: Use an [Active LTS version](https://nodejs.org/en/about/releases/).  
  Check with: `node -v`

- **npm**: Version `10` or above.  
  Check with: `npm -v`

---

## 🧪 Development Setup

1. **Fork** this repository to your own GitHub account, and then **clone** it to your local machine:
   ```bash
   git clone https://github.com/<your-username>/xmcloud-starter-js.git
   cd xmcloud-starter-js
   ```


2. Create a new branch and use meaningful branch names, e.g. 
    ```
    git switch -c feature/starter-kit-feature`
    ```

3. Working on an Example

Navigate to the relevant example (e.g., kit-nextjs-article-starter) and start the dev server:

💡 Make sure to populate the required environment variables in your .env.local file to connect to your XM Cloud instance.

      cd examples/kit-nextjs-article-starter.
      npm install
      npm run dev

4. 💡 Coding Guidelines
  - Follow existing file structure, patterns, and naming conventions.

  - Prefer functional components and modern TypeScript best practices.

  - Keep code modular and components small.

  - Reuse existing utilities and scripts when possible.

5. 🚀 Submitting a Pull Request
Once your changes are ready:
Make sure your branch is up-to-date with upstream/main.

    ✅ Before submitting:
      - Run code formatters or linters if configured.
      - Remove unused code and files.
      - Rebase or squash commits into a clean history.

6. Your PR should include:
  - A clear and descriptive title
  - A summary of the changes and the reason for them
  - Screenshots or logs (if applicable)
  - Manual testing steps taken to verify functionality

7. Code Review Process
  - A maintainer will review your PR and may request changes
  - Address any feedback and update your PR
  - Once approved, your changes will be merged
