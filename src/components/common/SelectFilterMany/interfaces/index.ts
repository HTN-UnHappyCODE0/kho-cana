export interface PropsSelectFilterMany {
	isShowAll?: boolean;
	name: string;
	selectedIds: string[];
	setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
	setSelectedNames?: (names: string[]) => void;
	listData: {uuid: string; name: string}[];
}
