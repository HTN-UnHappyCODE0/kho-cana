import {OWNEW_TYPE_TRUCK} from '~/constants/config/enum';

export interface PropsMainPageCreateTruck {}

export interface IFormCreateTruck {
	code: string;
	licensePlate: string;
	minWeight: number;
	maxWeight: number;
	averageWeight: number;
	ownerType: OWNEW_TYPE_TRUCK;
	trucktype: string;
	managerUuid: string;
	description: string;
}
