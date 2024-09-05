export interface PropsMainCreateService {}

export interface IFormCreateService {
	shipUuid: string;
	transportType: number;
	isPrint: number;
	customerUuid: string;
	productTypeUuid: string;
	timeIntend: string | Date;
	weightIntent: number;
	documentId: string;
	description: string;
}
