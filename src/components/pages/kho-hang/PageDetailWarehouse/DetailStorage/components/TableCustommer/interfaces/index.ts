export interface PropsTableCustomer {
	setTotalCustomer: (any: number) => void;
}

export interface IDataTableCustomerStorage {
	customerUu: {
		code: string;
		name: string;
		uuid: string;
	};
	type: number;
	amount: number;
	dayChange: string;
}
