import React, {useState} from 'react';

import {IFormCreateImport, PropsMainCreateImport} from './interfaces';
import styles from './MainCreateImport.module.scss';
import TextArea from '~/components/common/Form/components/TextArea';
import Form, {FormContext, Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import Button from '~/components/common/Button';
import Loading from '~/components/common/Loading';
import {clsx} from 'clsx';
import {useRouter} from 'next/router';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_CUSTOMER,
	TYPE_BATCH,
	TYPE_CUSTOMER,
	TYPE_SCALES,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import customerServices from '~/services/customerServices';
import {httpRequest} from '~/services';
import {useMutation, useQuery} from '@tanstack/react-query';
import {IDetailCustomer} from '../../lenh-can/MainCreateImport/interfaces';
import storageServices from '~/services/storageServices';
import warehouseServices from '~/services/warehouseServices';
import batchBillServices from '~/services/batchBillServices';
import {price} from '~/common/funcs/convertCoin';
import moment from 'moment';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import {toastWarn} from '~/common/funcs/toast';
import uploadImageService from '~/services/uploadService';
import {timeSubmit} from '~/common/funcs/optionConvert';
import shipServices from '~/services/shipServices';

function MainCreateImport({}: PropsMainCreateImport) {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<any[]>([]);

	const [form, setForm] = useState<IFormCreateImport>({
		weightIntent: 0,
		specificationsUuid: '',
		warehouseUuid: '',
		productTypeUuid: '',
		description: '',
		documentId: '',
		fromUuid: '',
		toUuid: '',
		transportType: TYPE_TRANSPORT.DUONG_THUY,
		timeStart: null,
		timeEnd: null,
		portname: '',
		shipUuid: '',
	});

	const {data: detailCustomer} = useQuery<IDetailCustomer>([QUERY_KEY.chi_tiet_khach_hang, form.fromUuid], {
		queryFn: () =>
			httpRequest({
				http: customerServices.getDetail({
					uuid: form.fromUuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				const listspecUu: any[] = [...new Map(data?.customerSpec?.map((v: any) => [v?.specUu?.uuid, v])).values()];
				const listProductTypeUu: any[] = [...new Map(data?.customerSpec?.map((v: any) => [v?.productTypeUu?.uuid, v])).values()];

				setForm((prev) => ({
					...prev,
					specificationsUuid: listspecUu?.[0]?.specUu?.uuid || '',
					productTypeUuid: listProductTypeUu?.[0]?.productTypeUu?.uuid || '',
				}));
			}
		},
		select(data) {
			return data;
		},
		enabled: !!form.fromUuid,
	});

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang], {
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
					typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
					provinceId: '',
					specUuid: '',
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
					typeFind: CONFIG_TYPE_FIND.TABLE,
					customerUuid: '',
					timeEnd: null,
					timeStart: null,
				}),
			}),
		select(data) {
			return data;
		},
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

	const listStorage = useQuery([QUERY_KEY.dropdown_bai, form.specificationsUuid, form.productTypeUuid, form.warehouseUuid], {
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
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					qualityUuid: '',
					specificationsUuid: form.specificationsUuid,
					warehouseUuid: form.warehouseUuid,
					productUuid: form.productTypeUuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm((prev) => ({
					...prev,
					toUuid: data?.[0]?.uuid || '',
				}));
			}
		},
		select(data) {
			return data;
		},
		enabled: !!form.warehouseUuid && !!form.productTypeUuid && !!form.specificationsUuid,
	});

	const funcCreatBill = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới thành công!',
				http: batchBillServices.upsertBillNoScales({
					batchUuid: '',
					billUuid: '',
					shipOutUuid: '',
					customerName: '',
					isCreateBatch: 1,
					shipUuid: form.shipUuid,
					timeIntend: null,
					weightIntent: price(form?.weightIntent),
					isBatch: TYPE_BATCH.KHONG_CAN,
					isSift: TYPE_SIFT.KHONG_CAN_SANG,
					scalesType: TYPE_SCALES.CAN_NHAP,
					specificationsUuid: form.specificationsUuid,
					productTypeUuid: form.productTypeUuid,
					documentId: form.documentId,
					description: form.description,
					fromUuid: form.fromUuid,
					toUuid: form?.toUuid,
					isPrint: 0,
					transportType: form?.transportType,
					lstTruckAddUuid: [],
					lstTruckRemoveUuid: [],
					scaleStationUuid: '',
					portname: form.portname,
					descriptionWs: '',
					paths: body.paths,
					timeEnd: form?.timeEnd ? timeSubmit(new Date(form?.timeEnd!), true) : null,
					timeStart: form?.timeStart ? timeSubmit(new Date(form?.timeStart!)) : null,
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

		if (form.transportType == TYPE_TRANSPORT.DUONG_THUY && !form.shipUuid) {
			return toastWarn({msg: 'Vui lòng chọn tàu!'});
		}
		if (!form.fromUuid) {
			return toastWarn({msg: 'Vui lòng chọn nhà cũng cấp!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại hàng!'});
		}
		if (!form.specificationsUuid) {
			return toastWarn({msg: 'Vui lòng chọn quy cách!'});
		}
		if (!form.warehouseUuid) {
			return toastWarn({msg: 'Vui lòng chọn kho chính!'});
		}
		if (!form.toUuid) {
			return toastWarn({msg: 'Vui lòng chọn bãi!'});
		}

		if (tomorrow < timeStart) {
			return toastWarn({msg: 'Ngày bắt đầu không hợp lệ!'});
		}

		if (tomorrow < timeEnd) {
			return toastWarn({msg: 'Ngày kết thúc không hợp lệ!'});
		}

		if (timeStart > timeEnd) {
			return toastWarn({msg: 'Ngày bắt đầu không được nhỏ hơn!'});
		}

		const imgs = images?.map((v: any) => v?.file);

		if (imgs.length > 0) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadMutilImage(imgs),
			});
			if (dataImage?.error?.code == 0) {
				return funcCreatBill.mutate({
					paths: dataImage.items,
				});
			} else {
				return toastWarn({msg: 'Upload ảnh thất bại!'});
			}
		} else {
			return funcCreatBill.mutate({
				...form,
				paths: [],
			});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcCreatBill.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Thêm phiếu nhập hàng</h4>
						<p>Điền đầy đủ các thông tin phiếu nhập hàng</p>
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
					<div className={clsx('mt', 'col_2')}>
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

							{/* <div className={styles.item}>
								<label className={styles.label}>
									Phân loại <span style={{color: 'red'}}>*</span>
								</label>
								<div className={styles.group_radio}>
									<div className={styles.item_radio}>
										<input
											type='radio'
											id='phan_loai_da_sang'
											name='isSift'
											checked={form.isSift == TYPE_SIFT.CAN_SANG}
											onChange={() =>
												setForm((prev) => ({
													...prev,
													isSift: TYPE_SIFT.CAN_SANG,
												}))
											}
										/>
										<label htmlFor='phan_loai_da_sang'>Cần sàng</label>
									</div>
									<div className={styles.item_radio}>
										<input
											type='radio'
											id='phan_loai_chua_sang'
											name='isSift'
											checked={form.isSift == TYPE_SIFT.KHONG_CAN_SANG}
											onChange={() =>
												setForm((prev) => ({
													...prev,
													isSift: TYPE_SIFT.KHONG_CAN_SANG,
												}))
											}
										/>
										<label htmlFor='phan_loai_chua_sang'>Không cần sàng</label>
									</div>
								</div>
							</div> */}
						</div>
					</div>
					<div className={clsx('mt')}>
						<Select
							isSearch
							name='fromUuid'
							placeholder='Chọn nhà cung cấp'
							value={form?.fromUuid}
							label={
								<span>
									Nhà cung cấp <span style={{color: 'red'}}>*</span>
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
											fromUuid: v?.uuid,
											transportType: v?.transportType,
											isSift: v?.isSift,
											productTypeUuid: '',
											specificationsUuid: '',
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
							placeholder='Chọn tàu'
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
							name='productTypeUuid'
							placeholder='Chọn loại hàng'
							value={form?.productTypeUuid}
							label={
								<span>
									Loại hàng<span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{[...new Map(detailCustomer?.customerSpec?.map((v: any) => [v?.productTypeUu?.uuid, v])).values()]?.map(
								(v: any) => (
									<Option
										key={v?.uuid}
										value={v?.productTypeUu?.uuid}
										title={v?.productTypeUu?.name}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												productTypeUuid: v?.productTypeUu?.uuid,
												toUuid: '',
											}))
										}
									/>
								)
							)}
						</Select>
						<div>
							<Select
								isSearch
								name='specificationsUuid'
								placeholder='Chọn quy cách'
								value={form?.specificationsUuid}
								label={
									<span>
										Quy cách <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{[...new Map(detailCustomer?.customerSpec?.map((v: any) => [v?.specUu?.uuid, v])).values()]?.map(
									(v: any) => (
										<Option
											key={v?.specUu?.uuid}
											value={v?.specUu?.uuid}
											title={v?.specUu?.name}
											onClick={() =>
												setForm((prev: any) => ({
													...prev,
													specificationsUuid: v?.specUu?.uuid,
													toUuid: '',
												}))
											}
										/>
									)
								)}
							</Select>
						</div>
					</div>
					<div className={clsx('mt', 'col_2')}>
						<Select
							isSearch
							name='warehouseUuid'
							placeholder='Chọn kho hàng chính'
							value={form?.warehouseUuid}
							label={
								<span>
									Kho hàng chính <span style={{color: 'red'}}>*</span>
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
											toUuid: '',
											// scaleStationUuid: v?.scaleStationUu?.uuid || '',
										}))
									}
								/>
							))}
						</Select>
						<div>
							<Select
								isSearch
								name='toUuid'
								placeholder='Chọn bãi'
								value={form?.toUuid}
								readOnly={!form.warehouseUuid || !form.productTypeUuid || !form.specificationsUuid}
								label={
									<span>
										Bãi <span style={{color: 'red'}}>*</span>
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
												toUuid: v?.uuid,
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
									Khối lượng hàng <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập khối lượng hàng'
						/>

						<div>
							<Input
								name='documentId'
								value={form.documentId || ''}
								max={255}
								type='text'
								label={<span>Số chứng từ</span>}
								placeholder='Nhập số chứng từ'
							/>
						</div>
					</div>
					<div className={clsx('mt', 'col_2')}>
						{/* <DatePicker
							label={
								<span>
									Ngày bắt đầu <span style={{color: 'red'}}>*</span>
								</span>
							}
							value={form.timeStart}
							onSetValue={(date) =>
								setForm((prev: any) => ({
									...prev,
									timeStart: date,
								}))
							}
							placeholder='Chọn ngày bắt đầu'
						/> */}

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
							{/* <DatePicker
								label={
									<span>
										Ngày kết thúc <span style={{color: 'red'}}>*</span>
									</span>
								}
								value={form.timeEnd}
								onSetValue={(date) =>
									setForm((prev: any) => ({
										...prev,
										timeEnd: date,
									}))
								}
								placeholder='Chọn ngày kết thúc'
							/> */}
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

export default MainCreateImport;
