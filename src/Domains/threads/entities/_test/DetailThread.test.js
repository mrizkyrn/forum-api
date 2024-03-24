const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      title: 'abc',
      body: 'content',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      title: 'abc',
      body: true,
      date: '2021-08-08T07:22:13.017Z',
      username: 'user',
      comments: [],
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      title: 'new thread',
      body: 'content',
      date: '2021-08-08T07:22:13.017Z',
      username: 'user',
      comments: [],
    };

    // Action
    const { threadId, title, body, date, username, comments } = new DetailThread(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
