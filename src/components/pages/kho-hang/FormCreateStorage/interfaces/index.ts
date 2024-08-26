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
}
