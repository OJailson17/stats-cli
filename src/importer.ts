import { importFinanceData } from 'modules/finances/actions/import-finances';
import { importLanguageData } from 'modules/languages/actions/import-languages';
import { importStudiesData } from 'modules/studies/actions/import-studies';

type Type = 'languages' | 'finances' | 'studies';

export async function importData(type: Type, filePath: string) {
	if (type === 'languages') {
		return importLanguageData(filePath);
	}

	if (type === 'studies') {
		return importStudiesData(filePath);
	}

	// Default to finance-related
	return importFinanceData(type, filePath);
}
