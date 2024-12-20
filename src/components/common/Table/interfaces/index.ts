export interface PropsTable {
	data: any;
	column: {
		title: string | React.ReactNode;
		render: any;
		className?: string;
		checkBox?: boolean;
		textAlign?: string;
		fixedLeft?: boolean;
		fixedRight?: boolean;
		selectRow?: boolean;
	}[];
	onSetData?: (any: any) => void;
	isChild?: boolean;
}
