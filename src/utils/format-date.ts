export const formatDate = (dateStr: string) => {
	// REgular expressions to detect date formats
	const DayMonthYearRegex = /^\d{2}\.\d{2}\.\d{4}$/; // Ex: 03.02.2024
	const YearMonthDayRegex = /^\d{4}-\d{2}-\d{2}$/; // Ex: 2024-02-03
	const MonthDayYearRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/; // Ex: 3/2/2024 ou 12/25/2024
	const mDYyRegex = /^\d{1,2}\/\d{1,2}\/\d{2}$/; // Ex: 3/2/25

	if (YearMonthDayRegex.test(dateStr)) {
		// if it's in the right format, just return it
		return dateStr;
	} else if (DayMonthYearRegex.test(dateStr)) {
		// if it's in the DD.MM.YYYY format, convert to YYYY-MM-DD
		const [day, month, year] = dateStr.split('.');
		return `${year}-${month}-${day}`;
	} else if (MonthDayYearRegex.test(dateStr)) {
		//  if it's in the M/D/YYYY format, convert to YYYY-MM-DD
		const [month, day, year] = dateStr.split('/');

		// assure that the day and month have always two digits
		const formattedMonth = month.padStart(2, '0');
		const formattedDay = day.padStart(2, '0');

		return `${year}-${formattedMonth}-${formattedDay}`;
	} else if (mDYyRegex.test(dateStr)) {
		let [month, day, shortYear] = dateStr.split('/');

		// Converte ano de dois dígitos para quatro dígitos
		let year = Number(shortYear) < 50 ? `20${shortYear}` : `19${shortYear}`;

		month = String(Number(month)).padStart(2, '0');
		day = String(Number(day)).padStart(2, '0');

		return `${year}-${month}-${day}`;
	} else {
		throw new Error(`Formato de data inválido: ${dateStr}`);
	}
};
