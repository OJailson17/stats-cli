import fs from 'node:fs';
import { parse } from 'csv-parse';
import { pg } from 'lib/postgres';

type LanguageRow = {
	activity: string; // project
	language: string; // client
	description: string;
	duration: number;
	start_date: string;
	end_date: string;
	tags: string;
};

type Row = {
	Project: string;
	Client: string;
	Description: string;
	Duration: string;
	Tags: string;
	'Start date': string;
	'End date': string;
};

export const importLanguageData = async (filePath: string) => {
	const rows: LanguageRow[] = [];

	fs.createReadStream(filePath)
		.pipe(
			parse({ columns: true, skip_empty_lines: true, trim: true, bom: true }),
		)
		.on('data', (row: Row) => {
			const [hours, minutes, seconds] = row.Duration.split(':');

			const hoursToSeconds = Number(hours) * 60 * 60;
			const minutesToSeconds = Number(minutes) * 60;
			const durationInSeconds =
				hoursToSeconds + minutesToSeconds + Number(seconds);

			rows.push({
				language: row.Client,
				description: row.Description,
				activity: row.Project,
				duration: durationInSeconds,
				start_date: row['Start date'],
				end_date: row['End date'],
				tags: row.Tags,
			});
		})
		.on('end', async () => {
			try {
				await pg.connect();

				for (const row of rows) {
					await pg.query(
						'INSERT INTO "stats_languages" ("activity", "language", "description", "duration", "start_date", "end_date", "tags") VALUES ($1, $2, $3, $4, $5, $6, $7)',
						[
							row.activity,
							row.language,
							row.description,
							row.duration,
							row.start_date,
							row.end_date,
							row.tags,
						],
					);
				}

				console.log('✅ Data imported successfully!');
			} catch (err) {
				console.error('❌ Something went wrong!', err);
			} finally {
				await pg.end();
			}
		});
};
