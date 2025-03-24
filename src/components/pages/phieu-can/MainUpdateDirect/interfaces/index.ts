export interface PropsMainUpdateDirect {}

export interface IFormUpdateDirect {
	batchUuid: string;
	billUuid: string;
	transportType: number;
	isSift: number | null;
	isPrint: number;
	fromUuid: string;
	shipUuid: string;
	toUuid: string;
	shipOutUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	weightIntent: number | string;
	timeIntend: string;
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
	storageTemporaryUuid: string;
	numShip: string;
}
