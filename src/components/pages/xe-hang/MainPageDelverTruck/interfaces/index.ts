export interface PropsMainPageDelverTruck {}

export interface ITruck {
	minWeight: number;
	maxWeight: number;
	lastWeight: number;
	description: string;
	created: string;
	updatedTime: string;
	managerUu: {
		code: string;
		fullName: string;
		uuid: string;
	};
	rfid: {
		code: string;
		status: number;
		uuid: string;
	}[];
	trucktype: string;
	ownerType: number;
	code: string;
	licensePalate: string;
	status: number;
	uuid: string;
}
