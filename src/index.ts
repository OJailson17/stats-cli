#!/usr/bin/env node

import { Command } from 'commander';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { importData } from './importer';

const CSV_DIRECTORY = 'F:\\Documentos\\stats-cli';

const program = new Command();

program
	.version('1.0.0')
	.description('CLI to import data from CSV and populate PG Database');

const importCommand = program
	.command('import')
	.description('Import CSV data to PostgreSQL');

// Finance subcommand
const financeCommand = importCommand
	.command('finance')
	.description('Import finance data');

['incomes', 'expenses', 'transfers'].forEach(type => {
	financeCommand
		.command(type)
		.argument('<file>', 'CSV file name (without extension)')
		.action(async filename => {
			const filePath = path.join(CSV_DIRECTORY, 'finances', `${filename}.csv`);

			if (!existsSync(filePath)) {
				console.error(`❌ File ${filename}.csv not found in ${filePath}`);
				process.exit(1);
			}

			console.log(`📂 Importing finance data: ${type} from file ${filename}`);
			await importData(type, filePath);
		});
});

// Languages subcommand
importCommand
	.command('languages')
	.argument('<file>', 'CSV file name (without extension)')
	.action(async filename => {
		const filePath = path.join(CSV_DIRECTORY, 'languages', `${filename}.csv`);

		if (!existsSync(filePath)) {
			console.error(`❌ File ${filename}.csv not found in ${filePath}`);
			process.exit(1);
		}

		console.log(`📚 Importing language learning data from file ${filename}`);
		await importData('languages', filePath); // You can handle this differently in `importData`
	});

program.parse(process.argv);
