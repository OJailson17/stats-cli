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
	pgm.createTable('stats_finances_transactions', {
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
		amount: {
			type: 'numeric',
		},
		current_balance: {
			type: 'numeric',
		},
		date: {
			type: 'text',
			notNull: true,
		},
		transaction_type: {
			type: 'text',
			notNull: true,
		},
		created_at: {
			type: 'timestamp without time zone',
			notNull: true,
		},
	});
};
