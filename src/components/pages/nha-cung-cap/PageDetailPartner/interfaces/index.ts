import {SassString} from 'sass';
import {IAddress} from '~/constants/config/interfaces';

export interface PropsPageDetailPartner {}
export interface IDetailCustomer {
	email: string;
	director: string;
	description: string;
	address: string;
	created: string;
	updated: string;
	specUu: {
		name: string;
		status: string;
		qualityUu: {
			name: string;
			status: number;
			uuid: string;
		};
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
	customerSpec: [
		{
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
			accountUu: any;
			uuid: string;
		}
	];
	phoneNumber: string;
	isSift: number;
	transportType: number;
	warehouseUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
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
	detailAddress: {
		province: {
			uuid: string;
			code: string;
			name: string;
		};
		district: {
			uuid: string;
			code: string;
			name: string;
		};
		town: {
			uuid: string;
			code: string;
			name: string;
		};
	};
	partnerUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	code: string;
	name: string;
	status: number;
	typeCus: number;
	uuid: string;
}
