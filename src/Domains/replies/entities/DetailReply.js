class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, username, is_deleted } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.is_deleted = is_deleted;
  }

  _verifyPayload({ id, content, date, username, is_deleted }) {
    if (!id || !content || !date || !username || is_deleted === undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof is_deleted !== 'boolean') {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;