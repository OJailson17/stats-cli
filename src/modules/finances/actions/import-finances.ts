import fs from 'node:fs';
import { parse } from 'csv-parse';
import { importExpenses } from './import-finances-expenses';
import { importIncomes } from './import-finances-incomes';
import { importTransfers } from './import-finances-transfers';

type FinanceRow = {
	description: string;
	amount: number;
	date: string;
	category: string;
	subcategory: string;
	account_name: string;
	credit_card?: string;
};

type FinanceTransferRow = {
	description: string;
	amount: number;
	date: string;
	origin_account: string;
	destiny_account: string;
};

type TransferRow = {
	Description: string;
	Amount: number;
	'Due date': string;
	'▲ Origin': string;
	'▼ Destination': string;
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

type ImportFinanceDataProps = {
	type: 'incomes' | 'expenses' | 'transfers';
	filePath: string;
};

const TABLES = ['incomes', 'expenses', 'transfers'] as const;

export const importFinanceData = async ({
	filePath,
	type,
}: ImportFinanceDataProps) => {
	if (!TABLES.includes(type)) {
		console.error(`Error: finance type ${type} not recognized.`);
		process.exit(1);
	}

	const rows: FinanceRow[] = [];
	const transferRows: FinanceTransferRow[] = [];
	fs.createReadStream(filePath)
		.pipe(
			parse({ columns: true, skip_empty_lines: true, trim: true, bom: true }),
		)
		.on('data', (row: Row | TransferRow) => {
			if (type === 'transfers') {
				let tr_row = row as TransferRow;

				transferRows.push({
					amount: tr_row.Amount,
					date: tr_row['Due date'],
					description: tr_row.Description,
					destiny_account: tr_row['▼ Destination'],
					origin_account: tr_row['▲ Origin'],
				});
			} else {
				const finance_row = row as Row;

				rows.push({
					account_name: finance_row.Account,
					amount: finance_row.Amount,
					category: finance_row.Category,
					date: finance_row.Confirmation,
					description: finance_row.Description,
					subcategory: finance_row.Subcategory,
					credit_card: finance_row['C. Card'],
				});
			}
		})
		.on('end', async () => {
			switch (type) {
				case 'incomes':
					await importIncomes(rows);
					break;
				case 'expenses':
					await importExpenses(rows);
					break;
				case 'transfers':
					await importTransfers(transferRows);
					break;
				default:
					console.error('Invalid argument!');
					process.exit(1);
			}
		});
};
