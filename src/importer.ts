import { importFinanceData } from 'modules/finances/actions/import-finances';
import { importLanguageData } from 'modules/languages/actions/import-languages';
import { importStudiesData } from 'modules/studies/actions/import-studies';

type FileType = 'languages' | 'finances' | 'studies';
type FinanceType = 'incomes' | 'expenses' | 'transfers';

type ImportDataProps = {
	fileType: FileType;
	filePath: string;
	financeType?: FinanceType;
};

export async function importData({
	fileType,
	filePath,
	financeType,
}: ImportDataProps) {
	if (fileType === 'languages') {
		return importLanguageData(filePath);
	}

	if (fileType === 'studies') {
		return importStudiesData(filePath);
	}

	if (fileType === 'finances') {
		return importFinanceData({ filePath, type: financeType || 'incomes' });
	}

	console.log('❌ error: File type not recognized');
	process.exit(1);
}
