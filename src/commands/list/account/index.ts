import { Command } from 'commander';
import { getAccount } from './actions/get-account';

export const registerGetAccountSubCommand = (listCommand: Command) => {
	listCommand
		.command('account')
		.argument('<account>', 'account name')
		.action(async (account: string) => {
			await getAccount(account);
		});
};
