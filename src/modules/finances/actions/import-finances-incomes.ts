import { pg } from 'lib/postgres';
import { formatDate } from 'utils/format-date';

type FinanceRow = {
	description: string;
	amount: number;
	date: string;
	category: string;
	subcategory: string;
	account: string;
	credit_card?: string;
};

export const importIncomes = async (rows: FinanceRow[]) => {
	try {
		await pg.connect();

		for (const row of rows) {
			if (row.credit_card) {
				console.error('❌ Invalid file: Data needs to be incomes');
				process.exit(1);
			}

			const amount = parseFloat(String(row.amount).replace('.', '')) / 100;
			const date = formatDate(row.date);
			// const description =
			// 	row[Object.keys(row).find(key => key.trim() === 'Description')];

			await pg.query(
				'INSERT INTO "stats_finances_incomes" ("description", "amount", "date", "category", "subcategory", "account") VALUES ($1, $2, $3, $4, $5, $6)',
				[
					row.description,
					amount,
					date,
					row.category,
					row.subcategory,
					row.account,
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
