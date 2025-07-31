import {IDetailRepreCompany} from '~/components/pages/nha-cung-cap/PageDetailPartner/interfaces';

export interface PropsTemplateSampleSpec {
	customerName: string;
	countSample: number;
	listBill: {
		uuid: string;
		date: string;
		productName: string;
		code: string;
		licensePlate: string;
		weightTotal: number;
		drynessAvg: number;
		weightBdmt: number;
	}[];
	TypeQuality: boolean;
	detailRepreCompany: IDetailRepreCompany;
}
