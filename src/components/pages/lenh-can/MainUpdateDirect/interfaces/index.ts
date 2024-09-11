export interface PropsMainUpdateDirect {}

export interface IFormUpdateDirect {
	batchUuid: string;
	billUuid: string;
	transportType: number;
	isSift: number | null;
	isPrint: number;
	fromUuid: string;
	shipUuid: string;
	toUuid: string;
	shipOutUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	weightIntent: number | string;
	timeIntend: string;
	documentId: string;
	description: string;
	code: string;
	reason: string;
}
