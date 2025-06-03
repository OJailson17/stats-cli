import { Command } from 'commander';
import { registerCreateAccountSubCommand } from './account';
import { registerCreateAccountsSubCommand } from './accounts';

export const registerCreateCommand = (program: Command) => {
	const createCommand = program
		.command('create')
		.description('Populate the database with something pre-created');

	registerCreateAccountsSubCommand(createCommand);
	registerCreateAccountSubCommand(createCommand);
};
