import { Command } from 'commander';
import { resetAccounts } from './actions/reset-accounts';

export const registerResetAccountsSubcommand = (resetCommand: Command) => {
	resetCommand.command('accounts').action(async () => {
		await resetAccounts();
	});
};
