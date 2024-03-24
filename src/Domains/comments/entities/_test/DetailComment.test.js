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
      is_deleted: 'true',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user',
      date: '2021-08-08T07:22:33.555Z',
      replies: [],
      content: 'abc',
      is_deleted: true,
    };

    // Action
    const { id, username, date, replies, content, is_deleted } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(content).toEqual(payload.content);
    expect(is_deleted).toEqual(payload.is_deleted);
  });
});
