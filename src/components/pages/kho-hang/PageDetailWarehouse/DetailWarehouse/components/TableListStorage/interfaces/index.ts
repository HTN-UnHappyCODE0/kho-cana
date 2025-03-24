export interface PropsTableListStorage {}

export interface IDataListStorage {
	productUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	qualityUu: {
		name: string;
		status: number;
		uuid: string;
	};
	specificationsUu: {
		colorShow: string;
		name: string;
		status: number;
		qualityUu: {
			name: string;
			status: number;
			uuid: string;
		};
		uuid: string;
	};
	amountMt: number;
	amountKcs: number;
	amountBdmt: number;
	amountBdmtDemo: number;
	totalAmountMt: number;
	totalAmountBdmt: number;
	amountIn: number;
	amountOut: number;
	amountChangeIn: number;
	amountChangeOut: number;
	totalAmountIn: number;
	totalAmountOut: number;
	locationMap: string;
	code: string;
	name: string;
	status: number;
	uuid: string;
}
