import { Command } from 'commander';
import { registerFinancesSubCommand } from './finances';
import { registerLanguagesSubCommand } from './languages';
import { registerPomodorosSubCommand } from './pomodoros';
import { registerStudiesSubCommand } from './studies';

export const registerImportCommand = (program: Command) => {
	const importCommand = program
		.command('import')
		.description('Import CSV data to PostgreSQL');

	registerFinancesSubCommand(importCommand);
	registerLanguagesSubCommand(importCommand);
	registerStudiesSubCommand(importCommand);
	registerPomodorosSubCommand(importCommand);
};
