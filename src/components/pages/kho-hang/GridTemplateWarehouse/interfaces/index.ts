export interface PropsGridTemplateWarehouse {
	isUpdate: boolean;
	arrayDisabledGrid: IArrayDisabledGrid[];
	draggedElements?: number[];
	setDraggedElements?: (data: any) => void;
}

export interface IArrayDisabledGrid {
	uuid: string;
	name: string;
	code: string;
	arrayPostion: number[];
	amountBdmt: number;
	background: string;
	specificationName: string;
	col: number;
	row: number;
}
