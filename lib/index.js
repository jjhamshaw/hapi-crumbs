const pathCookie = 'path';

// Plugin that saves the path of the previously viewed page in a cookie, so you can
// navigate back to it using a function decorated on the request object

exports.register = function (server, options, next) {

  var pluginOptions = {
    defaultPath: options.defaultPath || '/'
  };

  server.state(pathCookie, {
    ttl: null,
    path: '/',
    encoding: 'base64',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
  });

  server.ext('onRequest', function (request, reply) {
    // decorate request with function to get path cookie
    request.getPreviousPath = function() {
      // if no path can be found on the cookie, revert to the default path
      return request.state[pathCookie] || pluginOptions.defaultPath;
    };

    return reply.continue();
  });

  server.ext('onPreResponse', function (request, reply) {

    function setPathCookie(request, reply) {
      var path = request.state[pathCookie];

      if (path) {
        reply.unstate(pathCookie);
        reply.state(pathCookie, request.path);
      } else {
        reply.state(pathCookie, request.path);
      }
    }

    if (request.response.variety === 'view') {
      setPathCookie(request, reply);
    }

    return reply.continue();
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};

