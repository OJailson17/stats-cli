import fs from 'node:fs';
import { parse } from 'csv-parse';
import { importExpenses } from './import-finances-expenses';
import { importIncomes } from './import-finances-incomes';

type FinanceRow = {
	description: string;
	amount: number;
	date: string;
	category: string;
	subcategory: string;
	account_name: string;
	credit_card?: string;
};

type Row = {
	Description: string;
	Amount: number;
	Confirmation: string;
	Category: string;
	Subcategory: string;
	Account: string;
	'C. Card'?: string;
};

const TABLES = ['incomes', 'expenses', 'transfers'];

export const importFinanceData = async (type: any, filePath: any) => {
	if (!TABLES.includes(type)) {
		console.error(`Erro: Tipo ${type} não reconhecido.`);
		process.exit(1);
	}

	const rows: FinanceRow[] = [];
	fs.createReadStream(filePath)
		.pipe(
			parse({ columns: true, skip_empty_lines: true, trim: true, bom: true }),
		)
		.on('data', (row: Row) => {
			rows.push({
				account_name: row.Account,
				amount: row.Amount,
				category: row.Category,
				date: row.Confirmation,
				description: row.Description,
				subcategory: row.Subcategory,
				credit_card: row['C. Card'],
			});
		})
		.on('end', async () => {
			switch (type) {
				case 'incomes':
					await importIncomes(rows);
					break;
				case 'expenses':
					await importExpenses(rows);
					break;
				// case 'transfers':
				// 	await importTransfers(rows);
				// 	break;
				default:
					console.error('Invalid argument!');
					process.exit(1);
			}
		});
};
