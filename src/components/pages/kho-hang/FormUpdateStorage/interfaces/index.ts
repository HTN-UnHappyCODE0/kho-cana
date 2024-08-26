export interface PropsFormUpdateStorage {
	onClose: () => void;
}

export interface IFormUpdateStorage {
	name: string;
	warehouseUuid: string;
	productUuid: string;
	qualityUuid: string;
	specificationsUuid: string;
	locationMap: string;
	description: string;
}
