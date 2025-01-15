export interface PropsTemplateSampleSpec {
	customerName: string;
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
