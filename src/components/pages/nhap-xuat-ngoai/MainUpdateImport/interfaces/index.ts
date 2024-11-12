export interface PropsMainUpdateImport {}

export interface IFormUpdateImport {
	fromUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	warehouseUuid: string;
	toUuid: string;
	weightIntent: number | string;
	description: string;
	timeStart: string | Date;
	timeEnd: string | Date;
	transportType: number;
	documentId: string;
	batchUuid: string;
	billUuid: string;
	portname: string;
	shipUuid: string;
}
