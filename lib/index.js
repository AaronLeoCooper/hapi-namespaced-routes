'use strict'

function processRouteModule({ routes, namespace }) {
  return routes.map(route => {
    return Object.assign({}, route, { path: namespace + route.path })
  })
}

/**
 * Namespaced Routes HapiJS plugin
 *
 * Accepts a "routes module", an object containing:
 *  - namespace {string}, string to prefix all routes with
 *  - routes {array}, array of Hapi routes
 */
exports.register = function(server, options, next) {
  const addNamespacedRoutes = routeModule => {
    const { namespace } = routeModule

    if (!namespace || !Array.isArray(routeModule.routes)) {
      throw new Error(
        'Namespaced routes modules require' +
          'namespace {string} and routes {array}'
      )
    }

    if (namespace[0] !== '/') {
      throw new Error(`Namespaces must start with /, in ${namespace}`)
    }

    if (namespace.slice(-1) === '/') {
      throw new Error(`Namespaces shouldn't end with /, in ${namespace}`)
    }

    const routes = processRouteModule(routeModule)

    server.route(routes)
  }

  server.method({
    name: 'namespacedRoute',
    method: addNamespacedRoutes
  })

  next()
}

exports.register.attributes = {
  pkg: require('../package.json')
}
