import { createAccounts } from 'commands/create/accounts/actions/create-accounts';
import { pg } from 'lib/postgres';

export const resetAccounts = async () => {
	console.log('Resetting Accounts...');
	try {
		const query = `
    TRUNCATE TABLE stats_finances_bank_accounts CASCADE;
    `;

		await pg.query(query);

		await createAccounts();
		console.log('Accounts reset!');
	} catch (error) {
		console.log(error);
	} finally {
		pg.end();
	}
};
