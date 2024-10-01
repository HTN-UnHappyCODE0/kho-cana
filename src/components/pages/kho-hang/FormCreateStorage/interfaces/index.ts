export interface PropsFormCreateStorage {
	draggedElements: number[];
	onClose: () => void;
}

export interface IFormCreateStorage {
	name: string;
	productUuid: string;
	qualityUuid: string;
	specificationsUuid: string;
	description: string;
	amountKcs: number;
	drynessAvg: number;
	specWsValues: {
		uuid: string;
		title: string;
		value: number;
	}[];
}
