import {IAddress} from '~/constants/config/interfaces';

export interface PropsMainWeighingStation {}

export interface IScalesStation {
	detailAddress: IAddress;
	address: string;
	phoneNumber: string;
	warehouses: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	code: string;
	name: string;
	status: number;
	uuid: string;
	companyUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	description: string;
	scalesMachine: {
		status: number;
		name: string;
		uuid: string;
	}[];
}
