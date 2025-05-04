import { Command } from 'commander';
import { registerGetAccountSubCommand } from './account';
import { registerListAccountsSubCommand } from './accounts';

export const registerListCommand = (program: Command) => {
	const listCommand = program
		.command('list')
		.description('List items from database');

	registerListAccountsSubCommand(listCommand);
	registerGetAccountSubCommand(listCommand);
};
