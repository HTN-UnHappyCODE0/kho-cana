export interface PropsTableHistoryInventory {}

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
	totalAmountBefore: number;
	totalAmountAfter: number;
	description: string;
	path: string;
	status: number;
	created: string;
	uuid: string;
}
