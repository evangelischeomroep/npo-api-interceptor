# NPO API Interceptor

Request Interceptor for using the NPO API with [Axios](https://www.npmjs.com/package/axios), [AngularJS's $http service](https://docs.angularjs.org/api/ng/service/$http) or even [jQuery.ajax](http://api.jquery.com/jQuery.ajax/). Calculates and adds the necessary authorization headers to the request. The NPO API Interceptor can be used both in the browser and in Node.js.

## Installation

Install via npm:

```bash
npm install --save npo-api-interceptor
```

or Yarn:

```bash
yarn add npo-api-interceptor
```

If you don't use a module bundler like Webpack or Browserify in your project, a browser build is available at `lib/npoapiinterceptor.js`. This build makes the NPO API Interceptor available on the global `npoApiInterceptor` variable.

As this depends on [jsSHA](https://github.com/Caligatio/jsSHA/), you need to include that dependency yourself.

## Usage with a module bundler

After installation (see above) you can `import` the interceptor and use it. The interceptor takes at least an API key and secret and returns a function (the actual interceptor) that Axios or AngularJS will call when performing requests. Example:

```js
import axios from 'axios'
import npoApiInterceptor from 'npo-api-interceptor'

axios.interceptors.request.use(npoApiInterceptor({
  key: '<your-key>',
  secret: '<your-secret>'
}))
```

## Usage without a module bundler

After installation (see above) the interceptor is available on the global `npoApiInterceptor` variable. The interceptor takes at least an API key and secret and returns a function (the actual interceptor) that Axios or AngularJS will call when performing requests. Example:

```js
axios.interceptors.request.use(npoApiInterceptor({
  key: '<your-key>',
  secret: '<your-secret>'
}))
```

## Usage with Angular

The NPO API Interceptor can be provided as an [interceptor](https://docs.angularjs.org/api/ng/service/$http#interceptors) to the `$http` service. Example using an anonymous factory:

```js
$httpProvider.interceptors.push(function() {
  return {
    request: npoApiInterceptor({
      key: '<your-key>',
      secret: '<your-secret>'
    })
  };
});
```

## Usage with jQuery.ajax

Even though jQuery.ajax() doesn't have the concept op request interceptors, the NPO API Interceptor can be used to add the necessary headers to the request. But you need to be prepared to jump through a couple of hoops. Example of a Find media (`POST /media`) request:

```js
var interceptor = window.npoApiInterceptor({
  key: '<your-key>',
  secret: '<your-secret>'
});

// An object of the URL parameters you will use:
var params = {
  profile: 'eo',
  max: '100'
};

var url = 'https://rs.poms.omroep.nl/v1/api/media/';

var config = {
  type: 'POST',
  // Add params as query string to the URL
  url: url + '?' + jQuery.params(params),
  // Add params property for NPO API Interceptor, jQuery.ajax doesn't use it
  params: params,
  data: JSON.stringify({
    searches: {
      types: 'SERIES'
    }
  }),
  dataType: 'json'
};

interceptor(config).then(function(config) {
  // Wrap jQuery.ajax in a Promise to return a real Promise instead of a Promise-like jqXHR object
  return new Promise(function(resolve, reject) {
    jQuery.ajax(config).done(resolve).fail(reject);
  });
});
```

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

## Browser support

The NPO API Interceptor depends on two ES2015 features: Promise and Object.assign. Polyfills are not included, you need to polyfill these in your project, depending on your browser support level.

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
3. Push the tags to GitHub: `git push --tags`.
