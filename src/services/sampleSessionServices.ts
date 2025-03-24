import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const sampleSessionServices = {
	getListSampleSession: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			status: number | null;
			customerUuid: string;
			shipUuid?: string;
			type: number | null;
			specUuid: string;
			fromDate: string | null;
			toDate: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/get-list-sample-session`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertSampleSession: (
		data: {
			billUuid: string;
			uuid: string;
			type: number;
			specUuid: string;
			trayNumber: number;
			fromDate: string | null;
			toDate: string | null;
			analysisDate: string | null;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/upsert-sample-session`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailSampleSession: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/detail-sample-session`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatusSampleSession: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/change-status-sample-session`, data, {
			cancelToken: tokenAxios,
		});
	},

	upsertSampleCriterial: (
		data: {
			sampleDataUuid: string;
			totalWeight: number;
			sampleCriterialDTOs: {
				uuid: string;
				sampleDataUuid: string;
				criteriaUuid: string;
				orderNumber: number;
				weight: number;
				percentage: number;
				isAuto: boolean;
			}[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/upsert-sample-criterial`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertSampleDryness: (
		data: {
			sampleDataUuid: string;
			sampleDrynessDTOs: {
				uuid: string;
				sampleDataUuid: string;
				orderNumber: number;
				trayCode: string;
				trayWeight: number;
				woodWeight: number;
				trayWoodWeight1: number;
				trayWoodWeight2: number;
				trayWoodWeight3: number;
			}[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/upsert-sample-dryness`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertSampleData: (
		data: {
			sampleSessionUuid: string;
			sampleDataDTOs: {
				uuid: string;
				rootUuid: string;
				customerUuid: string;
				wsUuid: string;
				billCode: string;
				orderNumber: number;
				totalWeight: number;
				finalDryness: number;
				description: string;
			}[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/upsert-sample-data`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertSampleDescription: (
		data: {
			sampleDataUuid: string;
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/upsert-sample-description`, data, {
			cancelToken: tokenAxios,
		});
	},
	getListSampleData: (
		data: {
			sampleSessionUuid: string | null;
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/get-list-sample-data`, data, {
			cancelToken: tokenAxios,
		});
	},
	getListSampleData2: (
		data: {
			lstSampleSessionUuid: string[];
			lstCustomerUuid?: string[];
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/get-list-sample-data2`, data, {
			cancelToken: tokenAxios,
		});
	},
	confirmSample: (
		data: {
			uuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/SampleSession/confirm-sample-session`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default sampleSessionServices;
