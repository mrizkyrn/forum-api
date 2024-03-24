const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'rizky' });
    await UsersTableTestHelper.addUser({ id: 'user-124', username: 'ramadhan' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'new comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        })
      );
    });
  });

  describe('deleteCommentById function', () => {
    it('should soft delete comment by id', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].is_deleted).toEqual(true);
    });

    it('should throw error when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123')).rejects.toThrowError(
        'komentar tidak ditemukan'
      );
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw error when comment not owned by owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-124')).rejects.toThrowError(
        'anda tidak berhak mengakses resource ini'
      );
    });

    it('should not throw error when comment owned by owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(
        'anda tidak berhak mengakses resource ini'
      );
    });

    it('should throw error when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError(
        'komentar tidak ditemukan'
      );
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw error when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).rejects.toThrowError(
        'komentar tidak ditemukan'
      );
    });

    it('should not throw error when comment available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).resolves.not.toThrowError(
        'komentar tidak ditemukan'
      );
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments by thread id correctly', async () => {
      // Arrange
      const date1 = new Date('2021-08-08T07:22:13.017Z');
      const date2 = new Date('2021-08-08T07:23:13.017Z');
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'comment 1',
        owner: 'user-123',
        threadId: 'thread-123',
        date: date1,
        isDeleted: true,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-124',
        content: 'comment 2',
        owner: 'user-124',
        threadId: 'thread-123',
        date: date2,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments).toStrictEqual([
        {
          id: 'comment-123',
          username: 'rizky',
          date: date1,
          content: '**komentar telah dihapus**',
          is_deleted: true,
        },
        {
          id: 'comment-124',
          username: 'ramadhan',
          date: date2,
          content: 'comment 2',
          is_deleted: false,
        },
      ]);
    });

    it('should return empty array when no comment in thread', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(0);
    });
  });
});
