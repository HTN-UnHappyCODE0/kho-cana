export interface PropsPopupTableHistoryInventory {
	onClose: () => void;
}

export interface IInventory {
	storageUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	accountUu: {
		username: string;
		status: 1;
		uuid: string;
	};
	totalAmount: number;
	description: string;
	path: string;
	status: number;
	created: string;
	uuid: string;
}
