import { Command } from 'commander';
import { registerCreateCommand } from './create';
import { registerImportCommand } from './import';
import { registerListCommand } from './list';
import { registerResetCommand } from './reset';

export default function registerCommands(program: Command) {
	registerImportCommand(program);
	registerCreateCommand(program);
	registerListCommand(program);
	registerResetCommand(program);
}
