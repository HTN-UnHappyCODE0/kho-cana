import axiosClient from '.';

const dashbroadServices = {
	countBillWeight: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Dashbroad/count-bill-weight`, data, {
			cancelToken: tokenAxios,
		});
	},
	countBillKcs: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Dashbroad/count-bill-kcs`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default dashbroadServices;
