import {getKeyCert} from '~/common/funcs/optionConvert';
import axiosClient from '.';

const uploadImageService = {
	uploadMutilImage: (files: any[]) => {
		const dataFile = new FormData();

		dataFile.append('Time', getKeyCert().time);
		dataFile.append('KeyCert', getKeyCert().keyCert);
		dataFile.append('Type', '2');

		files.forEach((file) => {
			dataFile.append(`ImageFiles`, file);
		});

		return axiosClient.post(`/Upload/upload-images`, dataFile, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'text/plain',
			},
		});
	},

	uploadSingleImage: (file: any) => {
		const dataFile = new FormData();

		dataFile.append('Time', getKeyCert().time);
		dataFile.append('KeyCert', getKeyCert().keyCert);
		dataFile.append('Type', '2');

		dataFile.append('ImageFiles', file);

		return axiosClient.post(`Upload/upload-image`, dataFile, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'text/plain',
			},
		});
	},

	uploadMutilImagePDF: (files: any[]) => {
		const dataFile = new FormData();

		dataFile.append('Time', getKeyCert().time);
		dataFile.append('KeyCert', getKeyCert().keyCert);
		files?.forEach((file) => {
			const isPdf = file?.type === 'application/pdf';

			// dataFile.append('Type', isPdf ? '4' : '2');
			dataFile.append('Type', '4');
			dataFile.append('ImageFiles', file);
		});

		return axiosClient.post(`Upload/upload-images`, dataFile, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'text/plain',
			},
		});
	},
};

export default uploadImageService;
