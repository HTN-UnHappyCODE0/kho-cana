export interface PropsMainScaleTable {}

export interface IScalesMachine {
	description: string;
	created: string;
	updatedTime: string;
	scalesStationUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	phoneNumber: string;
	scalesStationUuid: string;
	status: number;
	name: string;
	uuid: string;
}
