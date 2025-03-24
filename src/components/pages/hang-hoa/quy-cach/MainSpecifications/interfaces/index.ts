export interface PropsMainSpecifications {}

export interface ISpecifications {
	description: string;
	created: string;
	updateTime: string;
	countRuler: number;
	criteriaUu: {
		uuid: string;
		title: string;
		ruler: number;
		value: number;
		status: number;
	}[];
	productTypeUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	colorShow: string;
	name: string;
	status: number;
	qualityUu: {
		name: string;
		status: number;
		uuid: string;
	};
	uuid: string;
}
