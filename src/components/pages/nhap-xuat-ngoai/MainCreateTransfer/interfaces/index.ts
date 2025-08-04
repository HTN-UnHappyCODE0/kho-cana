export interface PropsMainCreateTransfer {}

export interface IFormCreateTransfer {
	transportType: number | null;
	isSift: number | null;
	isPrint: number;
	warehouseFromUuid: string;
	fromUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	warehouseToUuid: string;
	toUuid: string;
	timeIntend: string | Date;
	weight1: number;
	weight2: number;
	description: string;
	timeStart: string | Date | null;
	timeEnd: string | Date | null;
	dryness: number;
	weightTotal: number;
}
