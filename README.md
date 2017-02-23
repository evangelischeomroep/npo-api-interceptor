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
