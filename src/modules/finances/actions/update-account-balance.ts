import { pg } from 'lib/postgres';

type UpdateAccountBalanceProps = {
	amount: number;
	account_id: number;
};

export const updateAccountBalance = async ({
	account_id,
	amount,
}: UpdateAccountBalanceProps) => {
	await pg.query(
		'UPDATE stats_finances_bank_accounts SET balance = balance + $1 WHERE id = $2',
		[amount, account_id],
	);
};
