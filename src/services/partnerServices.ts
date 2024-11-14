import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, CONFIG_STATUS} from '~/constants/config/enum';
import axiosClient from '.';

const partnerServices = {
	listPartner: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			userUuid: string;
			provinceId: string;
			type: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/get-list-partner`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			userUuid: string;
			provinceId: string;
			type: number | null;
			companyUuid: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/export-excel-partner-debt`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertPartner: (
		data: {
			uuid: string;
			name: string;
			type: number;
			taxCode: string;
			phoneNumber: string;
			email: string;
			director: string;
			districtId: string;
			provinceId: string;
			townId: string;
			address: string;
			description: string;
			userOwenerUuid: string;
			bankName: string;
			bankAccount: string;
			companyUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/upsert-partner`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default partnerServices;
