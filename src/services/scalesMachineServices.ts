import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, CONFIG_STATUS} from '~/constants/config/enum';
import axiosClient from '.';
const scalesMachineServices = {
	listScalesMachine: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			scalesStationUuid?: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`ScalesMachine/get-list-scalesmachine`, data, {
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
		return axiosClient.post(`/ScalesMachine/change-status-scalesmachine`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertScalesMachine: (
		data: {
			uuid: string;
			name: string;
			scalesStationUuid: string;
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ScalesMachine/upsert-scalesmachine`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeScalesStation: (
		data: {
			uuid: string;
			scalesStationUuid: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ScalesMachine/change-scalesstation`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default scalesMachineServices;
