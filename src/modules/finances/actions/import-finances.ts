import fs from 'node:fs';
import { parse } from 'csv-parse';
import { importExpenses } from './import-finances-expenses';
import { importIncomes } from './import-finances-incomes';

const TABLES = ['incomes', 'expenses', 'transfers'];

export const importFinanceData = async (type: any, filePath: any) => {
	console.log('finances', { type, filePath });
	if (!TABLES.includes(type)) {
		console.error(`Erro: Tipo ${type} não reconhecido.`);
		process.exit(1);
	}

	const rows = [];
	fs.createReadStream(filePath)
		.pipe(parse({ columns: true, skip_empty_lines: true }))
		.on('data', row => rows.push(row))
		.on('end', async () => {
			switch (type) {
				case 'incomes':
					await importIncomes(rows);
					break;
				case 'expenses':
					await importExpenses(rows);
					break;
				// case 'transfers':
				// 	await importIncomes(rows);
				// 	break;
				default:
					console.error('Invalid argument!');
					process.exit(1);
			}
		});
};
