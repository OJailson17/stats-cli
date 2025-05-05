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
	pgm.createTable('stats_studies', {
		id: {
			type: 'integer',
			notNull: true,
			primaryKey: true,
			sequenceGenerated: {
				increment: 1,
				start: 1,
				precedence: 'ALWAYS',
			},
		},
		resource: {
			type: 'text',
			notNull: true,
		},
		subject: {
			type: 'text',
			notNull: true,
		},
		description: {
			type: 'text',
			notNull: true,
		},
		duration: {
			type: 'integer',
			notNull: true,
		},
		start_date: {
			type: 'text',
			notNull: true,
		},
		end_date: {
			type: 'text',
			notNull: true,
		},
		tags: {
			type: 'text',
			notNull: true,
		},
	});
};
