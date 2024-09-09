export interface PropsDetailBox {
	isConvert?: boolean;
	isLoading?: boolean;
	name: string;
	value: number;
	link?: string;
	color?: string;
	unit?: string;
	action?: React.ReactNode;
}
