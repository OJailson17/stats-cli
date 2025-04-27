import { pg } from 'lib/postgres';
import { formatDate } from 'utils/format-date';
import dayjs from 'dayjs';
import { createTransfersHistory } from './create-transfers-history';

type FinanceRow = {
	description: string;
	amount: number;
	date: string;
	origin_account: string;
	destiny_account: string;
};

type Account = {
	id: number;
	account: string;
};

export const importTransfers = async (rows: FinanceRow[]) => {
	const sortedRows = rows.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	try {
		await pg.connect();

		const { rows: rowAccounts } = await pg.query(
			`SELECT id, account from stats_finances_bank_accounts`,
		);

		const values = sortedRows.map((row, index) => {
			if (!row.origin_account || !row.destiny_account) {
				console.error('❌ Invalid file: Data needs to be transfers');
				process.exit(1);
			}

			const originAccount = rowAccounts.find(
				acc => acc.account === row.origin_account,
			) as Account;

			const destinyAccount = rowAccounts.find(
				acc => acc.account === row.destiny_account,
			) as Account;

			if (!originAccount || !destinyAccount) {
				console.error(`❌ One of the accounts was not found!`);
				process.exit(1);
			}

			const amount = parseFloat(String(row.amount).replace('.', '')) / 100;
			const date = formatDate(row.date);
			const createdAt = dayjs(new Date(Date.now() + index * 10)).toISOString();

			return [
				originAccount.id,
				row.description,
				amount,
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

			const { rows: insertedRows } = await pg.query(query, flatValues);
			console.log('✅ Data imported successfully!');

			console.log('🛑 Updating Balance History!');
			await createTransfersHistory(insertedRows, rowAccounts);
		} else {
			console.log('ℹ️ No incomes to import.');
		}
	} catch (err) {
		console.error('❌ Something went wrong!', err);
	} finally {
		await pg.end();
	}
};
