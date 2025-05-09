import path from 'node:path';
import { existsSync } from 'node:fs';
import { Command } from 'commander';

import { CSV_DIRECTORY } from 'utils/shared';
import { importStudiesData } from './actions/import-studies';

export const registerStudiesSubCommand = (importCommand: Command) => {
	importCommand
		.command('studies')
		.argument('<file>', 'CSV file name (without extension)')
		.action(async filename => {
			const filePath = path.join(CSV_DIRECTORY, 'studies', `${filename}.csv`);

			if (!existsSync(filePath)) {
				console.error(`❌ File ${filename}.csv not found in ${filePath}`);
				process.exit(1);
			}

			console.log(`👨🏻‍💻 Importing studies data from ${filename}`);
			await importStudiesData(filePath);
		});
};
