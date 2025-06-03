import { pg } from 'lib/postgres';

type CreateAccountProps = {
	account: {
		name: string;
		balance: number;
		initial_balance: number;
	};
};

export const createAccount = async ({ account }: CreateAccountProps) => {
	try {
		await pg.connect();

		const query = `
	  INSERT INTO "stats_finances_bank_accounts" ("account", "balance", "initial_balance")
	  VALUES
	    ($1, $2, $3)
	`;

		await pg.query(query, [
			account.name,
			account.balance,
			account.initial_balance,
		]);
		console.log('✅ Account Created');

		await pg.end();
	} catch (error) {
		await pg.end();
		console.log(error);
	} finally {
		await pg.end();
	}
};
