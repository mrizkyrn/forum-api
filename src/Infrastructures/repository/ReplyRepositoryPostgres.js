const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { threadId, commentId, content, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT
        r.id as id,
        r.content as content,
        r.date as date,
        r.is_deleted as is_deleted,
        u.username as username
      FROM replies r
      LEFT JOIN users u ON u.id = r.owner
      WHERE r.comment_id = $1
      ORDER BY r.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    result.rows.forEach((row) => {
      if (row.is_deleted) {
        row.content = '**balasan telah dihapus**';
      }
    });

    return result.rows;
  }

  async deleteReplyById(threadId, commentId, replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1 AND thread_id = $2 AND comment_id = $3',
      values: [replyId, threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyAvailable(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    const reply = result.rows[0];
    if (reply.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
