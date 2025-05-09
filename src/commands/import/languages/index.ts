import path from 'node:path';
import { existsSync } from 'node:fs';
import { Command } from 'commander';

import { CSV_DIRECTORY } from 'utils/shared';
import { importLanguageData } from './actions/import-languages';

export const registerLanguagesSubCommand = (importCommand: Command) => {
	importCommand
		.command('languages')
		.argument('<file>', 'CSV file name (without extension)')
		.action(async filename => {
			const filePath = path.join(CSV_DIRECTORY, 'languages', `${filename}.csv`);

			if (!existsSync(filePath)) {
				console.error(`❌ File ${filename}.csv not found in ${filePath}`);
				process.exit(1);
			}

			console.log(`💾 Importing language data from ${filename}`);
			await importLanguageData(filePath);
		});
};
