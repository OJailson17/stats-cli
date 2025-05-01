import type { Account, ExpenseRow } from 'types/finances';
import dayjs from 'dayjs';
import { pg } from 'lib/postgres';
import { formatDate } from 'utils/format-date';

export const importExpenses = async (
	expenses: ExpenseRow[],
	accounts: Account[],
) => {
	const values = expenses.map((row, index) => {
		if (!row.credit_card) {
			console.error('❌ Invalid file: Data needs to be expenses');
			process.exit(1);
		}

		const account = accounts.find(
			acc => acc.account === row.account_name,
		) as Account;

		if (!account) {
			console.error(`❌ Account ${row.account_name} not found!`);
			process.exit(1);
		}

		// const amount = parseFloat(String(row.amount).replace('.', '')) / 100;
		const date = formatDate(row.date);
		const createdAt = dayjs(new Date(Date.now() + index * 10)).toISOString();

		return [
			account.id,
			row.description,
			row.amount,
			date,
			row.category,
			row.subcategory,
			row.account_name,
			row.credit_card,
			createdAt,
		];
	});

	if (values.length > 0) {
		const placeholders = values
			.map(
				(_, index) =>
					`($${index * 9 + 1}, $${index * 9 + 2}, $${index * 9 + 3}, $${
						index * 9 + 4
					}, $${index * 9 + 5}, $${index * 9 + 6}, $${index * 9 + 7}, $${
						index * 9 + 8
					}, $${index * 9 + 9})`,
			)
			.join(',');

		const flatValues = values.flat();

		const query = `
			INSERT INTO "stats_finances_expenses" ("account_id", "description", "amount", "date", "category", "subcategory", "account_name", "credit_card", "created_at")
			VALUES ${placeholders}
			RETURNING id, account_id, date, amount, description, account_name, created_at;
		`;

		return await pg.query(query, flatValues);
	} else {
		console.log('✅ No data to import');
	}
};
