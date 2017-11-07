const { assert } = require('chai')
const { spy } = require('sinon')

const namespacedRoutes = require('./index')
const packageJson = require('../package.json')

const noop = () => {}

const getNamespacedRoute = (serverSpies = {}) => {
  const { method, route, next } = serverSpies

  const server = {
    method: method || spy(),
    route: route || noop
  }

  namespacedRoutes.register(server, {}, next || noop)

  return server.method.args[0][0].method
}

test('adds pkg attribute', function() {
  assert.deepEqual(
    namespacedRoutes.register.attributes.pkg,
    packageJson,
    'assigns package.json to attributes.pkg'
  )
})

test('adds server method "namespacedRoute"', function() {
  const method = spy()
  const next = spy()

  getNamespacedRoute({ method, next })

  assert.isTrue(method.calledOnce, 'server.method called once')

  assert.equal(
    method.args[0][0].name,
    'namespacedRoute',
    'server.method called with namespacedRoute method name'
  )

  assert.equal(
    typeof method.args[0][0].method,
    'function',
    'server.method called with namespacedRoute method function'
  )

  assert.isTrue(next.calledOnce, 'next method called once')
  assert.isTrue(
    next.calledAfter(method),
    'next method called after server.method'
  )
})

test('namespacedRoute method', function() {
  const route = spy()

  const namespacedRoute = getNamespacedRoute({ route })

  const routeModule = {
    namespace: '/prefix',
    routes: [
      { method: 'GET', path: '', handler: noop },
      { method: 'POST', path: '/path2', handler: noop }
    ]
  }

  namespacedRoute(routeModule)

  assert.isTrue(route.calledOnce, 'server.route called once')

  const routes = route.args[0][0]

  assert.isArray(routes, 'returns an array')

  assert.deepEqual(
    routes[0],
    { method: 'GET', path: '/prefix', handler: noop },
    'prefixes first route path without affecting other route options'
  )

  assert.deepEqual(
    routes[1],
    { method: 'POST', path: '/prefix/path2', handler: noop },
    'prefixes second route path without affecting other route options'
  )
})

test('no namespace', function() {
  const namespacedRoute = getNamespacedRoute()

  const routeModule = {
    routes: [{ method: 'GET', path: '', handler: noop }]
  }

  const shouldThrow = () => namespacedRoute(routeModule)

  assert.throws(
    shouldThrow,
    'Namespaced routes modules require' +
      'namespace {string} and routes {array}'
  )
})

test('no routes', function() {
  const namespacedRoute = getNamespacedRoute()

  const routeModule = {
    namespace: '/prefix'
  }

  const shouldThrow = () => namespacedRoute(routeModule)

  assert.throws(
    shouldThrow,
    'Namespaced routes modules require' +
      'namespace {string} and routes {array}'
  )
})

test('namespace, no leading slash', function() {
  const namespacedRoute = getNamespacedRoute()

  const routeModule = {
    namespace: 'prefix',
    routes: []
  }

  const shouldThrow = () => namespacedRoute(routeModule)

  assert.throws(
    shouldThrow,
    `Namespaces must start with /, in ${routeModule.namespace}`
  )
})

test('namespace, trailing slash', function() {
  const namespacedRoute = getNamespacedRoute()

  const routeModule = {
    namespace: '/prefix/',
    routes: []
  }

  const shouldThrow = () => namespacedRoute(routeModule)

  assert.throws(
    shouldThrow,
    `Namespaces shouldn't end with /, in ${routeModule.namespace}`
  )
})
