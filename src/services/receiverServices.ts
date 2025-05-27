import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const receiverServices = {
	getListReceiver: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			qualityUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Receiver/get-list-receiver`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatus: (
		data: {
			uuid: string;
			status: CONFIG_STATUS;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Receiver/change-status-receiver`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertReceiver: (
		data: {
			uuid: string;
			name: string;
			director: string;
			taxCode: string;
			address: string;
			fullName: string;
			codeName: string;
			regencyName: string;
			qualityUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Receiver/upsert-receiver`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailReceiver: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Receiver/detail-receiver`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default receiverServices;
