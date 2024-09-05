export interface PropsMainUpdateService {}

export interface IFormUpdateService {
	batchUuid: string;
	billUuid: string;
	shipUuid: string;
	transportType: number;
	isPrint: number;
	customerUuid: string;
	productTypeUuid: string;
	timeIntend: string;
	weightIntent: number | string;
	documentId: string;
	description: string;
}
