---
name: data-table-release
description: Releases @johnhalazonetis/data-table via GitHub Actions after merging to main. Use when bumping the package version, shipping a new npm release, or when the user mentions publishing the data-table library.
---

# data-table release

## Do not publish manually

Do **not** run `npm publish` from a local machine. Publishing is handled by CI.

## Workflow

1. **Bump** `version` in [package.json](../../../package.json). It must be **greater than or equal to** the current `latest` on npm (the release job fails if `package.json` is strictly older than npm `latest`).
2. **Commit** the version change (and any code changes) and **push to `main`**.
3. GitHub Actions [.github/workflows/release.yml](../../../.github/workflows/release.yml) on `push` to `main` will:
   - install with `bun install --frozen-lockfile`
   - run `bun run build:lib`
   - publish to npm with OIDC trusted publishing (skips if that version already exists)
   - create git tag `vX.Y.Z` when missing
   - create a GitHub Release with generated notes and attach `dist/data-table.js` and `dist/data-table.css`

Downstream apps (e.g. aidd_frontend) should bump `@johnhalazonetis/data-table` and run `bun install` **after** the workflow has finished and the new version appears on npm.
