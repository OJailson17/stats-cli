/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
	pgm.createTable('stats_pomodoros', {
		id: {
			type: 'integer',
			notNull: true,
			primaryKey: true,
			sequenceGenerated: {
				precedence: 'ALWAYS',
				start: 1,
				increment: 1,
			},
		},
		end_date: {
			type: 'text',
			notNull: true,
		},
		end_time: {
			type: 'text',
			notNull: true,
		},
		duration: {
			type: 'integer',
			notNull: true,
		},
	});
};
