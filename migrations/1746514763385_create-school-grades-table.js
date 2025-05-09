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
	pgm.createTable('stats_studies_school_grades', {
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
		school: {
			type: 'text',
			notNull: true,
		},
		acronym: {
			type: 'text',
		},
		year: {
			type: 'integer',
			notNull: true,
		},
		school_grade: {
			type: 'integer',
			notNull: true,
		},
		school_level: {
			type: 'text',
			notNull: true,
		},
		subject: {
			type: 'text',
			notNull: true,
		},
		unit: {
			type: 'integer',
			notNull: true,
		},
		student_grade: {
			type: 'numeric',
			notNull: true,
		},
	});
};
