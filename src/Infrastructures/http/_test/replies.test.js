const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  beforeAll(async () => {
    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'rizky',
        password: '12345',
        fullname: 'Rizky Ramadhan',
      },
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'new reply',
      };
      const server = await createServer(container);

      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rizky',
          password: '12345',
        },
      });
      const responseLoginJson = JSON.parse(responseLogin.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'new thread',
          body: 'content',
        },
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'new comment',
        },
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');

      const reply = await RepliesTableTestHelper.findRepliesById(responseJson.data.addedReply.id);
      expect(reply).toHaveLength(1);
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and soft delete reply', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        content: 'new reply',
      };

      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'rizky',
          password: '12345',
        },
      });
      const responseLoginJson = JSON.parse(responseLogin.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'new thread',
          body: 'content',
        },
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: {
          content: 'new comment',
        },
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);

      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });
      const responseReplyJson = JSON.parse(responseReply.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}/replies/${responseReplyJson.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const reply = await RepliesTableTestHelper.findRepliesById(responseReplyJson.data.addedReply.id);
      expect(reply[0].is_deleted).toEqual(true);
    });
  });
});
