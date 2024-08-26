export interface PropsMainPageRFID {}

export interface IRFID {
	description: string;
	created: string;
	updatedTime: string;
	truckUu: {
		code: string;
		licensePalate: string;
		status: number;
		uuid: string;
	};
	code: string;
	status: number;
	uuid: string;
}
