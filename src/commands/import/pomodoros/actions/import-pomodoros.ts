import { parse } from 'csv-parse';
import { pg } from 'lib/postgres';
import fs from 'node:fs';

type Row = {
	'End Date': string;
	'End Time (24 Hour)': string;
	'Duration (Seconds)': string;
};

type PomodorosRow = {
	end_time: string;
	end_date: string;
	duration: number;
};

export const importPomodoros = async (filePath: string) => {
	const rows: PomodorosRow[] = [];

	await pg.connect();

	const { rows: pomodorosCount } = await pg.query(
		`SELECT COUNT(*) FROM "stats_pomodoros"`,
	);
	const countFromLine = pomodorosCount[0].count
		? Number(pomodorosCount[0].count) + 1
		: 1;

	fs.createReadStream(filePath)
		.pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
				trim: true,
				bom: true,
				from: countFromLine,
			}),
		)
		.on('data', (row: Row) => {
			rows.push({
				duration: Number(row['Duration (Seconds)']),
				end_date: row['End Date'],
				end_time: row['End Time (24 Hour)'],
			});
		})
		.on('end', async () => {
			try {
				if (rows.length > 0) {
					for (const row of rows) {
						await pg.query(
							`INSERT INTO "stats_pomodoros" ("end_date", "end_time", "duration") VALUES ($1, $2, $3)`,
							[row.end_date, row.end_time, row.duration],
						);
					}

					console.log('✅ Data imported successfully!');
				} else {
					console.log('No data to be imported');
				}
			} catch (err) {
				console.error('❌ Something went wrong!', err);
			} finally {
				pg.end();
			}
		});
};
