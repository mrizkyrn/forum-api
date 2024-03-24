class DetailComment {
  constructor({ id, username, date, replies, content, is_deleted }) {
    this._verifyPayload({ id, username, date, replies, content, is_deleted });

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.content = content;
    this.is_deleted = is_deleted;
  }

  _verifyPayload({ id, username, date, replies, content, is_deleted }) {
    if (!id || !username || !date || !replies || !content || !is_deleted) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      !Array.isArray(replies) ||
      typeof content !== 'string' ||
      typeof is_deleted !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
