import {IAddress} from '~/constants/config/interfaces';

export interface PropsDetailWarehouse {}

export interface IDetailWarehouse {
	description: string;
	created: string;
	updatedTime: string;
	countCustomer: number;
	countSpec: number;
	countProductType: number;
	countQuality: number;
	address: string;
	amountIn: number;
	amountOut: number;
	amountChangeIn: number;
	amountChangeOut: number;
	totalAmountIn: number;
	totalAmountOut: number;
	scaleStationUu: {
		code: string;
		name: string;
		status: number;
		warehouseUu: {
			uuid: string;
			code: string;
			name: string;
			status: number;
		};
		uuid: string;
	};
	detailAddress: IAddress;
	storage: {
		productUu: {
			code: string;
			name: string;
			status: number;
			type: number;
			uuid: string;
		};
		qualityUu: {
			name: string;
			status: number;
			uuid: string;
		};
		specificationsUu: {
			colorShow: string;
			name: string;
			status: number;
			uuid: string;
		};
		amountMt: number;
		amountBdmt: number;
		amountIn: number;
		amountOut: number;
		amountChangeIn: number;
		amountChangeOut: number;
		locationMap: string;
		code: string;
		name: string;
		status: number;
		uuid: string;
	}[];
	amountMT: number;
	amountKCS: number;
	amountBDMT: number;
	amountBDMTDemo: number;
	totalAmountMT: number;
	totalAmountBDMT: number;
	code: string;
	name: string;
	status: number;
	uuid: string;
}

export interface storage {
	productUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	qualityUu: {
		name: string;
		status: number;
		uuid: string;
	};
	specificationsUu: {
		colorShow: string;
		name: string;
		status: number;
		uuid: string;
	};
	amountMt: number;
	amountBdmt: number;
	amountIn: number;
	amountOut: number;
	amountChangeIn: number;
	amountChangeOut: number;
	locationMap: string;
	code: string;
	name: string;
	status: number;
	uuid: string;
}
