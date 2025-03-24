export interface PropsMainUpdateService {}

export interface IFormUpdateService {
	batchUuid: string;
	billUuid: string;
	shipUuid: string;
	transportType: number;
	isPrint: number;
	productTypeUuid: string;
	timeIntend: string;
	weightIntent: number | string;
	documentId: string;
	description: string;
	customerUuid: string;
	code: string;
	reason: string;
	scaleStationUuid: string;
	portname: string;
	warehouseUuid: string;
	storageUuid: string;
}
