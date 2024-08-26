export interface PropsFormUpdatePostionStorage {
	draggedElements: number[];
	onClose: () => void;
}

export interface IFormUpdatePostionStorage {
	storageUuid: string;
	name: string;
	productUuid: string;
	qualityUuid: string;
	specificationsUuid: string;
	description: string;
}
