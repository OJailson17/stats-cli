import { Command } from 'commander';
import { createAccounts } from './actions/create-accounts';

export const registerCreateAccountsSubCommand = (createCommand: Command) => {
	createCommand.command('accounts').action(async () => {
		console.log(`💾 Creating Accounts...`);
		await createAccounts();
	});
};
