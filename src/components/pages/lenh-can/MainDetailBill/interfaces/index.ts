export interface PropsMainDetailBill {}

export interface IDetailBatchBill {
	numShip: string;
	lstTruck: {
		code: string;
		licensePalate: string;
		status: number;
		uuid: number;
	}[];
	isPrint: number;
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
	moneyTotal: number;
	status: number;
	state: number;
	code: string;
	uuid: string;
	scalesStationUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	port: string;
	weightSessionUu: {
		truckUu: {
			code: string;
			licensePalate: string;
			status: number;
			uuid: string;
		};
		status: number;
		code: string;
		uuid: string;
	};
	weigth1: number;
	weigth2: number;
	storageTemporaryUu: {
		parentUu: {
			uuid: string;
			code: string;
			name: string;
		};
		uuid: string;
		code: string;
		name: string;
	};
	path: string[];
	weightMon: number;
	shipTempUu: {
		code: string;
		licensePalate: string;
		uuid: string;
	};
}
