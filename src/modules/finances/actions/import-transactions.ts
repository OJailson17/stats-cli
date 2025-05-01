import dayjs from 'dayjs';
import { pg } from 'lib/postgres';
import {
	Account,
	ExpenseRow,
	IncomeRow,
	TransactionRow,
	TransferRow,
} from 'types/finances';
import { formatDate } from 'utils/format-date';
import { importExpenses } from './import-finances-expenses';
import { importIncomes } from './import-finances-incomes';
import { importTransfers } from './import-finances-transfers';
import { updateAccountBalance } from './update-account-balance';

type ImportTransactions = {
	incomes: IncomeRow[];
	expenses: ExpenseRow[];
	transfers: TransferRow[];
};

export const importTransactions = async ({
	expenses,
	incomes,
	transfers,
}: ImportTransactions) => {
	try {
		await pg.connect();
		const { rows: accounts } = await pg.query(
			`SELECT id, account from stats_finances_bank_accounts`,
		);

		console.log('Formatting Incomes!');
		const formattedIncomes: TransactionRow[] = incomes.map((income, index) => {
			const account = accounts.find(
				acc => acc.account === income.account_name,
			) as Account;

			if (!account) {
				console.log('Account does not exist');
				process.exit(1);
			}

			const date = formatDate(income.date);
			const createdAt = dayjs(new Date(Date.now() + index * 10)).toISOString();

			return {
				account_id: account.id,
				amount: income.amount,
				created_at: createdAt,
				date,
				transaction_type: 'income',
			};
		});

		console.log('Formatting Expenses!');
		const formattedExpenses: TransactionRow[] = expenses.map(
			(expense, index) => {
				const account = accounts.find(
					acc => acc.account === expense.account_name,
				) as Account;

				if (!account) {
					console.log('Account does not exist');
					process.exit(1);
				}

				const date = formatDate(expense.date);
				const createdAt = dayjs(
					new Date(Date.now() + index * 10),
				).toISOString();

				return {
					account_id: account.id,
					amount: expense.amount * -1,
					created_at: createdAt,
					date,
					transaction_type: 'expense',
				};
			},
		);

		console.log('Formatting Transfers In!');
		const formattedTransfersIn: TransactionRow[] = transfers.map(
			(transfer, index) => {
				const account = accounts.find(
					acc => acc.account === transfer.destiny_account,
				) as Account;

				if (!account) {
					console.log('Account does not exist');
					process.exit(1);
				}

				const date = formatDate(transfer.date);
				const createdAt = dayjs(
					new Date(Date.now() + index * 10),
				).toISOString();

				return {
					account_id: account.id,
					amount: transfer.amount,
					created_at: createdAt,
					date,
					transaction_type: 'transfer_in',
				};
			},
		);

		console.log('Formatting Transfers Out!');
		const formattedTransfersOut: TransactionRow[] = transfers.map(
			(transfer, index) => {
				const account = accounts.find(
					acc => acc.account === transfer.origin_account,
				) as Account;

				if (!account) {
					console.log('Account does not exist');
					process.exit(1);
				}

				const date = formatDate(transfer.date);
				const createdAt = dayjs(
					new Date(Date.now() + index * 10),
				).toISOString();

				return {
					account_id: account.id,
					amount: transfer.amount * -1, // make value negative
					created_at: createdAt,
					date,
					transaction_type: 'transfer_out',
				};
			},
		);

		console.log('Joining all transactions');
		const formattedTransactions = [
			formattedExpenses,
			formattedIncomes,
			formattedTransfersIn,
			formattedTransfersOut,
		]
			.flat()
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		console.log('Importing Incomes');
		await importIncomes(incomes, accounts);
		console.log('Importing Expenses');
		await importExpenses(expenses, accounts);
		console.log('Importing Transfers');
		await importTransfers(transfers, accounts);
		console.log('Joining Transactions');
		await importAllTransactions(formattedTransactions, accounts);
		console.log('Finished Successfully');
	} catch (error) {
		console.log(error);
		process.exit(1);
	} finally {
		await pg.end();
	}
};

const importAllTransactions = async (
	transactions: TransactionRow[],
	accounts: Account[],
) => {
	// console.log(transactions)
	for (const transaction of transactions) {
		const account = accounts.find(acc => acc.id === transaction.account_id);
		if (account) {
			// 1. Atualizar o balance na tabela de accounts
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
