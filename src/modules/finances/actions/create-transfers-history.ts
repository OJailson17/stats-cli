import { pg } from 'lib/postgres';
import { updateAccountBalance } from './update-account-balance';

type FinanceRow = {
	id: number;
	origin_account_id: number;
	destiny_account_id: number;
	date: string;
	amount: string;
	description: string;
	created_at: string;
};

type Account = {
	id: number;
	account: string;
	balance: number;
};

export const createTransfersHistory = async (
	transfers: FinanceRow[],
	accounts: Account[],
) => {
	for (const transfer of transfers) {
		const originAccount = accounts.find(
			acc => acc.id === transfer.origin_account_id,
		);
		const destinyAccount = accounts.find(
			acc => acc.id === transfer.destiny_account_id,
		);

		const amount = parseFloat(transfer.amount);

		if (originAccount && destinyAccount) {
			await Promise.all([
				updateAccountBalance({
					account_id: originAccount.id,
					amount,
					type: 'expense',
				}),
				updateAccountBalance({
					account_id: destinyAccount.id,
					amount,
					type: 'income',
				}),
			]);

			const { rows: updatedOriginAccount } = await pg.query<Account>(
				'SELECT balance FROM stats_finances_bank_accounts WHERE id = $1',
				[originAccount.id],
			);

			const { rows: updatedDestinyAccount } = await pg.query<Account>(
				'SELECT balance FROM stats_finances_bank_accounts WHERE id = $1',
				[destinyAccount.id],
			);

			if (updatedOriginAccount.length > 0 && updatedDestinyAccount.length > 0) {
				await pg.query(
					`
					INSERT INTO stats_finances_balance_history
					(account_id, transaction_date, balance, transaction_type, transaction_id)
					VALUES
						($1, $2, $3, $4, (
							SELECT id FROM stats_finances_transfers
							WHERE origin_account_id = $1
							AND description = $5
							AND amount = $6
							AND date = $2
							AND created_at = $7
							LIMIT 1
						)),
						($8, $9, $10, $11, (
							SELECT id FROM stats_finances_transfers
							WHERE destiny_account_id = $8
							AND description = $12
							AND amount = $13
							AND date = $9
							AND created_at = $14
							LIMIT 1
						))
					`,
					[
						originAccount.id,
						transfer.date,
						updatedOriginAccount[0].balance,
						'expense',
						transfer.description,
						amount,
						transfer.created_at,
						destinyAccount.id,
						transfer.date,
						updatedDestinyAccount[0].balance,
						'income',
						transfer.description,
						amount,
						transfer.created_at,
					],
				);
			}
		}
	}
	console.log('✅ History Updated!');
};
