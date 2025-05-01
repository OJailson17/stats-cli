import type { Account, IncomeRow } from 'types/finances';
import dayjs from 'dayjs';
import { pg } from 'lib/postgres';
import { formatDate } from 'utils/format-date';

export const importIncomes = async (
	incomes: IncomeRow[],
	accounts: Account[],
) => {
	const values = incomes.map((row, index) => {
		const account = accounts.find(
			acc => acc.account === row.account_name,
		) as Account;

		if (!account) {
			console.error(`❌ Account ${row.account_name} not found!`);
			process.exit(1);
		}

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

		return await pg.query(query, flatValues);
	} else {
		console.log('No Incomes to Import!');
	}
};
