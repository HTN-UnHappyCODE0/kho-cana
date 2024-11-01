import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const batchBillServices = {
	getListBill: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			isBatch: number | null;
			isCreateBatch: number | null;
			status: number[];
			state?: number[];
			timeStart: string | null;
			timeEnd: string | null;
			specificationsUuid: string;
			warehouseUuid: string;
			customerUuid: string;
			productTypeUuid: string;
			qualityUuid: string;
			transportType: number | null;
			shipUuid?: string;
			typeCheckDay: number | 0;
			scalesStationUuid: string | null;
			storageUuid: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/get-list-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertBatchBill: (
		data: {
			batchUuid: string;
			shipUuid: string;
			shipOutUuid: string;
			transportType: number | null;
			timeIntend: string | null;
			weightIntent: number | null;
			customerName: string;
			billUuid: string;
			isBatch: number | null;
			isCreateBatch: number | null;
			isSift: number | null;
			scalesType: number | null;
			fromUuid: string;
			toUuid: string;
			documentId: string;
			description: string;
			isPrint: number | null;
			specificationsUuid: string;
			productTypeUuid: string;
			lstTruckAddUuid: string[];
			lstTruckRemoveUuid: string[];
			reason?: string;
			scaleStationUuid: string;
			portname: string;
			storageTemporaryUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/upsert-batchbill`, data, {
			cancelToken: tokenAxios,
		});
	},
	deleteBatchBill: (data: {uuid: string; description: string}, tokenAxios?: any) => {
		return axiosClient.post(`/BatchBill/delete-batchbill`, data, {cancelToken: tokenAxios});
	},
	startBatchbill: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/start-batchbill`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailBatchbill: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/detail-batchbill`, data, {
			cancelToken: tokenAxios,
		});
	},
	stopBatchbill: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/scale-done-batchbill`, data, {
			cancelToken: tokenAxios,
		});
	},
	QLKConfirmBatchbill: (
		data: {
			uuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/qlk-confirm-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
	KTKConfirmBatchbill: (
		data: {
			uuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/ktk-confirm-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
	QLKRejectBatchbill: (
		data: {
			uuid: string[];
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/reject-bill-to-qlk`, data, {
			cancelToken: tokenAxios,
		});
	},
	updatePort: (
		data: {
			uuid: string[];
			portname: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/update-port`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashbroadBillIn: (
		data: {
			partnerUuid: string;
			companyUuid: string;
			typeFindDay: number;
			timeStart: string;
			timeEnd: string;
			isShowBDMT: number;
			storageUuid: string;
			customerUuid: string;
			warehouseUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/dashbroad-bill-in`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashbroadBillOut: (
		data: {
			partnerUuid: string;
			companyUuid: string;
			typeFindDay: number;
			timeStart: string;
			timeEnd: string;
			isShowBDMT: number;
			storageUuid: string;
			customerUuid: string;
			warehouseUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/dashbroad-bill-out`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashbroadBillService: (
		data: {
			partnerUuid: string;
			companyUuid: string;
			typeFindDay: number;
			timeStart: string;
			timeEnd: string;
			isShowBDMT: number;
			storageUuid: string;
			customerUuid: string;
			warehouseUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/dashbroad-bill-service`, data, {
			cancelToken: tokenAxios,
		});
	},
	ViewActionAudit: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/view-action-audit`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			pageSize?: number;
			page?: number | null;
			keyword: string | null;
			isDescending: number;
			typeFind: number;
			isPaging: number;
			scalesType: number[];
			isBatch: number | null;
			transportType: number | null;
			isCreateBatch: number | null;
			status: number[];
			state: number[];
			timeStart: string | null;
			timeEnd: string | null;
			warehouseUuid: string;
			qualityUuid: string;
			specificationsUuid: string;
			productTypeUuid: string;
			customerUuid: string;
			storageUuid: string;
			shipUuid: string;
			typeCheckDay: number;
			scalesStationUuid: string;
			documentId: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/export-excel-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
	reupDryness: (
		data: {
			billUuid: string[];
			drynessNew: number;
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/reup-dryness-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default batchBillServices;
