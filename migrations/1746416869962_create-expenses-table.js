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
	pgm.createTable('stats_finances_expenses', {
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
		account_id: {
			type: 'integer',
			notNull: true,
			references: 'stats_finances_bank_accounts',
		},
		description: {
			type: 'text',
			notNull: true,
		},
		amount: {
			type: 'numeric',
		},
		date: {
			type: 'text',
			notNull: true,
		},
		category: {
			type: 'text',
			notNull: true,
		},
		subcategory: {
			type: 'text',
			notNull: true,
		},
		account_name: {
			type: 'text',
			notNull: true,
		},
		credit_card: {
			type: 'text',
		},
		created_at: {
			type: 'timestamp without time zone',
			notNull: true,
		},
	});
};
