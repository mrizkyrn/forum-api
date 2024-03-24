const routes = (handler) => [
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadUseCase,
  },
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
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    options: {
      auth: 'forumapi_jwt',
      handler: handler.deleteCommentHandler,
    },
  },
];

module.exports = routes;
