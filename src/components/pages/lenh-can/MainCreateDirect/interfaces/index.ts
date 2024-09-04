export interface PropsMainCreateDirect {}

export interface IFormCreateDirect {
	transportType: number;
	isSift: number | null;
	isPrint: number;
	fromUuid: string;
	shipUuid: string;
	shipOutUuid: string;
	toUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	weightIntent: number;
	timeIntend: string | Date;
	documentId: string;
	description: string;
}
