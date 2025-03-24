export interface PropsMainUpdateExport {}

export interface IFormUpdateExport {
	batchUuid: string;
	billUuid: string;
	transportType: number;
	isSift: number | null;
	isPrint: number;
	shipUuid: string;
	fromUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	warehouseUuid: string;
	toUuid: string;
	weightIntent: number | string;
	timeIntend: string;
	documentId: string;
	description: string;
	weightTotal: number | string;
	timeStart: string | null;
	timeEnd: string | null;
	code: string;
	reason: string;
	isBatch: number;
	scaleStationUuid: string;
	portname: string;
	numShip: string;
}
