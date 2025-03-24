export interface PropsMainUpdateService {}

export interface IFormUpdateService {
	batchUuid: string;
	customerUuid: string;
	billUuid: string;
	shipUuid: string;
	transportType: number;
	isPrint: number;
	productTypeUuid: string;
	timeIntend: string;
	weightIntent: number | string;
	documentId: string;
	description: string;
	weightTotal: number | string;
	timeStart: string | null;
	timeEnd: string | null;
	code: string;
	isBatch: number;
	reason: string;
	scaleStationUuid: string;
	portname: string;
	warehouseUuid: string;
	storageUuid: string;
}
