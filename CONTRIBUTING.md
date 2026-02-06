# Contributing

Contributions are always welcome, no matter how large or small!

Please follow the Code of Conduct in all interactions with the project. Before contributing, read the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [Yarn workspaces](https://yarnpkg.com/features/workspaces). It contains the following packages:

- The library package in the repository root.
- An example app in the `example/` directory.

To get started, run the following from the repository root to install dependencies:

```sh
yarn
```

> Note: this repository uses Yarn workspaces. Using `npm` for development is not supported.

The [example app](/example/) demonstrates usage of the library and is configured to use the local package. Changes to the library's JavaScript code will appear in the example app without rebuilding; native code changes require a rebuild of the example app.

If you want to edit native code, open `example/android` in Android Studio or `example/ios` in Xcode. To edit Objective‑C or Swift files open `example/ios/AirwallexPaymentReactNativeExample.xcworkspace` in Xcode; the development pod is located at `Pods > Development Pods > airwallex-payment-react-native`.

To edit Java or Kotlin files, open `example/android` in Android Studio and find the `airwallex-payment-react-native` module.

Common commands (run from repository root):

Start the Metro bundler:

```sh
yarn example start
```

Run the example app on Android (emulator or device):

```sh
yarn example android
```

Run the example app on iOS (simulator or device):

```sh
yarn example ios
```

Verify TypeScript and ESLint:

```sh
yarn typecheck
yarn lint
```

Fix formatting issues:

```sh
yarn lint --fix
```

Run unit tests:

```sh
yarn test
```

### Commit message convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/en) specification for commit messages:

- `fix`: bug fixes (e.g. fix crash due to deprecated method)
- `feat`: new features (e.g. add new public method)
- `refactor`: code refactor (e.g. migrate from class components to hooks)
- `docs`: changes to documentation (e.g. add usage example)
- `test`: adding or updating tests (e.g. add integration tests)
- `chore`: tooling or config changes (e.g. update CI)

Our pre-commit hooks verify that commit messages follow this format.

### Linting and tests

We use TypeScript for type checking, ESLint with Prettier for linting/formatting, and Jest for testing. Our pre-commit hooks verify that linters and tests pass when committing.

### Publishing to npm

We use [release-it](https://github.com/release-it/release-it) to publish releases (bump versions, create tags/releases).

To publish a new release:

```sh
yarn release
```

### Scripts

Common `package.json` scripts:

- `yarn` — install dependencies
- `yarn typecheck` — run TypeScript type checking
- `yarn lint` — run ESLint + Prettier checks
- `yarn lint --fix` — fix fixable lint/format issues
- `yarn test` — run unit tests
- `yarn example start` — start Metro for the example app
- `yarn example android` — build and run the example on Android
- `yarn example ios` — build and run the example on iOS

### Sending a pull request

> **New to contributing?** See this free guide: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When opening a pull request:

- Prefer small, focused PRs.
- Ensure linters and tests are passing.
- Update documentation where appropriate.
- Follow the repository's pull request template.
- For PRs that change public APIs or implementation, open an issue first to discuss with maintainers.

### Suggested additions (optional)

- A PR checklist (e.g. tests added, lint passed, changelog or release notes updated).
- Branch naming conventions (e.g. `feature/*`, `fix/*`, `chore/*`).
- How to rebuild the example app after native changes (clean, install pods, rebuild from Android Studio/Xcode).
- How to run end-to-end tests if available (detox / other).
- Security reporting guidelines (where to report vulnerabilities).
- Reference to CODEOWNERS or maintainers for review guidance.

If you'd like, I can commit these changes for you or open a patch/PR. Which would you prefer?
