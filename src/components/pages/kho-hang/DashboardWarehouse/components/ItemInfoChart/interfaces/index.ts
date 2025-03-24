export interface PropsItemInfoChart {
	text: string;
	arrayData: {
		color: string;
		name: string;
		value: number;
	}[];
	keyAction: 'product' | 'quality' | 'spec';
	arrayTypeAction: ('product' | 'quality' | 'spec')[];
	handleAction: () => void;
}
