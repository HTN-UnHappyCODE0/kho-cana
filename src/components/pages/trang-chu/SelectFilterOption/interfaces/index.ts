export interface PropsSelectFilterOption {
	placeholder: string;
	uuid: string;
	setUuid: (string: string) => void;
	listData: {uuid: string; name: string}[];
}
