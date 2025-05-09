import { Command } from 'commander';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { CSV_DIRECTORY } from 'utils/shared';
import { importSchoolGrades } from './actions/import-school-grades';

export const registerSchoolSubCommand = (importCommand: Command) => {
	importCommand
		.command('school')
		.description('Import school grades')
		.argument('<file>', 'CSV file name (without extension)')
		.action(async filename => {
			const filePath = path.join(CSV_DIRECTORY, 'school', `${filename}.csv`);

			if (!existsSync(filePath)) {
				console.error(`❌ File ${filename}.csv not found in ${filePath}`);
				process.exit(1);
			}

			console.log(`💾 Importing school grades from ${filename}`);
			await importSchoolGrades(filePath);
		});
};
