export interface PropsTemplateSampleSpec {
	customerName: string;
	countSample: number;
	listBill: {
		uuid: string;
		date: string;
		productName: string;
		code: string;
		licensePalate: string;
		weightTotal: number;
		drynessAvg: number;
		weightBdmt: number;
	}[];
}
