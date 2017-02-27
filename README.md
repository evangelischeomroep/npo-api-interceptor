# NPO API Interceptor

Request Interceptor for use with [Axios](https://www.npmjs.com/package/axios). Adds the necessary headers to access the NPO API. Can be used in the browser and in Node.js.

## Usage

Install via npm:

```bash
npm install npo-api-interceptor
```

Then use it:

```js
import axios from 'axios'
import npoApiInterceptor from 'npo-api-interceptor'

axios.interceptors.request.use(npoApiInterceptor({
  key: '<your-key>',
  secret: '<your-secret>'
}))
```

## Usage without a module bundler

If you don't use a module bundler like Webpack or Browserify in your project, a browser build is available at `lib/npoapiinterceptor.js`. This build makes the NPO API Interceptor available on the global `npoApiInterceptor` variable.

As this depends on [jsSHA](https://github.com/Caligatio/jsSHA/), you need to include that dependency yourself.

## Usage in Node.js

When using the NPO API Interceptor server-side, the required `Origin` header isn't present on API requests. Therefore, you should specify an origin in the interceptor config:

```js
axios.interceptors.request.use(npoApiInterceptor({
  key: '<your-key>',
  secret: '<your-secret>',
  origin: 'https://www.example.com'
}))
```

Note that this origin should be whitelisted to access the NPO API.

## Development

If you want, you can use [nvm](https://github.com/creationix/nvm) to manage multiple Node.js versions on your machine.

We use [JavaScript Standard Style](http://standardjs.com/) to format the code. Numerous [text editor plugins](http://standardjs.com/index.html#text-editor-plugins) are available, so you can set up your editor to format the JS code for you.

We use [Babel](http://babeljs.io/) and [Rollup](http://rollupjs.org/) to transpile and bundle the code. The source code is in `src/` and multiple target bundles are built in `lib/`.

We use [Yarn](http://yarnpkg.com/), but [npm](http://npmjs.com/) can also be used. For publishing to the Yarn and npm registries, we currently use npm, because Yarn publish resulted in invalid tar files.

To get started:

1. Clone the repository.
2. Run nvm to switch to the right Node.js version: `nvm use`.
3. Install the dependencies: `yarn install`.

To publish a new version:

1. Create a new version number: `npm version major|minor|patch`. See [SemVer](http://semver.org/).
2. Publish to the registry: `npm publish`. The `lint` and `build` commands will be run automatically, to make sure we're always publishing the latest source and adhere to the style guide.
