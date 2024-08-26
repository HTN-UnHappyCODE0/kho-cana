export interface PropsMainCreateImport {}

export interface IFormCreateImport {
	transportType: number;
	isSift: number | null;
	isPrint: number;
	shipUuid: string;
	fromUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	warehouseUuid: string;
	toUuid: string;
	weightIntent: number;
	timeIntend: string;
	documentId: string;
	description: string;
}
