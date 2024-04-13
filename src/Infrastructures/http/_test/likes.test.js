const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  beforeAll(async () => {
    const server = await createServer(container);

    const userResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'rizky',
        password: '12345',
        fullname: 'Rizky Ramadhan',
      },
    });
    const userResponseJson = JSON.parse(userResponse.payload);

    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userResponseJson.data.addedUser.id });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: userResponseJson.data.addedUser.id });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when like comment', async () => {
      // Arrange
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

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${responseLoginJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
