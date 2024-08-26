export interface PropsTable {
	data: any;
	column: {
		title: any;
		render: any;
		className?: string;
		checkBox?: boolean;
		textAlign?: string;
		fixedLeft?: boolean;
		fixedRight?: boolean;
	}[];
	onSetData?: (any: any) => void;
	isChild?: boolean;
}
