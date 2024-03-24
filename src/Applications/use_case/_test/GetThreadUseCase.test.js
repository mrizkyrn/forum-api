const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = new DetailThread({
      id: useCasePayload.threadId,
      title: 'judul thread',
      body: 'body thread',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
      comments: [],
    });

    const expectedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'rizky',
        date: '2021-08-08T07:23:13.017Z',
        replies: [],
        content: 'Hello',
        is_deleted: false,
      }),
      new DetailComment({
        id: 'comment-124',
        username: 'ramadhan',
        date: '2021-08-08T07:24:13.017Z',
        replies: [],
        content: 'Hello',
        is_deleted: false,
      }),
    ];

    // mock dependency
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mock use case
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn(() => Promise.resolve([]));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: expectedComments,
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(expectedComments[0].id);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(expectedComments[1].id);
  });
});
