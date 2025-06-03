import { Command } from 'commander';
import { createAccount } from './actions/create-account';

export const registerCreateAccountSubCommand = (createCommand: Command) => {
	createCommand
		.command('account')
		.argument('<account....>', 'account_name, balance, initial_balance')
		.action(async (account: string[]) => {
			if (account.length < 3) {
				console.error(
					`Missing data! Add 3 arguments: account name, balance and initial balance`,
				);
				process.exit(1);
			}

			const [account_name, balance, initial_balance] = account;

			const formatBalance = Number(balance);
			const formatInitialBalance = Number(initial_balance);

			if (Number.isNaN(formatBalance) || Number.isNaN(formatInitialBalance)) {
				console.error('Invalid format!');
				process.exit(1);
			}

			console.log(`💾 Creating Account...`);
			await createAccount({
				account: {
					name: account_name,
					balance: Number(balance),
					initial_balance: Number(initial_balance),
				},
			});
		});
};
