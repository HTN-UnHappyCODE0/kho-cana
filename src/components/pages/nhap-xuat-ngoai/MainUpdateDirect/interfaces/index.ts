export interface PropsMainUpdateDirect {}
export interface IFormUpdateDirect {
	transportType: number;
	fromUuid: string;
	shipUuid: string;
	shipOutUuid: string;
	toUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	weightIntent: number | string;
	documentId: string;
	description: string;
	warehouseUuid: string;
	storageTemporaryUuid: string;
	timeStart: string | Date;
	timeEnd: string | Date;
	batchUuid: string;
	billUuid: string;
}
