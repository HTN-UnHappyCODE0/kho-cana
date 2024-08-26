export interface PropsDetailStorage {}

export interface IDetailStorage {
	description: string;
	created: string;
	updatedTime: string;
	drynessAvg: number;
	warehouseUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	productUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	qualityUu: {
		name: string;
		status: number;
		uuid: string;
	};
	specificationsUu: {
		name: string;
		status: number;
		colorShow: string;
		uuid: string;
	};
	code: string;
	name: string;
	status: number;
	amountMt: number;
	amountBdmt: number;
	amountBdmtDemo: number;
	amountIn: number;
	amountOut: number;
	amountChangeIn: number;
	amountChangeOut: number;
	locationMap: string;
	uuid: string;
	countCustomer: number;
	positionY: number;
	amountKcs: number;
	totalAmountIn: number;
	totalAmountOut: number;
	totalAmountMt: number;
	listSpecValue: {
		criteriaUu: {
			uuid: string;
			title: string;
			ruler: number;
			value: number;
			status: number;
		};
		value: number;
	}[];
}
