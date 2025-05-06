import fs from 'node:fs';
import { parse } from 'csv-parse';
import { formatTransactions } from './format-transactions';
import type { ExpenseRow, IncomeRow, Row, TransferRow } from 'types/finances';

type ImportFinanceDataProps = {
	filePaths: string[];
};

export const readFinancesData = async ({
	filePaths,
}: ImportFinanceDataProps) => {
	const incomesRows: IncomeRow[] = [];
	const expensesRows: ExpenseRow[] = [];
	const transferRows: TransferRow[] = [];

	console.log('Reading Files...');
	const readFile = (filePath: string) => {
		return new Promise<void>((resolve, reject) => {
			fs.createReadStream(filePath)
				.pipe(
					parse({
						columns: true,
						skip_empty_lines: true,
						trim: true,
						bom: true,
					}),
				)
				.on('data', (row: Row) => {
					if (row['C. Card']) {
						return expensesRows.push({
							account_name: row.Account,
							amount: parseFloat(String(row.Amount).replace('.', '')) / 100,
							category: row.Category,
							credit_card: row['C. Card'],
							date: row.Confirmation,
							description: row.Description,
							subcategory: row.Subcategory,
						});
					}

					if (row['▲ Origin'] && row['▼ Destination'] && row['Due date']) {
						return transferRows.push({
							amount: parseFloat(String(row.Amount).replace('.', '')) / 100,
							date: row['Due date'],
							description: row.Description,
							destiny_account: row['▼ Destination'],
							origin_account: row['▲ Origin'],
						});
					}

					return incomesRows.push({
						account_name: row.Account,
						amount: parseFloat(String(row.Amount).replace('.', '')) / 100,
						category: row.Category,
						date: row.Confirmation,
						description: row.Description,
						subcategory: row.Subcategory,
					});
				})
				.on('end', () => {
					resolve();
				})
				.on('error', err => {
					console.error(`Error reading file ${filePath}:`, err);
					process.exit(1);
				});
		});
	};

	// Wait for all files to be read
	await Promise.all(filePaths.map(readFile));

	// Now all data is ready
	await formatTransactions({
		expenses: expensesRows,
		incomes: incomesRows,
		transfers: transferRows,
	});
};
