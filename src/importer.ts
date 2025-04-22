import { importFinanceData } from 'modules/finances/actions/import-finances';
import { importLanguageData } from 'modules/languages/actions/import-languages';

export async function importData(type: string, filePath: string) {
	if (type === 'languages') {
		return importLanguageData(filePath);
	}

	// Default to finance-related
	return importFinanceData(type, filePath);
}
