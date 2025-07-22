/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true,
      // unique: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
    date: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });

	pgm.addConstraint(
		'threads',
		'fk_threads_owner',
		'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
	);
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
