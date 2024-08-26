export interface PropsMainSpecification {}

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
		qualityUu: {
			status: number;
			name: string;
			uuid: string;
		};
		uuid: string;
	};
	batchUu: {
		uuid: string;
		shipUu: any;
		shipOutUu: any;
		isShip: number;
		weightIntent: number;
		timeIntend: string;
	};
	specStyleUu: {
		criteriaUu: {
			uuid: string;
			title: string;
			ruler: number;
			value: number;
			status: number;
		};
		value: number;
	}[];
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
	dryness: number | null;
	shift: number;
	weightReal: number;
	count: number;
	status: number;
	code: string;
	uuid: string;
}
