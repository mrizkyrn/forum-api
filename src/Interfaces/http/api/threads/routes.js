const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    options: {
      auth: 'forumapi_jwt',
      handler: handler.postThreadHandler,
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    options: {
      auth: 'forumapi_jwt',
      handler: handler.postCommentHandler,
    },
  }
]);

module.exports = routes;
