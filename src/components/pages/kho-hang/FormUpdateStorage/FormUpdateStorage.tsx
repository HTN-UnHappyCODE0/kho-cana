import React, {useState} from 'react';

import {IFormUpdateStorage, PropsFormUpdateStorage} from './interfaces';
import styles from './FormUpdateStorage.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_PRODUCT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Select, {Option} from '~/components/common/Select';
import storageServices from '~/services/storageServices';
import Loading from '~/components/common/Loading';
import wareServices from '~/services/wareServices';

function FormUpdateStorage({onClose}: PropsFormUpdateStorage) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id, _uuidStorage} = router.query;

	const [form, setForm] = useState<IFormUpdateStorage>({
		name: '',
		warehouseUuid: '',
		productUuid: '',
		qualityUuid: '',
		specificationsUuid: '',
		locationMap: '',
		description: '',
	});

	useQuery([QUERY_KEY.chi_tiet_kho_hang, _uuidStorage], {
		queryFn: () =>
			httpRequest({
				http: storageServices.detailStorage({
					uuid: _uuidStorage as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					name: data?.name,
					warehouseUuid: data?.warehouseUu?.uuid,
					productUuid: data?.productUu?.uuid,
					qualityUuid: data?.qualityUu?.uuid,
					specificationsUuid: data?.specificationsUu?.uuid,
					locationMap: data?.locationMap,
					description: data?.description,
				});
			}
		},
		enabled: !!_uuidStorage,
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

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach, form.qualityUuid, form?.productUuid], {
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
					qualityUuid: form?.qualityUuid,
					productTypeUuid: form?.productUuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.qualityUuid && !!form?.productUuid,
	});

	const fucnCreateStorage = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa kho hàng thành công!',
				http: storageServices.upsertStorage({
					uuid: _uuidStorage as string,
					warehouseUuid: (_id as string) || form.warehouseUuid,
					name: form.name,
					productUuid: form.productUuid,
					qualityUuid: form.qualityUuid,
					specificationsUuid: form.specificationsUuid,
					locationMap: form.locationMap,
					description: form.description,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					name: '',
					warehouseUuid: '',
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					description: '',
					locationMap: '',
				});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_kho_hang, _id]);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_bai, _id]);
				queryClient.invalidateQueries([QUERY_KEY.table_kho_hang, _id]);
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
			<h4>Chỉnh sửa kho hàng</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Input
					name='name'
					value={form.name || ''}
					isRequired
					min={5}
					max={255}
					type='text'
					blur={true}
					placeholder='Nhập tên kho hàng'
					label={
						<span>
							Kho hàng <span style={{color: 'red'}}> *</span>
						</span>
					}
				/>

				<div className={clsx('mt')}>
					<Select
						isSearch
						readOnly={true}
						name='productUuid'
						placeholder='Chọn loại hàng'
						value={form?.productUuid}
						label={
							<span>
								Thuộc loại hàng <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listProduct?.data?.map((v: any) => (
							<Option
								key={v?.uuid}
								value={v?.uuid}
								title={v?.name}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										productUuid: v?.uuid,
										specificationsUuid: '',
									}))
								}
							/>
						))}
					</Select>
					<Select
						isSearch
						readOnly={true}
						name='qualityUuid'
						placeholder='Chọn quốc gia'
						value={form?.qualityUuid}
						label={
							<span>
								Thuộc quốc gia <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listQuality?.data?.map((v: any) => (
							<Option
								key={v?.uuid}
								value={v?.uuid}
								title={v?.name}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										qualityUuid: v?.uuid,
										specificationsUuid: '',
									}))
								}
							/>
						))}
					</Select>
					<Select
						isSearch
						readOnly={true}
						name='specificationsUuid'
						placeholder='Chọn quy cách'
						value={form?.specificationsUuid}
						label={
							<span>
								Thuộc quy cách <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listSpecification?.data?.map((v: any) => (
							<Option
								key={v?.uuid}
								value={v?.uuid}
								title={v?.name}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										specificationsUuid: v?.uuid,
									}))
								}
							/>
						))}
					</Select>
				</div>
				<div className={clsx('mt')}>
					<TextArea max={5000} placeholder='Thêm mô tả' name='description' label={<span>Mô tả</span>} blur={true} />
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

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default FormUpdateStorage;
