export interface PropsMainUpdateTransfer {}

export interface IFormCreateTransfer {
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
	weight1: number | string;
	weight2: number | string;
	description: string;
	timeStart: string | Date | null;
	timeEnd: string | Date | null;
	code: string;
	dryness: number;
}
