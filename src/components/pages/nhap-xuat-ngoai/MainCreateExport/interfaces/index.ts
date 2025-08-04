export interface PropsMainCreateExport {}
export interface IFormCreateExport {
	fromUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	warehouseUuid: string;
	toUuid: string;
	weight1: number;
	weight2: number;
	timeEnd: string | Date | null;
	description: string;
	transportType: number;
	timeStart: string | Date | null;
	documentId: string;
	portname: string;
	shipUuid: string;
	dryness: number;
	weightTotal: number;
}
