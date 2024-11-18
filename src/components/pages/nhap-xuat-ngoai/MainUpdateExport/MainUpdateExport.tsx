import React, {useState} from 'react';

import {IFormUpdateExport, PropsMainUpdateExport} from './interfaces';
import styles from './MainUpdateExport.module.scss';

import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import {clsx} from 'clsx';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_CUSTOMER,
	TYPE_BATCH,
	TYPE_CUSTOMER,
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import warehouseServices from '~/services/warehouseServices';
import storageServices from '~/services/storageServices';
import DatePicker from '~/components/common/DatePicker';
import TextArea from '~/components/common/Form/components/TextArea';
import batchBillServices from '~/services/batchBillServices';
import moment from 'moment';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import uploadImageService from '~/services/uploadService';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import {IDetailBatchBill} from '../../lenh-can/MainDetailBill/interfaces';
import shipServices from '~/services/shipServices';
import {timeSubmit} from '~/common/funcs/optionConvert';

function MainUpdateExport({}: PropsMainUpdateExport) {
	const router = useRouter();
	const {_id} = router.query;
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<any[]>([]);
	const [form, setForm] = useState<IFormUpdateExport>({
		toUuid: '',
		productTypeUuid: '',
		fromUuid: '',
		specificationsUuid: '',
		warehouseUuid: '',
		weightIntent: 0,
		timeEnd: '',
		timeStart: '',
		description: '',
		transportType: TYPE_TRANSPORT.DUONG_THUY,
		documentId: '',
		batchUuid: '',
		billUuid: '',
		shipUuid: '',
		portname: '',
	});

	const {data: detailBatchBill} = useQuery<IDetailBatchBill>([QUERY_KEY.chi_tiet_nhap_xuat_ngoai, _id], {
		queryFn: () =>
			httpRequest({
				http: batchBillServices.detailBatchbill({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					toUuid: data?.toUu?.uuid,
					productTypeUuid: data?.productTypeUu?.uuid,
					fromUuid: data?.fromUu?.uuid,
					specificationsUuid: data?.specificationsUu?.uuid,
					warehouseUuid: data?.fromUu?.parentUu?.uuid || '',
					weightIntent: convertCoin(data?.batchsUu?.weightIntent),
					timeStart: moment(data.timeStart).format('yyyy-MM-DD'),
					timeEnd: moment(data.timeEnd).format('yyyy-MM-DD'),
					description: data?.description,
					transportType: data?.transportType,
					documentId: data?.documentId || '',
					batchUuid: data?.batchsUu?.uuid,
					billUuid: data?.uuid,
					shipUuid: data?.batchsUu?.shipUu?.uuid || '',
					portname: data?.port || '',
				});
				setImages(
					data?.path?.map((v: any) => ({
						file: null,
						img: v,
						path: `${process.env.NEXT_PUBLIC_IMAGE}/${v}`,
					})) || []
				);
			}
		},
		enabled: !!_id,
	});

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang_xuat], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					partnerUUid: '',
					userUuid: '',
					status: STATUS_CUSTOMER.HOP_TAC,
					typeCus: TYPE_CUSTOMER.KH_XUAT,
					provinceId: '',
					specUuid: '',
				}),
			}),
	});

	const listShip = useQuery([QUERY_KEY.dropdown_tau_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: shipServices.listShip({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					type: [TYPE_PRODUCT.CONG_TY, TYPE_PRODUCT.DUNG_CHUNG],
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
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listWarehouse = useQuery([QUERY_KEY.dropdown_kho_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: warehouseServices.listWarehouse({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.FILTER,
					customerUuid: '',
					timeEnd: null,
					timeStart: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listStorage = useQuery([QUERY_KEY.dropdown_bai, form.warehouseUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					specificationsUuid: '',
					warehouseUuid: form.warehouseUuid,
					productUuid: '',
					qualityUuid: '',
				}),
			}),
		onSuccess(data) {
			if (data && !form.fromUuid) {
				setForm((prev) => ({
					...prev,
					fromUuid: data?.[0]?.uuid || '',
					productTypeUuid: data?.[0]?.productUu?.uuid || '',
					specificationsUuid: data?.[0]?.specificationsUu?.uuid || '',
				}));
			}
		},
		select(data) {
			return data;
		},
		enabled: !!form.warehouseUuid,
	});

	const funcUpdateBatchBillNoScale = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa thành công!',
				http: batchBillServices.upsertBillNoScales({
					batchUuid: form?.batchUuid,
					billUuid: form.billUuid,
					shipUuid: form?.shipUuid,
					shipOutUuid: '',
					transportType: form?.transportType,
					timeIntend: null,
					weightIntent: price(form?.weightIntent),
					customerName: '',
					isBatch: TYPE_BATCH.KHONG_CAN,
					isCreateBatch: 1,
					isSift: TYPE_SIFT.KHONG_CAN_SANG,
					scalesType: TYPE_SCALES.CAN_XUAT,
					fromUuid: form?.fromUuid,
					toUuid: form?.toUuid,
					documentId: form?.documentId,
					description: form.description,
					isPrint: 0,
					specificationsUuid: form?.specificationsUuid,
					productTypeUuid: form.productTypeUuid,
					scaleStationUuid: '',
					storageTemporaryUuid: '',
					portname: form?.portname,
					lstTruckAddUuid: [],
					lstTruckRemoveUuid: [],
					timeEnd: form?.timeEnd ? timeSubmit(new Date(form?.timeEnd!), true) : null,
					timeStart: form?.timeStart ? timeSubmit(new Date(form?.timeStart!)) : null,
					descriptionWs: '',
					paths: body.paths,
				}),
			}),
		onSuccess(data) {
			if (data) {
				router.back();
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		const today = new Date(timeSubmit(new Date())!);
		const timeStart = new Date(form.timeStart!);
		const timeEnd = new Date(form.timeEnd!);
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		if (!form.toUuid) {
			return toastWarn({msg: 'Vui lòng chọn khách hàng xuất!'});
		}
		if (!form.warehouseUuid) {
			return toastWarn({msg: 'Vui lòng chọn kho!'});
		}
		if (!form.fromUuid) {
			return toastWarn({msg: 'Vui lòng chọn bãi!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại hàng!'});
		}
		if (!form.specificationsUuid) {
			return toastWarn({msg: 'Vui lòng chọn quy cách!'});
		}
		if (!form.weightIntent) {
			return toastWarn({msg: 'Vui lòng nhập khối lượng cân'});
		}
		if (tomorrow < timeStart) {
			return toastWarn({msg: 'Ngày bắt đầu không hợp lệ!'});
		}

		if (tomorrow < timeEnd) {
			return toastWarn({msg: 'Ngày kết thúc không hợp lệ!'});
		}

		if (timeStart > timeEnd) {
			return toastWarn({msg: 'Ngày kết thúc phải lớn hơn ngày bắt đầu!'});
		}
		const currentImage = images.filter((item) => !!item.img).map((v) => v.img);

		const files = images?.filter((x: any) => !!x.file)?.map((v: any) => v?.file);

		if (files.length > 0) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadMutilImage(files),
			});
			if (dataImage?.error?.code == 0) {
				return funcUpdateBatchBillNoScale.mutate({
					paths: [...currentImage, ...dataImage.items],
				});
			} else {
				return toastWarn({msg: 'Upload ảnh thất bại!'});
			}
		} else {
			return funcUpdateBatchBillNoScale.mutate({
				paths: currentImage,
			});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcUpdateBatchBillNoScale.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Chỉnh sửa phiếu xuất</h4>
						<p>Điền đầy đủ các thông tin </p>
					</div>
					<div className={styles.right}>
						<Button p_10_24 rounded_2 grey_outline onClick={() => router.back()}>
							Hủy bỏ
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Lưu lại
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>

				<div className={styles.form}>
					<div className='col_2'>
						<div className={styles.item}>
							<label className={styles.label}>
								Hình thức vận chuyển <span style={{color: 'red'}}>*</span>
							</label>
							<div className={styles.group_radio}>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='van_chuyen_bo'
										name='transportType'
										checked={form.transportType == TYPE_TRANSPORT.DUONG_BO}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												transportType: TYPE_TRANSPORT.DUONG_BO,
												shipUuid: '',
											}))
										}
									/>
									<label htmlFor='van_chuyen_bo'>Đường bộ</label>
								</div>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='van_chuyen_thủy'
										name='transportType'
										checked={form.transportType == TYPE_TRANSPORT.DUONG_THUY}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												transportType: TYPE_TRANSPORT.DUONG_THUY,
											}))
										}
									/>
									<label htmlFor='van_chuyen_thủy'>Đường thủy</label>
								</div>
							</div>
						</div>
					</div>

					<div className={clsx('mt')}>
						<Select
							isSearch
							name='toUuid'
							placeholder='Chọn khách hàng xuất'
							value={form?.toUuid}
							label={
								<span>
									Khách hàng xuất<span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listCustomer?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											toUuid: v?.uuid,
											transportType: v?.transportType,
										}))
									}
								/>
							))}
						</Select>
					</div>

					<div className={clsx('mt', 'col_2')}>
						<Select
							isSearch
							name='shipUuid'
							placeholder='Chọn mã tàu'
							value={form?.shipUuid}
							readOnly={form.transportType == TYPE_TRANSPORT.DUONG_BO}
							label={
								<span>
									Tàu <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listShip?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.licensePalate}
									onClick={() =>
										setForm((prev) => ({
											...prev,
											shipUuid: v?.uuid,
										}))
									}
								/>
							))}
						</Select>
						<Input
							name='portname'
							value={form.portname}
							type='text'
							label={<span>Cảng bốc dỡ</span>}
							placeholder='Nhập cảng bốc dỡ'
						/>
					</div>

					<div className={clsx('mt', 'col_2')}>
						<Select
							isSearch
							name='warehouseUuid'
							placeholder='Chọn kho hàng'
							value={form?.warehouseUuid}
							label={
								<span>
									Từ kho hàng<span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listWarehouse?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											warehouseUuid: v?.uuid,
											fromUuid: '',
										}))
									}
								/>
							))}
						</Select>
						<div>
							<Select
								isSearch
								name='fromUuid'
								placeholder='Chọn bãi'
								value={form?.fromUuid}
								label={
									<span>
										Từ bãi<span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listStorage?.data?.map((v: any) => (
									<Option
										key={v?.uuid}
										value={v?.uuid}
										title={v?.name}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												fromUuid: v?.uuid,
												productTypeUuid: v?.productUu?.uuid,
												specificationsUuid: v?.specificationsUu?.uuid,
											}))
										}
									/>
								))}
							</Select>
						</div>
					</div>

					<div className={clsx('mt', 'col_2')}>
						<Select
							isSearch
							name='productTypeUuid'
							placeholder='Chọn loại hàng'
							value={form?.productTypeUuid}
							label={
								<span>
									Loại hàng<span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listProductType?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											productTypeUuid: v?.uuid,
										}))
									}
								/>
							))}
						</Select>
						<div>
							<Select
								isSearch
								name='specificationsUuid'
								placeholder='Chọn quy cách'
								value={form?.specificationsUuid}
								label={
									<span>
										Quy cách<span style={{color: 'red'}}>*</span>
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
					</div>

					<div className={clsx('mt', 'col_2')}>
						<Input
							name='weightIntent'
							value={form.weightIntent || ''}
							type='text'
							isMoney
							unit='KG'
							label={
								<span>
									Khối lượng cân<span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập khối lượng'
						/>
						<div>
							<Input
								name='documentId'
								value={form.documentId || ''}
								type='text'
								max={255}
								label={<span>Số chứng từ</span>}
								placeholder='Nhập số chứng từ'
							/>
						</div>
					</div>
					<div className={clsx('mt', 'col_2')}>
						<Input
							type='date'
							name='timeStart'
							value={form.timeStart || ''}
							isRequired={true}
							blur={true}
							label={
								<span>
									Ngày bắt đầu <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Chọn ngày bắt đầu'
						/>
						<div>
							<Input
								type='date'
								name='timeEnd'
								value={form.timeEnd || ''}
								isRequired={true}
								blur={true}
								label={
									<span>
										Ngày kết thúc <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Chọn ngày kết thúc'
							/>
						</div>
					</div>

					<div className={clsx('mt')}>
						<TextArea name='description' placeholder='Nhập ghi chú' max={5000} blur label={<span>Ghi chú</span>} />
					</div>
					<div className='mt'>
						<div className={styles.image_upload}>Chọn ảnh</div>
						<UploadMultipleFile images={images} setImages={setImages} />
					</div>
				</div>
			</Form>
		</div>
	);
}

export default MainUpdateExport;
