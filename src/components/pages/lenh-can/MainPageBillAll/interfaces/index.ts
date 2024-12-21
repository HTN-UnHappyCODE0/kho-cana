export interface PropsMainPageBillAll {}

export interface IDataBill {
	lstTruck: {
		code: string;
		licensePalate: string;
		status: number;
		uuid: number;
	}[];
	typePrint: number;
	isSift: number;
	timeStart: string;
	timeEnd: string;
	updatedTime: string;
	created: string;
	documentId: string;
	accountUu: {
		username: string;
		status: number;
		uuid: string;
	};
	accountUpdateUu: {
		username: string;
		status: number;
		uuid: string;
	};
	description: string;
	qualityUu: {
		name: string;
		status: number;
		uuid: string;
	};
	weightTotal: number;
	customerName: string;
	scalesType: number;
	transportType: number;
	specificationsUu: {
		name: string;
		status: number;
		uuid: string;
	};
	batchsUu: {
		uuid: string;
		shipUu: {
			code: string;
			licensePalate: string;
			status: number;
			uuid: string;
		};
		shipOutUu: {
			code: string;
			licensePalate: string;
			status: number;
			uuid: string;
		};
		isShip: number;
		weightIntent: number;
		timeIntend: string;
	};
	productTypeUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	pricetagUu: {
		code: string;
		amount: number;
		status: number;
		uuid: string;
	};
	isBatch: number;
	fromUu: {
		parentUu: {
			uuid: string;
			code: string;
			name: string;
		};
		uuid: string;
		code: string;
		name: string;
	};
	toUu: {
		parentUu: {
			uuid: string;
			code: string;
			name: string;
		};
		uuid: string;
		code: string;
		name: string;
	};
	scalesStationUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	moneyTotal: number;
	status: number;
	code: string;
	uuid: string;
	port: string;
	weigth1: number;
	weigth2: number;
	shipTempUu: {
		code: string;
		licensePalate: string;
		uuid: string;
	};
}
