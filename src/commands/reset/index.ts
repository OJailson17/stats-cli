import { Command } from 'commander';
import { registerResetAccountsSubcommand } from './accounts';

export const registerResetCommand = (program: Command) => {
	const resetCommand = program.command('reset').description('Reset data');

	registerResetAccountsSubcommand(resetCommand);
};
