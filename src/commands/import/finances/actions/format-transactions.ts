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
import { importTransactions } from './import-finances-transactions';
import { importExpenses } from './import-finances-expenses';
import { importIncomes } from './import-finances-incomes';
import { importTransfers } from './import-finances-transfers';

type ImportTransactions = {
	incomes: IncomeRow[];
	expenses: ExpenseRow[];
	transfers: TransferRow[];
};

export const formatTransactions = async ({
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
		await importTransactions(formattedTransactions, accounts);
		console.log('Finished Successfully');
	} catch (error) {
		console.log(error);
		process.exit(1);
	} finally {
		await pg.end();
	}
};
