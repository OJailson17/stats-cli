export const importExpenses = async (rows: any[]) => {
	console.log({ rows });

	// try {
	// 	await pg.connect();

	// 	for (const row of rows) {
	// 		if (!row['C. Card']) {
	// 			console.error('❌ Arquivo inválido: Dados precisam ser de expenses');
	// 			process.exit(1);
	// 		}

	// 		const value = parseInt(String(row.Value || row.Amount).replace('.', ''));

	// 		const date = formatDate(row.Date || row.Confirmation);
	// 		const description =
	// 			row[Object.keys(row).find(key => key.trim() === 'Description')];
	// 		const card = row['C. Card'].replace('-', '');

	// 		await pg.query(
	// 			'INSERT INTO "expenses" ("Description", "Value", "Date", "Category", "Subcategory", "Account", "Card") VALUES ($1, $2, $3, $4, $5, $6, $7)',
	// 			[
	// 				description,
	// 				value,
	// 				date,
	// 				row.Category,
	// 				row.Subcategory,
	// 				row.Account,
	// 				card,
	// 			],
	// 		);
	// 	}

	// 	console.log('✅ Dados inseridos com sucesso!');
	// } catch (err) {
	// 	console.error('❌ Erro ao inserir dados:', err);
	// } finally {
	// 	await pg.end();
	// }
};
