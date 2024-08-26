import {IAddress} from '~/constants/config/interfaces';

export interface PropsDetailCustomerService {}
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
}
