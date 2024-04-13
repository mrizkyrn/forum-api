class DetailComment {
  constructor({ id, username, date, replies, content, deleted, likeCount }) {
    this._verifyPayload({ id, username, date, replies, content, deleted, likeCount });

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.content = deleted ? '**komentar telah dihapus**' : content;
    this.deleted = deleted;
    this.likeCount = likeCount;
  }

  _verifyPayload({ id, username, date, replies, content, deleted, likeCount }) {
    if (!id || !username || !date || !replies || !content || deleted === undefined || likeCount === undefined) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(date instanceof Date)
      || !Array.isArray(replies)
      || typeof content !== 'string'
      || typeof deleted !== 'boolean'
      || typeof likeCount !== 'number'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
