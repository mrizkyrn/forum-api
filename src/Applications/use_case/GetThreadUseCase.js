class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    for (const comment of comments) {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      comment.replies = replies;
    }
    return {
      ...thread,
      comments,
    };
  }
}

module.exports = GetThreadUseCase;
