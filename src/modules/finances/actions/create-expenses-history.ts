import { pg } from 'lib/postgres';
import { updateAccountBalance } from './update-account-balance';

type FinanceRow = {
	id: number;
	account_id: number;
	date: string;
	amount: string;
	description: string;
	account_name: string;
	created_at: string;
};

type Account = {
	id: number;
	account: string;
	balance: number;
};

// Função auxiliar para atualizar os saldos e criar o histórico
export const createExpensesHistory = async (
	expenses: FinanceRow[],
	accounts: Account[],
) => {
	for (const expense of expenses) {
		const account = accounts.find(acc => acc.account === expense.account_name);
		const amount = parseFloat(expense.amount);

		if (account) {
			// 1. Atualizar o balance na tabela de accounts
			await updateAccountBalance({
				account_id: account.id,
				amount,
				type: 'expense',
			});

			// 2. Inserir no histórico de saldos
			const { rows: updatedAccount } = await pg.query<Account>(
				'SELECT balance FROM stats_finances_bank_accounts WHERE id = $1',
				[account.id],
			);

			if (updatedAccount.length > 0) {
				await pg.query(
					`INSERT INTO stats_finances_balance_history (account_id, transaction_date, balance, transaction_type, transaction_id)
					VALUES ($1, $2, $3, $4, (SELECT id FROM stats_finances_expenses WHERE account_id = $1 AND description = $5 AND amount = $6 AND date = $2 AND created_at = $7 LIMIT 1))`,
					[
						account.id,
						expense.date,
						updatedAccount[0].balance,
						'expense',
						expense.description,
						amount,
						expense.created_at,
					],
				);
			}
		}
	}

	console.log('✅ History Updated!');
};
