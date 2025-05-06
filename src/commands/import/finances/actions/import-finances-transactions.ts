import { pg } from 'lib/postgres';
import { Account, TransactionRow } from 'types/finances';
import { updateAccountBalance } from './update-account-balance';

export const importTransactions = async (
	transactions: TransactionRow[],
	accounts: Account[],
) => {
	for (const transaction of transactions) {
		const account = accounts.find(acc => acc.id === transaction.account_id);
		if (account) {
			await updateAccountBalance({
				account_id: account.id,
				amount: transaction.amount,
			});
			const { rows: updatedAccount } = await pg.query<Account>(
				'SELECT balance FROM stats_finances_bank_accounts WHERE id = $1',
				[account.id],
			);
			if (updatedAccount.length > 0) {
				await pg.query(
					`INSERT INTO stats_finances_transactions (account_id, date, current_balance, transaction_type, amount, created_at)
					VALUES ($1, $2, $3, $4, $5, $6)`,
					[
						account.id,
						transaction.date,
						Number(updatedAccount[0].balance),
						transaction.transaction_type,
						transaction.amount,
						transaction.created_at,
					],
				);
			}
		}
	}
};
