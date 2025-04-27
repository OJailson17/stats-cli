import { pg } from 'lib/postgres';
import { formatDate } from 'utils/format-date';
import dayjs from 'dayjs';
import { createIncomesHistory } from './create-incomes-history';

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

export const importIncomes = async (rows: FinanceRow[]) => {
	const sortedRows = rows.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	try {
		await pg.connect();

		const { rows: rowAccounts } = await pg.query(
			`SELECT id, account from stats_finances_bank_accounts`,
		);

		const values = sortedRows.map((row, index) => {
			if (row.credit_card) {
				console.error('❌ Invalid file: Data needs to be incomes');
				process.exit(1);
			}

			const account = rowAccounts.find(
				acc => acc.account === row.account_name,
			) as Account;

			if (!account) {
				console.error(`❌ Account ${row.account_name} not found!`);
				process.exit(1);
			}

			const amount = parseFloat(String(row.amount).replace('.', '')) / 100;
			const date = formatDate(row.date);
			const createdAt = dayjs(new Date(Date.now() + index * 10)).toISOString();

			return [
				account.id,
				row.description,
				amount,
				date,
				row.category,
				row.subcategory,
				row.account_name,
				createdAt,
			];
		});

		if (values.length > 0) {
			const placeholders = values
				.map(
					(_, index) =>
						`($${index * 8 + 1}, $${index * 8 + 2}, $${index * 8 + 3}, $${
							index * 8 + 4
						}, $${index * 8 + 5}, $${index * 8 + 6}, $${index * 8 + 7}, $${
							index * 8 + 8
						})`,
				)
				.join(',');

			const flatValues = values.flat();

			const query = `
				INSERT INTO "stats_finances_incomes" ("account_id", "description", "amount", "date", "category", "subcategory", "account_name", "created_at")
				VALUES ${placeholders}
				RETURNING id, account_id, date, amount, description, account_name, created_at;
			`;

			const { rows: insertedRows } = await pg.query(query, flatValues);
			console.log('✅ Data imported successfully!');

			console.log('🛑 Updating Balance History!');
			await createIncomesHistory(insertedRows, rowAccounts);
		} else {
			console.log('ℹ️ No incomes to import.');
		}
	} catch (err) {
		console.error('❌ Something went wrong!', err);
	} finally {
		await pg.end();
	}
};
