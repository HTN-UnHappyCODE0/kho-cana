export interface PropsTableDetail {}

export interface IWeightSession {
	description: string;
	accountUu: {
		username: string;
		status: number;
		uuid: string;
	};
	updatedTime: string;
	created: string;
	weight1: {
		weight: number;
		timeScales: string;
		scalesMachineUu: {
			status: number;
			name: string;
			uuid: string;
		};
	};
	weight2: {
		weight: number;
		timeScales: string;
		scalesMachineUu: {
			status: number;
			name: string;
			uuid: string;
		};
	};
	producTypeUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	specificationsUu: {
		name: string;
		status: number;
		uuid: string;
	};
	batchUu: null;
	specStyleUu: null;
	billUu: {
		uuid: string;
		code: string;
		ship: string;
		isSift: number;
		isBatch: number;
		scalesType: number;
	};
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
	truckUu: {
		code: string;
		licensePalate: string;
		status: number;
		uuid: string;
	};
	dryness: any;
	lstValueSpec: any;
	weightReal: number;
	status: number;
	code: string;
	uuid: string;
}
