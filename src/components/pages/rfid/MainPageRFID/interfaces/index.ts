export interface PropsMainPageRFID {}

export interface IRFID {
	description: string;
	created: string;
	updatedTime: string;
	truckUu: {
		code: string;
		licensePlate: string;
		status: number;
	};
	code: string;
	status: number;
	uuid: string;
}
