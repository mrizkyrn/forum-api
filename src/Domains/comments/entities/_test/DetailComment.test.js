const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'user',
      date: '2021-08-08T07:22:33.555Z',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'user',
      date: '2021-08-08T07:22:33.555Z',
      replies: [],
      content: 'abc',
      deleted: 'true',
      likeCount: '1',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user',
      date: new Date(),
      replies: [],
      content: 'abc',
      deleted: false,
      likeCount: 1,
    };

    // Action
    const { id, username, date, replies, content, deleted, likeCount } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(content).toEqual(payload.content);
    expect(deleted).toEqual(payload.deleted);
    expect(likeCount).toEqual(payload.likeCount);
  });

  it('should create DetailComment object correctly with deleted status', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user',
      date: new Date(),
      replies: [],
      content: 'abc',
      deleted: true,
      likeCount: 1,
    };

    const expectedDeletedStatus = '**komentar telah dihapus**';

    // Action
    const { id, username, date, replies, content, deleted, likeCount } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(content).toEqual(expectedDeletedStatus);
    expect(deleted).toEqual(payload.deleted);
    expect(likeCount).toEqual(payload.likeCount);
  });
});
