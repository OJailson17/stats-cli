import { pg } from 'lib/postgres';

type UpdateAccountBalanceProps = {
	type: 'income' | 'expense';
	amount: number;
	account_id: number;
};

export const updateAccountBalance = async ({
	account_id,
	amount,
	type,
}: UpdateAccountBalanceProps) => {
	if (type === 'income') {
		await pg.query(
			'UPDATE stats_finances_bank_accounts SET balance = balance + $1 WHERE id = $2',
			[amount, account_id],
		);
	}

	if (type === 'expense') {
		await pg.query(
			'UPDATE stats_finances_bank_accounts SET balance = balance - $1 WHERE id = $2',
			[amount, account_id],
		);
	}
};
