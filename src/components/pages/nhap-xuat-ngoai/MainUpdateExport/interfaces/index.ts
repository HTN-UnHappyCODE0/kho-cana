export interface PropsMainUpdateExport {}

export interface IFormUpdateExport {
	fromUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	warehouseUuid: string;
	toUuid: string;
	weightIntent: number | string;
	timeEnd: string | Date;
	description: string;
	transportType: number;
	timeStart: string | Date;
	documentId: string;
	batchUuid: string;
	billUuid: string;
	shipUuid: string;
	portname: string;
}
