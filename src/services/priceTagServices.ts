import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';
import axios from 'axios';

const priceTagServices = {
	listPriceTag: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			customerUuid: string | null;
			specUuid: string | null;
			productTypeUuid: string | null;
			priceTagUuid: string;
			transportType?: number | null;
			state: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/get-list-price-tag-info`, data, {
			cancelToken: tokenAxios,
		});
	},
	listPriceTagDropDown: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/get-list-pricetag`, data, {
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
		return axiosClient.post(``, data, {
			cancelToken: tokenAxios,
		});
	},
	detailPriceTag: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/detail-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	addPricetagToCustomer: (
		data: {
			infoSpec: {
				specUuid: string;
				status: 0 | 1;
				productTypeUuid: string;
				priceTagUuid: string | null;
				state: 0 | 1;
				transportType: number;
			}[];
			customerUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/add-pricetag-to-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	updatePricetagToCustomer: (
		data: {
			uuid: string;
			priceTagUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/update-pricetag-to-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetail: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/detail-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailFixPricetag: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/detail-fix-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	getListUpdatePriceTag: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			productTypeUuid: string;
			transportType: number | null;
			specificationUuid: number | null;
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/history-fix-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	fixPricetag: (
		data: {
			billUuids: string[];
			pricetagUuid: string;
			description: string;
			customerUuid: string;
			producTypeUuid: string;
			specificationUuid: string;
			transportType: number | null;
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/fix-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default priceTagServices;
