export interface PropsMainCreateService {}

export interface IFormCreateService {
	shipUuid: string;
	transportType: number;
	isPrint: number;
	productTypeUuid: string;
	timeIntend: string | Date;
	weightIntent: number;
	documentId: string;
	description: string;
	customerUuid: string;
	scaleStationUuid: string;
	portname: string;
	warehouseUuid: string;
	storageUuid: string;
}
