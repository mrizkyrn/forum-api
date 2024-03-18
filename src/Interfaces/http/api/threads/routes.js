const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    options: {
      auth: 'forumapi_jwt',
      handler: handler.postThreadHandler,
    },
  },
]);

module.exports = routes;
