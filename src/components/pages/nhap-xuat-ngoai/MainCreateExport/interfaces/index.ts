export interface PropsMainCreateExport {}
export interface IFormCreateExport {
	fromUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	warehouseUuid: string;
	toUuid: string;
	weightIntent: number;
	timeEnd: string | Date;
	description: string;
	transportType: number;
	timeStart: string | Date;
	documentId: string;
	portname: string;
	shipUuid: string;
}
