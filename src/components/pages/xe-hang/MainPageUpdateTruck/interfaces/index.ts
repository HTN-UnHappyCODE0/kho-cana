import {OWNEW_TYPE_TRUCK} from '~/constants/config/enum';

export interface PropsMainPageUpdateTruck {}

export interface IFormUpdateTruck {
	code: string;
	licensePlate: string;
	minWeight: number | string;
	maxWeight: number | string;
	averageWeight: number | string;
	ownerType: OWNEW_TYPE_TRUCK;
	trucktype: string;
	managerUuid: string;
	description: string;
}
