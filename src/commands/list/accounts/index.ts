import { Command } from 'commander';
import { listAccounts } from './action/list-accounts';

export const registerListAccountsSubCommand = (listCommand: Command) => {
	listCommand.command('accounts').action(async () => {
		await listAccounts();
	});
};
