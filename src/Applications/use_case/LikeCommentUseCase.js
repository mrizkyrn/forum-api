class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    await this._commentRepository.verifyAvailableComment(useCasePayload.commentId);

    const isLikeExist = await this._likeRepository.isLikeExist(useCasePayload.commentId, useCasePayload.owner);
    if (isLikeExist) {
      return this._likeRepository.deleteLike(useCasePayload.commentId, useCasePayload.owner);
    }
    return this._likeRepository.addLike(useCasePayload.commentId, useCasePayload.owner);
  }

  _validatePayload(payload) {
    const { threadId, commentId, owner } = payload;
    if (!threadId || !commentId || !owner) {
      throw new Error('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeCommentUseCase;
