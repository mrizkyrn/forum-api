const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
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
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'new comment',
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

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and deleted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'new comment',
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
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}`,
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});