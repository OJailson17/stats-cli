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
	pgm.createTable('stats_finances_bank_accounts', {
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
		account: {
			type: 'text',
			notNull: true,
		},
		balance: {
			type: 'numeric',
		},
		initial_balance: {
			type: 'numeric',
		},
	});
};
