import { pg } from 'lib/postgres';

export const resetAccounts = async () => {
	console.log('👨🏻‍💻 Resetting Accounts...');
	try {
		await pg.connect();

		const query = `TRUNCATE stats_finances_bank_accounts CASCADE;`;

		await pg.query(query);

		console.log('Accounts reset!');
	} catch (error) {
		console.log(error);
	} finally {
		pg.end();
	}
};
