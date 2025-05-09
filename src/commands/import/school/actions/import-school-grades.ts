import fs from 'node:fs';
import { parse } from 'csv-parse';
import { pg } from 'lib/postgres';

type SchoolGradesRow = {
	school: string;
	acronym: string;
	year: number;
	school_grade: number;
	school_level: string;
	subject: string;
	unit: number;
	student_grade: number;
};

type Row = {
	Escola: string;
	'Sigla (escola)': string;
	Ano: string;
	Série: string;
	Etapa: string;
	Matéria: string;
	Unidade: string;
	Nota: string;
};

export const importSchoolGrades = async (filePath: string) => {
	const rows: SchoolGradesRow[] = [];

	fs.createReadStream(filePath)
		.pipe(
			parse({ columns: true, skip_empty_lines: true, trim: true, bom: true }),
		)
		.on('data', (row: Row) => {
			rows.push({
				acronym: row['Sigla (escola)'],
				school: row.Escola,
				school_grade: Number(row.Série),
				school_level: row.Etapa,
				student_grade: parseFloat(row.Nota),
				subject: row.Matéria,
				unit: Number(row.Unidade),
				year: Number(row.Ano),
			});
		})
		.on('end', async () => {
			try {
				await pg.connect();

				for (const row of rows) {
					await pg.query(
						'INSERT INTO "stats_studies_school_grades" ("school", "acronym", "year", "school_grade", "school_level", "subject", "unit", "student_grade") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
						[
							row.school,
							row.acronym,
							row.year,
							row.school_grade,
							row.school_level,
							row.subject,
							row.unit,
							row.student_grade,
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
