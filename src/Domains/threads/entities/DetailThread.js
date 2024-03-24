class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, title, body, date, username, comments } = payload;

    this.threadId = threadId;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({ threadId, title, body, date, username, comments }) {
    if (!threadId || !title || !body || !date || !username || !comments) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      !Array.isArray(comments)
    ) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;