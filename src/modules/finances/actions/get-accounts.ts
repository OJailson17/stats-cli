import { pg } from 'lib/postgres';

export const getAccounts = async () => {
	try {
		await pg.connect();

		const { rows: accounts } = await pg.query(
			'SELECT account, balance FROM stats_finances_bank_accounts;',
		);

		console.log({ accounts });
	} catch (error) {
		console.log(error);
		await pg.end();
	} finally {
		await pg.end();
	}
};
