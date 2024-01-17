# @tksst/next-app-additions

## 1.4.2

### Patch Changes

- c447197: fix the secretlint options to respect .gitignore and not to expand globs on your shell

## 1.4.1

### Patch Changes

- 0444aba: migrate from [npm-run-all](https://www.npmjs.com/package/npm-run-all) to [npm-run-all2](https://www.npmjs.com/package/npm-run-all2) because the latest release of npm-run-all does not fix this bug: https://github.com/mysticatea/npm-run-all/pull/171

## 1.4.0

### Minor Changes

- 5883d88: introduce eslint-plugin-redos to ESLint configuration

### Patch Changes

- ec14423: fix an execution failure due to PNPM failing with ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF error
  This occurs if `node_modules` is not deleted after running create-next-app

## 1.3.0

### Minor Changes

- 0cfce47: introduce @typescript-eslint to ESLint configuration

### Patch Changes

- e8febbb: update the action used in the workflows of GitHub Actions to be added to the Next.js project

## 1.2.0

### Minor Changes

- 00c7e38: Set ECMAScript version in tsconfig.json to ESNEXT. (Browser compatibility is handled by webpack)
- d3969f5: pin the dependencies installed by create-next-app

## 1.1.1

### Patch Changes

- a2a291f: use "next lint --fix" instead of "eslint --fix" to avoid linting the whole source tree including the .next folder.

## 1.1.0

### Minor Changes

- 302d9de: Stop using external workflows for GitHub Actions to add to Next.js apps, because it's not flexible enough.

## 1.0.0

### Major Changes

- aca31ab: first release
