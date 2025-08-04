export interface PropsMainPageSampleSpec {}

export interface ISampleSession {
	specUu: {
		name: string;
		status: number;
		qualityUu: any;
		uuid: string;
	};
	billUu: {
		status: number;
		code: string;
		countWs: number;
		state: number;
		uuid: string;
	};
	customerUu: {
		code: string;
		name: string;
		status: number;
		typeCus: number;
		companyUu: any;
		uuid: string;
	};
	shipUu: {
		code: string;
		licensePlate: string;
		status: number;
		uuid: string;
	};
	trayNumber: number;
	cabinet: any;
	fromDate: string;
	toDate: string;
	analysisDate: string;
	code: string;
	type: number;
	status: number;
	uuid: string;
	drynessAvg: number;
}
