import { pg } from 'lib/postgres';
import { formatDate } from 'utils/format-date';

type FinanceRow = {
	description: string;
	amount: number;
	date: string;
	category: string;
	subcategory: string;
	account_name: string;
	credit_card?: string;
};

type Account = {
	id: number;
	account: string;
};

export const importExpenses = async (rows: FinanceRow[]) => {
	try {
		await pg.connect();

		const { rows: rowAccounts } = await pg.query(
			`SELECT id, account from stats_bank_accounts`,
		);

		for (const row of rows) {
			if (!row.credit_card) {
				console.error('❌ Invalid file: Data needs to be expenses');
				process.exit(1);
			}

			const account = rowAccounts.find(
				acc => acc.account === row.account_name,
			) as Account;

			const amount = parseFloat(String(row.amount).replace('.', '')) / 100;
			const date = formatDate(row.date);
			const card = row.credit_card.replace('-', '');

			await pg.query(
				'INSERT INTO "stats_finances_expenses" ("account_id", "description", "amount", "date", "category", "subcategory", "account_name", "credit_card") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
				[
					account.id,
					row.description,
					amount,
					date,
					row.category,
					row.subcategory,
					row.account_name,
					card,
				],
			);
		}

		console.log('✅ Data imported successfully!');
	} catch (err) {
		console.error('❌ Something went wrong!', err);
	} finally {
		await pg.end();
	}
};
