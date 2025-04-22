import fs from 'node:fs';
import { parse } from 'csv-parse';

export const importLanguageData = async (filePath: any) => {
	console.log('languages', { filePath });

	const rows = [];
	fs.createReadStream(filePath)
		.pipe(parse({ columns: true, skip_empty_lines: true }))
		.on('data', row => rows.push(row))
		.on('end', async () => {
			console.log({ rows });

			// try {
			// 	await pg.connect();

			// 	for (const row of rows) {
			// 		if (row['C. Card']) {
			// 			console.error('❌ Arquivo inválido: Dados precisam ser de incomes');
			// 			process.exit(1);
			// 		}

			// 		const value = parseInt(String(row.Value || row.Amount).replace('.', ''));
			// 		const date = formatDate(row.Date || row.Confirmation);
			// 		const description =
			// 			row[Object.keys(row).find(key => key.trim() === 'Description')];

			// 		await pg.query(
			// 			'INSERT INTO "incomes" ("Description", "Value", "Date", "Category", "Subcategory", "Account") VALUES ($1, $2, $3, $4, $5, $6)',
			// 			[description, value, date, row.Category, row.Subcategory, row.Account],
			// 		);
			// 	}
			// 	console.log('✅ Dados inseridos com sucesso!');
			// } catch (err) {
			// 	console.error('❌ Erro ao inserir dados:', err);
			// } finally {
			// 	await pg.end();
			// }
		});
};
