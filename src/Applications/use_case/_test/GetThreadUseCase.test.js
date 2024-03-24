const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockDetailThread = new DetailThread({
      threadId: useCasePayload.threadId,
      title: 'new thread',
      body: 'content',
      date: '2021-08-08T07:22:13.017Z',
      username: 'user',
      comments: [],
    });
    
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual({
      threadId: mockDetailThread.threadId,
      title: mockDetailThread.title,
      body: mockDetailThread.body,
      date: mockDetailThread.date,
      username: mockDetailThread.username,
      comments: [],
    });
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
