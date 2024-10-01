export interface PropsFormUpdatePostionStorage {
	draggedElements: number[];
	onClose: () => void;
}

export interface IFormUpdatePostionStorage {
	storageUuid: string;
	name: string;
	warehouseUuid: string;
	productUuid: string;
	qualityUuid: string;
	specificationsUuid: string;
	description: string;
	amountKcs: number | string;
	drynessAvg: number;
	specWsValues: {
		uuid: string;
		title: string;
		value: number;
	}[];
}
