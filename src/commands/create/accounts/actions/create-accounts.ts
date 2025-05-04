import { pg } from 'lib/postgres';

export const createAccounts = async () => {
	const accounts = JSON.parse(`${process.env.ACCOUNTS}`.replace(/'/g, '"'));

	try {
		await pg.connect();

		const query = `
	  INSERT INTO "stats_finances_bank_accounts" ("account", "balance", "initial_balance")
	  VALUES
	    ($1, $2, $3),
	    ($4, $5, $6),
	    ($7, $8, $9),
	    ($10, $11, $12),
	    ($13, $14, $15),
	    ($16, $17, $18)
	`;

		const queryValues = accounts;

		await pg.query(query, queryValues);
		console.log('✅ Accounts Created');

		await pg.end();
	} catch (error) {
		await pg.end();
		console.log(error);
	} finally {
		await pg.end();
	}
};
