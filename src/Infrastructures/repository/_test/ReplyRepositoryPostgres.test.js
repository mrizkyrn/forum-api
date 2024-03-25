const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'rizky' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'new reply',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: newReply.content,
          owner: newReply.owner,
        })
      );
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies by comment id', async () => {
      // Arrange
      const date1 = new Date('2021-08-08T07:25:13.000Z');
      const date2 = new Date('2021-08-08T07:26:13.000Z');

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'reply 1',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        date: date1,
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-124',
        content: 'reply 2',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        date: date2,
        isDeleted: true,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies).toStrictEqual([
        {
          id: 'reply-123',
          content: 'reply 1',
          date: date1,
          username: 'rizky',
          is_deleted: false,
        },
        {
          id: 'reply-124',
          content: '**balasan telah dihapus**',
          date: date2,
          username: 'rizky',
          is_deleted: true,
        },
      ]);
    });
  });

  describe('deleteReplyById function', () => {
    it('should soft delete reply by id', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action
      await replyRepositoryPostgres.deleteReplyById('thread-123', 'comment-123', 'reply-123');

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies[0].is_deleted).toEqual(true);
    });

    it('should throw error when reply not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById('thread-123', 'comment-123', 'reply-124')).rejects.toThrowError(
        'balasan tidak ditemukan'
      );
    });
  });

  describe('verifyReplyAvailable function', () => {
    it('should throw error when reply not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailable('reply-123')).rejects.toThrowError(
        'balasan tidak ditemukan'
      );
    });

    it('should not throw error when reply available', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailable('reply-123')).resolves.not.toThrowError(
        'balasan tidak ditemukan'
      );
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw error when reply not owned by owner', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-124')).rejects.toThrowError(
        'anda tidak berhak mengakses resource ini'
      );
    });

    it('should not throw error when reply owned by owner', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(
        'anda tidak berhak mengakses resource ini'
      );
    });

    it('should throw error when reply not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).rejects.toThrowError(
        'balasan tidak ditemukan'
      );
    });
  });
});
