export type Row = {
	Description: string;
	Amount: string;
	Confirmation: string;
	Category: string;
	Subcategory: string;
	Account: string;
	'C. Card'?: string;
	'Due date'?: string;
	'▲ Origin'?: string;
	'▼ Destination'?: string;
};

export type ExpenseRow = {
	description: string;
	amount: number;
	date: string;
	category: string;
	subcategory: string;
	account_name: string;
	credit_card: string;
};

export type IncomeRow = {
	description: string;
	amount: number;
	date: string;
	category: string;
	subcategory: string;
	account_name: string;
};

export type TransferRow = {
	description: string;
	amount: number;
	date: string;
	origin_account: string;
	destiny_account: string;
};

export type TransactionRow = {
	account_id: number;
	date: string;
	amount: number;
	transaction_type: 'income' | 'expense' | 'transfer_in' | 'transfer_out';
	created_at: string;
};

export type Account = {
	id: number;
	account: string;
	balance: number;
};
