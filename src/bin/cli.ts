#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import registerCommands from 'commands';

const program = new Command();

program
	.version('1.0.0')
	.description('CLI to import data from CSV and populate PG Database');

registerCommands(program);

program.parse(process.argv);
