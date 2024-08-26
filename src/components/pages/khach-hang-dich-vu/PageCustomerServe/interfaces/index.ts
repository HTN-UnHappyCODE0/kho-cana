export interface PropsPageCustomerService {}

export interface ICustomer {
	customerUu: {
		phoneNumber: string;
		warehouseUu: {
			code: string;
			name: string;
			status: number;
			uuid: string;
		};
		status: number;
		code: string;
		name: string;
		typeCus: string;
		uuid: string;
	};
	specUu: {
		name: string;
		status: number;
		qualityUu: {
			name: string;
			status: number;
			uuid: string;
		};
		uuid: string;
	};
	qualityUu: {
		name: string;
		status: number;
		uuid: string;
	};
	productTypeUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	transportType: number;

	storageUu: {code: string; name: string; status: number; uuid: string};
}
