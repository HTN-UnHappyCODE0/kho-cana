export interface PropsChartDashboard {
	dataChart: {
		specWeight: {
			name: string;
			value: number;
			color: string;
		}[];
		productWeight: {name: string; value: number; color: string}[];
		qualityWeight: {name: string; value: number; color: string}[];
	};
	totalValueChart: number;
	arrayTypeAction: ('product' | 'quality' | 'spec')[];
}
