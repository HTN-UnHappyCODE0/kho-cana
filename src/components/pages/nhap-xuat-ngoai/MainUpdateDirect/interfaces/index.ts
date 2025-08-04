export interface PropsMainUpdateDirect {}
export interface IFormUpdateDirect {
	transportType: number;
	fromUuid: string;
	shipUuid: string;
	shipOutUuid: string;
	toUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	weight1: number | string;
	weight2: number | string;
	documentId: string;
	description: string;
	warehouseUuid: string;
	storageTemporaryUuid: string;
	timeStart: string | Date;
	timeEnd: string | Date;
	batchUuid: string;
	billUuid: string;
	code: string;
	dryness: number;
}
