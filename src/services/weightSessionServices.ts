import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const weightSessionServices = {
	listWeightsession: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			billUuid: string;
			storageUuid: string;
			isBatch: number | null;
			timeStart: string | null;
			timeEnd: string | null;
			specUuid: string | null;
			codeStart: number | null;
			codeEnd: number | null;
			productTypeUuid?: string | null;
			shift?: number | null;
			shipUuid?: string;
			scalesStationUuid?: string;
			isHaveSpec?: number | null;
			isHaveDryness?: number | null;
			truckUuid: string;
			listTruckUuid: string[];
			customerUuid: string;
			listCustomerUuid: string[];
			listCompanyUuid?: string[];
			typeProduct?: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/get-list-weightsession`, data, {
			cancelToken: tokenAxios,
		});
	},
	listTotalWeightsession: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			billUuid: string;
			truckUuid: string;
			storageUuid: string;
			isBatch: number | null;
			timeStart: string | null;
			timeEnd: string | null;
			specUuid: string | null;
			codeStart: number | null;
			codeEnd: number | null;
			customerUuid?: string | null;
			productTypeUuid?: string | null;
			shift?: number | null;
			shipUuid?: string;
			scalesStationUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/get-total-weightsession`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateSpecWeightSession: (
		data: {
			wsUuids: string[];
			lstValueSpec: {
				uuid: string;
				amountSample: number;
			}[];
			totalSample?: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/update-spec`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateDrynessWeightSession: (
		data: {
			wsUuids: string[];
			dryness: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/update-dryness`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateMultipleDrynessWeightSession: (
		data: {
			lstInfo: {
				wsUuids: string;
				dryness: number;
			}[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/update-dryness2`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateKCSWeightSession: (
		data: {
			wsUuids: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/update-kcs-weightsession`, data, {
			cancelToken: tokenAxios,
		});
	},
	getListWeightSessionGroupTruck: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			billUuid: string;
			truckUuid: string;
			storageUuid: string;
			customerUuid: string;
			productTypeUuid: string;
			isBatch: number | null;
			timeStart: string | null;
			timeEnd: string | null;
			specUuid: string;
			codeStart: number | null;
			codeEnd: number | null;
			shift: number | null;
			groupBy: number | null;

			listTruckUuid: string[];
			listCustomerUuid?: string[];
			companyUuid?: string;
			scalesStationUuid?: string;
			shipUuid?: string;
			isHaveSpec?: number;
			isHaveDryness?: number;
			isExportSpec?: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/get-list-weightsession-group-truck`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashbroadWeightsession: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			billUuid: string;
			truckUuid: string;
			listTruckUuid: string[];
			storageUuid: string;
			productTypeUuid: string;
			shipUuid: string;
			isBatch: number | null;
			timeStart: string | null;
			timeEnd: string | null;
			specUuid: string;
			codeStart: number | null;
			codeEnd: number | null;
			shift: number | null;
			scalesStationUuid?: string;
			customerUuid: string;
			listCustomerUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/dashbroad-weightsession`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcelWs: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			billUuid: string;
			truckUuid: string;
			storageUuid: string;
			isBatch: number | null;
			timeStart: string | null;
			timeEnd: string | null;
			specUuid: string | null;
			codeStart: number | null;
			codeEnd: number | null;
			customerUuid?: string | null;
			productTypeUuid?: string | null;
			shift?: number | null;
			shipUuid?: string;
			scalesStationUuid?: string;
			isHaveSpec?: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/export-excel-ws`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default weightSessionServices;
