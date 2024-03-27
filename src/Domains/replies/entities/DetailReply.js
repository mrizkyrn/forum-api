class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, username, deleted } = payload;

    this.id = id;
    this.content = deleted ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
    this.deleted = deleted;
  }

  _verifyPayload({ id, content, date, username, deleted }) {
    if (!id || !content || !date || !username || deleted === undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || !(date instanceof Date)
      || typeof username !== 'string'
      || typeof deleted !== 'boolean'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
