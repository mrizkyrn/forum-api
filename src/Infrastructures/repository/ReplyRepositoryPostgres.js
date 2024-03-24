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
}

module.exports = ReplyRepositoryPostgres;
