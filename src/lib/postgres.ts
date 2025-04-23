import { config } from 'dotenv';
import pkg from 'pg';
import path from 'node:path';

const { Client } = pkg;

const __dirname = path.dirname(require.main?.filename || '');

config({
	path: path.resolve(__dirname, '../.env'),
});

// Postgres setup
export const pg = new Client({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: Number(process.env.DB_PORT) || 5432,
});
