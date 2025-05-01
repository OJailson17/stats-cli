#!/usr/bin/env node

import { Command } from 'commander';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { createAccounts } from 'modules/finances/actions/create-accounts';
import { getAccounts } from 'modules/finances/actions/get-accounts';
import { getAccount } from 'modules/finances/actions/get-account';
import { readFinancesData } from 'modules/finances/actions/read-finances-data';
import { importLanguageData } from 'modules/languages/actions/import-languages';
import { importStudiesData } from 'modules/studies/actions/import-studies';

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
	.command('finances')
	.description('Import finance data');

financeCommand
	.argument('<files....>', 'CSV file name (without extension)')
	.action(async (filenames: string[]) => {
		if (filenames.length < 3) {
			console.error(`Missing files! Add at least 3 file names`);
			process.exit(1);
		}
		let filePaths: string[] = [];
		for (const filename of filenames) {
			const filePath = path.join(CSV_DIRECTORY, 'finances', `${filename}.csv`);

			if (!existsSync(filePath)) {
				console.error(`❌ File ${filename}.csv not found in ${filePath}`);
				process.exit(1);
			}

			filePaths.push(filePath);
		}

		await readFinancesData({ filePaths });
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

		console.log(`📚 Importing language data from ${filename}`);
		await importLanguageData(filePath);
	});

// Studies subcommand
importCommand
	.command('studies')
	.argument('<file>', 'CSV file name (without extension)')
	.action(async filename => {
		const filePath = path.join(CSV_DIRECTORY, 'studies', `${filename}.csv`);

		if (!existsSync(filePath)) {
			console.error(`❌ File ${filename}.csv not found in ${filePath}`);
			process.exit(1);
		}

		console.log(`📚 Importing studies data from ${filename}`);
		await importStudiesData(filePath);
	});

const createCommand = program
	.command('create')
	.description('Import CSV data to PostgreSQL');

// Account subcommand
createCommand.command('accounts').action(async () => {
	console.log(`Creating Accounts...`);
	await createAccounts();
});

const getCommand = program
	.command('get')
	.description('Import CSV data to PostgreSQL');

getCommand.command('accounts').action(async () => {
	await getAccounts();
});

getCommand
	.command('account')
	.argument('<account>', 'account name')
	.action(async (account: string) => {
		await getAccount(account);
	});

program.parse(process.argv);
