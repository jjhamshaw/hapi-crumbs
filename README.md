# hapi-crumbs

A hapi.js plugin that saves the path of the previously viewed page in a cookie, so you can navigate back to it using a function decorated on the request object

## Usage
The hapi-crumbs plugin adds a ` getPreviousPath()` function to the request object, accessible in nyour handlers:

```
handler: function (request, reply) {
  // do handler stuff, then when you need to...
  return reply(request.getPreviousPath())
}

```
