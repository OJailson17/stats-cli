import path from 'node:path';
import { existsSync } from 'node:fs';
import { Command } from 'commander';

import { CSV_DIRECTORY } from 'utils/shared';
import { importPomodoros } from './actions/import-pomodoros';

export const registerPomodorosSubCommand = (importCommand: Command) => {
	importCommand
		.command('pomodoros')
		.description('Import pomodoro logs')
		.argument('<file>', 'CSV file name (without extension)')
		.action(async filename => {
			const filePath = path.join(CSV_DIRECTORY, 'pomodoros', `${filename}.csv`);

			if (!existsSync(filePath)) {
				console.error(`❌ File ${filename}.csv not found in ${filePath}`);
				process.exit(1);
			}

			console.log(`📚 Importing pomodoros from ${filename}`);
			await importPomodoros(filePath);
		});
};
