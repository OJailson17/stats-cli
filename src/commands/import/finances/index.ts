import path from 'node:path';
import { existsSync } from 'node:fs';
import { Command } from 'commander';
import { CSV_DIRECTORY } from 'utils/shared';
import { readFinancesData } from './actions/read-finances-data';

export const registerFinancesSubCommand = (importCommand: Command) => {
	importCommand
		.command('finances')
		.description('Import finance data')
		.argument('<files....>', 'CSV file name (without extension)')
		.action(async (filenames: string[]) => {
			if (filenames.length < 3) {
				console.error(`Missing files! Add at least 3 file names`);
				process.exit(1);
			}
			let filePaths: string[] = [];
			for (const filename of filenames) {
				const filePath = path.join(
					CSV_DIRECTORY,
					'finances',
					`${filename}.csv`,
				);

				if (!existsSync(filePath)) {
					console.error(`❌ File ${filename}.csv not found in ${filePath}`);
					process.exit(1);
				}

				filePaths.push(filePath);
			}

			await readFinancesData({ filePaths });
		});
};
