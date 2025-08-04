import {IAddress} from '~/constants/config/interfaces';

export interface PropsMainCreateImport {}

export interface IFormCreateImport {
	fromUuid: string;
	productTypeUuid: string;
	specificationsUuid: string;
	warehouseUuid: string;
	toUuid: string;
	weight1: number;
	weight2: number;
	description: string;
	timeStart: string | Date | null;
	timeEnd: string | Date | null;
	transportType: number;
	documentId: string;
	portname: string;
	shipUuid: string;
	dryness: number;
	weightTotal: number;
}

export interface IDetailCustomer {
	email: string;
	director: string;
	description: string;
	address: string;
	created: string;
	updated: string;
	specPriceDTO: any[];
	phoneNumber: string;
	isSift: number;
	transportType: number;
	warehouseUu: {
		uuid: string;
		code: string;
		name: string;
	};
	status: number;
	userUu: {
		code: string;
		fullName: string;
		provinceOwner: {
			uuid: string;
			code: string;
			name: string;
		};
		uuid: string;
	};
	detailAddress: IAddress;
	partnerUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	code: string;
	name: string;
	uuid: string;

	customerSpec: IlistCustomerSpec[];
}

export interface IlistCustomerSpec {
	state: number;
	status: number;
	transportType: number;
	specUu: {
		name: string;
		status: number;
		qualityUu: {
			name: string;
			status: number;
			uuid: string;
		};
		uuid: string;
	};
	pricetagUu: {
		code: string;
		amount: number;
		status: number;
		uuid: string;
	};
	qualityUu: {
		name: string;
		status: number;
		uuid: string;
	};
	productTypeUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	accountUu: {
		username: string;
		status: number;
		uuid: string;
	};
	storageUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	uuid: string;
}
