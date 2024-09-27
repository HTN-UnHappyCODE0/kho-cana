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
	code: string;
	scaleStationUuid: string;
	reason: string;
}
