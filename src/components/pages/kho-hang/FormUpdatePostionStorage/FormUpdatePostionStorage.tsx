import React, {useState} from 'react';

import {IFormUpdatePostionStorage, PropsFormUpdatePostionStorage} from './interfaces';
import styles from './FormUpdatePostionStorage.module.scss';
import Form, {FormContext} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_PRODUCT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import Select, {Option} from '~/components/common/Select';
import storageServices from '~/services/storageServices';
import Loading from '~/components/common/Loading';

function FormUpdatePostionStorage({draggedElements, onClose}: PropsFormUpdatePostionStorage) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [form, setForm] = useState<IFormUpdatePostionStorage>({
		storageUuid: '',
		name: '',
		productUuid: '',
		qualityUuid: '',
		specificationsUuid: '',
		description: '',
	});

	const listStorage = useQuery([QUERY_KEY.dropdown_kho_hang, _id], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 20,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					warehouseUuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	useQuery([QUERY_KEY.chi_tiet_kho_hang, form.storageUuid], {
		queryFn: () =>
			httpRequest({
				http: storageServices.detailStorage({
					uuid: form.storageUuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm((prev) => ({
					...prev,
					name: data?.name,
					productUuid: data?.productUu?.uuid,
					qualityUuid: data?.qualityUu?.uuid,
					specificationsUuid: data?.specificationsUu?.uuid,
					description: data?.description,
				}));
			}
		},
		enabled: !!form.storageUuid,
	});

	const listProduct = useQuery([QUERY_KEY.dropdown_loai_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 20,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					type: [TYPE_PRODUCT.CONG_TY, TYPE_PRODUCT.DUNG_CHUNG],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listQuality = useQuery([QUERY_KEY.dropdown_chat_luong], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listQuality({
					page: 1,
					pageSize: 20,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 20,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const fucnCreateStorage = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật vị trí kho hàng thành công!',
				http: storageServices.upsertStorage({
					uuid: form.storageUuid,
					warehouseUuid: _id as string,
					name: form.name,
					productUuid: form.productUuid,
					qualityUuid: form.qualityUuid,
					specificationsUuid: form.specificationsUuid,
					locationMap: JSON.stringify(draggedElements),
					description: form.description,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					name: '',
					storageUuid: '',
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					description: '',
				});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_kho_hang, _id]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		return fucnCreateStorage.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnCreateStorage.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.wrapper}>
					<h4>Cập nhật vị trí kho hàng</h4>
					<div className={clsx('mt', styles.main_form)}>
						<div className={clsx('mt')}>
							<Select
								isSearch
								name='storageUuid'
								placeholder='Chọn kho hàng'
								value={form?.storageUuid}
								onChange={(e: any) =>
									setForm((prev: any) => ({
										...prev,
										storageUuid: e.target.value,
									}))
								}
								label={
									<span>
										Chọn kho hàng <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listStorage?.data?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
								))}
							</Select>
							<Select
								isSearch
								name='productUuid'
								placeholder='Chọn loại gỗ'
								value={form?.productUuid}
								readOnly={true}
								onChange={(e: any) =>
									setForm((prev: any) => ({
										...prev,
										productUuid: e.target.value,
									}))
								}
								label={
									<span>
										Thuộc loại gỗ <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listProduct?.data?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
								))}
							</Select>
							<Select
								isSearch
								name='qualityUuid'
								placeholder='Chọn quốc gia'
								value={form?.qualityUuid}
								readOnly={true}
								onChange={(e: any) =>
									setForm((prev: any) => ({
										...prev,
										qualityUuid: e.target.value,
									}))
								}
								label={
									<span>
										Thuộc quốc gia <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listQuality?.data?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
								))}
							</Select>
							<Select
								isSearch
								name='specificationsUuid'
								placeholder='Chọn quy cách'
								value={form?.specificationsUuid}
								readOnly={true}
								onChange={(e: any) =>
									setForm((prev: any) => ({
										...prev,
										specificationsUuid: e.target.value,
									}))
								}
								label={
									<span>
										Thuộc quy cách <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listSpecification?.data?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
								))}
							</Select>
						</div>
						<div className={clsx('mt')}>
							<TextArea max={5000} placeholder='Thêm mô tả' name='description' label={<span>Mô tả</span>} blur={true} />
						</div>
					</div>

					<div className={styles.btn}>
						<div>
							<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<FormContext.Consumer>
								{({isDone}) => (
									<Button
										disable={!isDone || !form.productUuid || !form.qualityUuid || !form.specificationsUuid}
										p_10_24
										rounded_2
										primary
									>
										Cập nhật
									</Button>
								)}
							</FormContext.Consumer>
						</div>
					</div>
				</div>
			</Form>
			<div className={styles.close} onClick={onClose}>
				<IoClose />
			</div>
		</div>
	);
}

export default FormUpdatePostionStorage;
