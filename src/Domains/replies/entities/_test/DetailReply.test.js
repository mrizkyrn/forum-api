const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'user',
      date: '2021-08-08T07:22:33.555Z',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'abc',
      date: '2021-08-08T07:22:33.555Z',
      username: 'user',
      is_deleted: 'true',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'abc',
      date: '2021-08-08T07:22:33.555Z',
      username: 'user',
      is_deleted: true,
    };

    // Action
    const { id, content, date, username, is_deleted } = new DetailReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(is_deleted).toEqual(payload.is_deleted);
  });
});
