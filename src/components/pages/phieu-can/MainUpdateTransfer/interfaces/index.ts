export interface PropsMainUpdateTransfer {}

export interface IFormUpdateTransfer {
	batchUuid: string;
	billUuid: string;
	transportType: number | null;
	isSift: number | null;
	isPrint: number;
	warehouseFromUuid: string;
	fromUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	warehouseToUuid: string;
	toUuid: string;
	timeIntend: string;
	weightIntent: number | string;
	description: string;
	weightTotal: number | string;
	timeStart: string | null;
	timeEnd: string | null;
	code: string;
	isBatch: number;
	reason: string;
	scaleStationUuid: string;
	portname: string;
}
