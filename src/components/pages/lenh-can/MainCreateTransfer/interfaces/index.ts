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
	weightIntent: number;
	description: string;
	scaleStationUuid: string;
}
