exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    reply_to: {
      type: 'VARCHAR(50)',
      notNull: false
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    }
  });
  pgm.addConstraint('comments', 'fk_comments.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.reply_to_comments.id', 'FOREIGN KEY(reply_to) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropTable('comments');
};
