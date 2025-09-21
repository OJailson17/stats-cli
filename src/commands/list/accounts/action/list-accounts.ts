import { pg } from 'lib/postgres';

type QueryResponse = {
	account: string;
	balance: string;
};

export const listAccounts = async () => {
	try {
		await pg.connect();

		const { rows } = await pg.query(
			'SELECT account, balance FROM stats_finances_bank_accounts;',
		);

		const accounts = rows as QueryResponse[];
		accounts.sort((acc1, acc2) => Number(acc2.balance) - Number(acc1.balance));

		const formattedAccounts = accounts.map(account => {
			return {
				account: account.account,
				balance: new Intl.NumberFormat('pt-BR', {
					style: 'currency',
					currency: 'BRL',
				}).format(Number(account.balance)),
			};
		});

		console.table(formattedAccounts);
	} catch (error) {
		console.log(error);
		await pg.end();
	} finally {
		await pg.end();
	}
};
