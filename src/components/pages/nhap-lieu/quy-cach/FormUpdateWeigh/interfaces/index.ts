import {IWeightSession} from '../../MainSpecification/interfaces';

export interface PropsFormUpdateWeigh {
	onClose: () => void;
	dataUpdateWeigh: IWeightSession[];
}

export interface ISampleData {
	isRoot: boolean;
	totalWeight: number;
	finalDryness: number;
	wsUuid: any;
	billCode: any;
	description: any;
	customerUu: any;
	rootUu: any;
	sampleCriterial: {
		criteriaName: string;
		sampleDataUuid: string;
		criteriaUuid: string;
		weight: number;
		percentage: number;
		isAuto: boolean;
		status: number;
		orderNumber: number;
		uuid: string;
	}[];
	sampleDryness: {
		sampleDataUuid: string;
		trayCode: any;
		trayWeight: number;
		woodWeight: number;
		trayWoodWeight1: number;
		burnHours1: number;
		inputTime1: string;
		trayWoodWeight2: number;
		burnHours2: number;
		inputTime2: string;
		trayWoodWeight3: any;
		burnHours3: any;
		inputTime3: any;
		finalDryness: number;
		created: string;
		updatedTime: string;
		status: number;
		orderNumber: number;
		uuid: string;
	}[];
	sampleSessionUu: {
		code: string;
		type: number;
		status: number;
		uuid: string;
	};
	status: number;
	orderNumber: number;
	uuid: string;
}
