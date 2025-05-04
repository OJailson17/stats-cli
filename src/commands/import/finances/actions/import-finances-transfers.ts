import dayjs from 'dayjs';
import { pg } from 'lib/postgres';
import type { Account, TransferRow } from 'types/finances';
import { formatDate } from 'utils/format-date';

export const importTransfers = async (
	transfers: TransferRow[],
	accounts: Account[],
) => {
	const values = transfers.map((row, index) => {
		if (!row.origin_account || !row.destiny_account) {
			console.error('❌ Invalid file: Data needs to be transfers');
			process.exit(1);
		}

		const originAccount = accounts.find(
			acc => acc.account === row.origin_account,
		) as Account;

		const destinyAccount = accounts.find(
			acc => acc.account === row.destiny_account,
		) as Account;

		if (!originAccount || !destinyAccount) {
			console.error(`❌ One of the accounts was not found!`);
			process.exit(1);
		}

		// const amount = parseFloat(String(row.amount).replace('.', '')) / 100;
		const date = formatDate(row.date);
		const createdAt = dayjs(new Date(Date.now() + index * 10)).toISOString();

		return [
			originAccount.id,
			row.description,
			row.amount,
			date,
			destinyAccount.id,
			createdAt,
		];
	});

	if (values.length > 0) {
		const placeholders = values
			.map(
				(_, index) =>
					`($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${
						index * 6 + 4
					}, $${index * 6 + 5}, $${index * 6 + 6})`,
			)
			.join(',');

		const flatValues = values.flat();

		const query = `
			INSERT INTO "stats_finances_transfers" ("origin_account_id", "description", "amount", "date", "destiny_account_id", "created_at")
			VALUES ${placeholders}
			RETURNING id, origin_account_id, date, amount, description, destiny_account_id, created_at;
		`;

		return await pg.query(query, flatValues);
	} else {
		console.log('No Data to import');
	}
};
