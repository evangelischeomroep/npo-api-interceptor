# npo-api-interceptor

A public npm package that signs requests to the NPO API (POMS) with an API key and secret, for Axios, AngularJS's `$http` and `jQuery.ajax`, in the browser and in Node.js. Outside users install it from npm, so its README is written for them.

## What we never compromise on

1. **Only NPO API requests are signed.** The `Authorization` header carries the API key, so a request to any URL outside the production and test NPO API is returned untouched. The tests check this; keep it that way when you add a URL.

## Ways to hurt yourself

1. **Testing a stale build.** The tests import `lib/npoapiinterceptor.cjs.js`, not `src/`. Run `yarn build` before `yarn test`, or you test the previous build.
2. **Publishing with Yarn.** `yarn publish` produced invalid tar files. Use Yarn for development and `npm` for versioning and publishing.

## Running locally

1. Clone the repository.
2. Switch to the Node.js version in `.nvmrc`: `nvm use`. nvm is optional.
3. Install the dependencies: `yarn install`.

## Done means green

A change is done when this passes:

```bash
yarn lint && yarn build && yarn test
```

There is no CI; `npm publish` runs the same three through `prepublish`. `yarn lint` checks [JavaScript Standard Style](http://standardjs.com/); one of its [editor plugins](http://standardjs.com/index.html#text-editor-plugins) formats as you type.

## Releasing

1. Create a new version number: `npm version major|minor|patch`. See [SemVer](http://semver.org/). This runs the build, adds the built files to the version commit, and pushes the commit and its tag.
2. Publish to the registry: `npm publish`. The `lint`, `build` and `test` commands run first, so the published package is always built from the latest source and follows the style guide.

## Documentation

Most changes need no documentation; agents can read the code.

- The README is for the package's users: keep its install and usage instructions current when the API changes.
- A reason that belongs to one spot in the code goes in a short comment there.

## How it works

`createNpoApiInterceptor` takes a key, a secret and an optional origin, and returns the interceptor. For a request under one of the NPO API URLs, it builds a message from the origin, the date and the path with the sorted query parameters, signs it with HMAC-SHA256 through jsSHA, and resolves to a copy of the config with the NPO headers. In a browser the origin comes from `window.location`; in Node.js it comes from the config and is also sent as the `Origin` header. Babel and Rollup build five bundles from `src/` into `lib/`: CommonJS and ES modules for Node.js and for browsers, and a browser build that sets the global `npoApiInterceptor`. jsSHA stays external in every bundle.

## Where code lives

- `src/` - the source.
- `lib/` - the built bundles. They are committed and published, so never edit them by hand; `npm version` rebuilds them.
- `config/` - one Rollup config per bundle.
