# Hapi Namepsaced Routes

[![npm version](https://badge.fury.io/js/hapi-namespaced-routes.svg)](https://badge.fury.io/js/hapi-namespaced-routes)
[![Build Status](https://travis-ci.org/AaronLeoCooper/hapi-namespaced-routes.svg?branch=master)](https://travis-ci.org/AaronLeoCooper/hapi-namespaced-routes)
[![Coverage Status](https://coveralls.io/repos/github/AaronLeoCooper/hapi-namespaced-routes/badge.svg?branch=master)](https://coveralls.io/github/AaronLeoCooper/hapi-namespaced-routes?branch=master)

A Hapi plugin to enable writing routes with a namespace (prefix) with
a minimal API.


## Usage

Install the module:

```bash
npm install hapi-namespaced-routes
```

Then register it in your Hapi app:

```javascript
const server = new Hapi.Server()

server.register(require('hapi-namespaced-routes'))
```

And finally, add your app routes anywhere you have access to your app
`server` instance:

```javascript
server.methods.namespacedRoute({
  namespace: '/posts',
  routes: [
    {
      method: 'GET',
      path: '',
      handler: postsHandler
    },
    {
      method: 'GET',
      path: '/comments',
      handler: commentsHandler
    }
  ]
})

/**
 * Generates these routes:
 *   /posts
 *   /posts/comments
 */
```


## How it works

The logic in this plugin is deliberately simple: its sole purpose is to prefix
routes with a namespace in their path. Once all passed routes have been
prefixed, they are passed to Hapi's built-in `server.route` method, so anything
you add to route objects will also be passed through unaffected.


## Todos

In the interests of keeping this module small I probably won't add a lot of
extra features. That said, I'm open to ideas!

These are the currently planned additions sometime in the near future:

- [ ] Ability to inject routes at registration time
- [ ] "Global" namespace option (for auto-wrapping all passed in routes)


## Alternatives

One alternative package I've seen that does a similar job to this plugin is
dsernst's [hapi-namespace](https://github.com/dsernst/hapi-namespace).
It offers an alternative API— opting to use a wrapper function to accept the
namespace and routes as parameters, and it doesn't explicitly require Hapi
since it doesn't use Hapi's plugin system, so that might be a more favourable
option depending on your needs.

There's probably a few other options out there too in the wild. Feel free to
bring any others to my attention and I'll add those here too!


## Tests

This plugin has unit tests that can be executed by cloning this repo to your
machine and running `npm test` after `npm install`. At the time of writing,
passing tests and test coverge are at 100%.
