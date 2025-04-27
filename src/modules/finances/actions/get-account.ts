import { pg } from 'lib/postgres';

export const getAccount = async (account_name: string) => {
	try {
		await pg.connect();
		const { rows: account } = await pg.query(
			`SELECT account, balance FROM stats_finances_bank_accounts WHERE "account" ILIKE $1;`,
			[account_name],
		);

		console.log(account[0]);
	} catch (error) {
		console.log(error);
		await pg.end();
	} finally {
		await pg.end();
	}
};
