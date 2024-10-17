import React, {useState} from 'react';

import {IFormUpdateImport, PropsMainUpdateImport} from './interfaces';
import styles from './MainUpdateImport.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import clsx from 'clsx';
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
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import warehouseServices from '~/services/warehouseServices';
import storageServices from '~/services/storageServices';
import DatePicker from '~/components/common/DatePicker';
import TextArea from '~/components/common/Form/components/TextArea';
import truckServices from '~/services/truckServices';
import ButtonSelectMany from '~/components/common/ButtonSelectMany';
import {useRouter} from 'next/router';
import moment from 'moment';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import {timeSubmit} from '~/common/funcs/optionConvert';
import batchBillServices from '~/services/batchBillServices';
import {IDetailBatchBill} from '../MainDetailBill/interfaces';
import priceTagServices from '~/services/priceTagServices';
import shipServices from '~/services/shipServices';
import scalesStationServices from '~/services/scalesStationServices';
import Popup from '~/components/common/Popup';
import FormReasonUpdateBill from '../FormReasonUpdateBill';

function MainUpdateImport({}: PropsMainUpdateImport) {
	const router = useRouter();

	const {_id} = router.query;

	const [listTruckChecked, setListTruckChecked] = useState<any[]>([]);
	const [listTruckBatchBill, setListTruckBatchBill] = useState<any[]>([]);
	const [openWarning, setOpenWarning] = useState<boolean>(false);

	const [form, setForm] = useState<IFormUpdateImport>({
		batchUuid: '',
		billUuid: '',
		shipUuid: '',
		transportType: TYPE_TRANSPORT.DUONG_THUY,
		timeIntend: '',
		weightIntent: 0,
		isSift: TYPE_SIFT.KHONG_CAN_SANG,
		specificationsUuid: '',
		warehouseUuid: '',
		productTypeUuid: '',
		documentId: '',
		description: '',
		fromUuid: '',
		toUuid: '',
		isPrint: 0,
		code: '',
		reason: '',
		scaleStationUuid: '',
		portname: '',
	});

	const {data: detailBatchBill} = useQuery<IDetailBatchBill>([QUERY_KEY.chi_tiet_lenh_can, _id], {
		queryFn: () =>
			httpRequest({
				http: batchBillServices.detailBatchbill({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					batchUuid: data?.batchsUu?.uuid,
					billUuid: data?.uuid,
					shipUuid: data?.batchsUu?.shipUu?.uuid || '',
					transportType: data?.transportType,
					timeIntend: data?.batchsUu?.timeIntend,
					weightIntent: convertCoin(data?.batchsUu?.weightIntent),
					isSift: data?.isSift,
					specificationsUuid: data?.specificationsUu?.uuid,
					warehouseUuid: data?.toUu?.parentUu?.uuid || '',
					productTypeUuid: data?.productTypeUu?.uuid,
					documentId: data?.documentId || '',
					description: data?.description,
					fromUuid: data?.fromUu?.uuid,
					toUuid: data?.toUu?.uuid,
					isPrint: data?.isPrint,
					code: data?.code,
					reason: '',
					scaleStationUuid: data?.scalesStationUu?.uuid || '',
					portname: data?.port || '',
				});

				// SET LIST TRUCK
				setListTruckChecked(
					data?.lstTruck?.map((v: any) => ({
						uuid: v?.uuid,
						name: v?.licensePalate,
						code: v?.code,
					}))
				);
				setListTruckBatchBill(
					data?.lstTruck?.map((v: any) => ({
						uuid: v?.uuid,
						name: v?.licensePalate,
						code: v?.code,
					}))
				);
			}
		},
		enabled: !!_id,
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

	const listPriceTagInfo = useQuery([QUERY_KEY.dropdown_loai_go_quy_cach, form.fromUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: priceTagServices.listPriceTag({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: CONFIG_STATUS.HOAT_DONG,
					state: 1,
					priceTagUuid: '',
					customerUuid: form.fromUuid,
					productTypeUuid: '',
					specUuid: '',
				}),
			}),
		onSuccess(data) {
			if (data && !form.productTypeUuid && !form.specificationsUuid) {
				const listspecUu: any[] = [...new Map(data?.map((v: any) => [v?.specUu?.uuid, v])).values()];
				const listProductTypeUu: any[] = [...new Map(data?.map((v: any) => [v?.productTypeUu?.uuid, v])).values()];

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
			if (data && !form.toUuid) {
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

	const listScaleStation = useQuery([QUERY_KEY.dropdown_tram_can], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: scalesStationServices.listScalesStation({
					page: 1,
					pageSize: 50,
					keyword: '',
					companyUuid: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					isPaging: CONFIG_PAGING.NO_PAGING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listTruck = useQuery([QUERY_KEY.dropdown_xe_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: truckServices.listTruck({
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

	const funcUpdateBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa lệnh cân thành công!',
				http: batchBillServices.upsertBatchBill({
					batchUuid: form?.batchUuid,
					billUuid: form.billUuid,
					shipOutUuid: '',
					customerName: '',
					isCreateBatch: 1,
					shipUuid: form?.shipUuid,
					timeIntend: form?.timeIntend ? moment(form?.timeIntend!).format('YYYY-MM-DD') : null,
					weightIntent: price(form?.weightIntent),
					isBatch: TYPE_BATCH.CAN_LO,
					isSift: form.isSift != null ? form.isSift : TYPE_SIFT.KHONG_CAN_SANG,
					scalesType: TYPE_SCALES.CAN_NHAP,
					specificationsUuid: form.specificationsUuid,
					productTypeUuid: form.productTypeUuid,
					documentId: form.documentId,
					description: form.description,
					fromUuid: form.fromUuid,
					toUuid: form?.toUuid,
					isPrint: form.isPrint,
					transportType: form?.transportType,
					scaleStationUuid: form?.scaleStationUuid,
					lstTruckAddUuid: listTruckChecked
						.filter((v) => !listTruckBatchBill.some((x) => v.uuid === x.uuid))
						?.map((item) => item.uuid),

					lstTruckRemoveUuid: listTruckBatchBill
						.filter((v) => !listTruckChecked.some((x) => v.uuid === x.uuid))
						?.map((item) => item.uuid),
					reason: form.reason,
					portname: form.portname,
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
		if (form.transportType == TYPE_TRANSPORT.DUONG_THUY && !form.shipUuid) {
			return toastWarn({msg: 'Vui lòng chọn tàu!'});
		}
		if (!form.fromUuid) {
			return toastWarn({msg: 'Vui lòng chọn khách hàng!'});
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
		if (!form.scaleStationUuid) {
			return toastWarn({msg: 'Vui lòng chọn trạm cân!'});
		}
		if (listTruckChecked.length == 0) {
			return toastWarn({msg: 'Vui lòng chọn xe hàng!'});
		}
		if (!form.timeIntend) {
			return toastWarn({msg: 'Vui lòng chọn ngày dự kiến!'});
		}
		if (form.timeIntend) {
			const today = new Date(timeSubmit(new Date())!);
			const timeIntend = new Date(form.timeIntend);

			if (today > timeIntend) {
				return toastWarn({msg: 'Ngày dự kiến không hợp lệ!'});
			}
		}

		if (
			form.toUuid != detailBatchBill?.toUu?.uuid ||
			form.fromUuid != detailBatchBill?.fromUu?.uuid ||
			form.productTypeUuid != detailBatchBill?.productTypeUu?.uuid ||
			form.specificationsUuid != detailBatchBill?.specificationsUu?.uuid
		) {
			return setOpenWarning(true);
		} else {
			return funcUpdateBatchBill.mutate();
		}
	};

	const handleSubmitReason = async () => {
		if (!form.reason) {
			return toastWarn({msg: 'Vui lòng nhập lý do thay đổi!'});
		}

		return funcUpdateBatchBill.mutate();
	};
	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateBatchBill.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Chỉnh sửa lệnh cân nhập dự kiến #{form.code}</h4>
						<p>Điền đầy đủ các thông tin lệnh cân nhập dự kiến</p>
					</div>
					<div className={styles.right}>
						<Button p_10_24 rounded_2 grey_outline onClick={() => router.back()}>
							Hủy bỏ
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Cập nhật
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>
				<div className={styles.form}>
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
										setForm((prev) => ({
											...prev,
											fromUuid: v?.uuid,
											transportType: v?.transportType,
											isSift: v?.isSift,
											productTypeUuid: '',
											specificationsUuid: '',
											shipUuid: '',
										}))
									}
								/>
							))}
						</Select>
					</div>
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

							<div className={styles.item}>
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
							</div>
						</div>
						<div className={styles.item}>
							<label className={styles.label}>
								In phiếu <span style={{color: 'red'}}>*</span>
							</label>
							<div className={styles.group_radio}>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='0_ban'
										name='isPrint'
										checked={form.isPrint == 0}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												isPrint: 0,
											}))
										}
									/>
									<label htmlFor='0_ban'>Không in</label>
								</div>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='1_ban'
										name='isPrint'
										checked={form.isPrint == 1}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												isPrint: 1,
											}))
										}
									/>
									<label htmlFor='1_ban'>1 bản</label>
								</div>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='2_ban'
										name='isPrint'
										checked={form.isPrint == 2}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												isPrint: 2,
											}))
										}
									/>
									<label htmlFor='2_ban'>2 bản</label>
								</div>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='3_ban'
										name='isPrint'
										checked={form.isPrint == 3}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												isPrint: 3,
											}))
										}
									/>
									<label htmlFor='3_ban'>3 bản</label>
								</div>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='4_ban'
										name='isPrint'
										checked={form.isPrint == 4}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												isPrint: 4,
											}))
										}
									/>
									<label htmlFor='4_ban'>4 bản</label>
								</div>
							</div>
						</div>
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
							{[...new Map(listPriceTagInfo?.data?.map((v: any) => [v?.productTypeUu?.uuid, v])).values()]?.map((v: any) => (
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
										Quy cách <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{[...new Map(listPriceTagInfo?.data?.map((v: any) => [v?.specUu?.uuid, v])).values()]?.map((v: any) => (
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
								))}
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
											scaleStationUuid: v?.scaleStationUu?.uuid || '',
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
						<Select
							isSearch
							name='scaleStationUuid'
							placeholder='Chọn trạm cân'
							value={form?.scaleStationUuid}
							label={
								<span>
									Trạm cân <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listScaleStation?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											scaleStationUuid: v?.uuid,
										}))
									}
								/>
							))}
						</Select>
						<Input
							name='weightIntent'
							value={form.weightIntent || ''}
							type='text'
							isMoney
							unit='TẤN'
							label={<span>Khối lượng dự kiến</span>}
							placeholder='Nhập khối lượng dự kiến'
						/>
					</div>
					<div className={clsx('mt', 'col_2')}>
						<DatePicker
							label={
								<span>
									Ngày dự kiến <span style={{color: 'red'}}>*</span>
								</span>
							}
							value={form.timeIntend}
							onSetValue={(date) =>
								setForm((prev: any) => ({
									...prev,
									timeIntend: date,
								}))
							}
							placeholder='Chọn ngày dự kiến'
						/>
						<Input
							name='documentId'
							value={form.documentId || ''}
							max={255}
							type='text'
							label={<span>Số chứng từ</span>}
							placeholder='Nhập số chứng từ'
						/>
					</div>
					<div className={clsx('mt')}>
						<ButtonSelectMany
							label={
								<span>
									Xe hàng <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Tìm và thêm xe hàng'
							title='Thêm xe hàng'
							description='Thêm và lựa chọn xe hàng'
							dataList={
								listTruck?.data?.map((v: any) => ({
									uuid: v?.uuid,
									name: v?.licensePalate,
									code: v?.code,
								})) || []
							}
							dataChecked={listTruckChecked}
							setDataChecked={setListTruckChecked}
						/>
					</div>
					<div className={clsx('mt')}>
						<TextArea name='description' placeholder='Nhập ghi chú' max={5000} blur label={<span>Ghi chú</span>} />
					</div>
				</div>
				<Popup
					open={openWarning}
					onClose={() => {
						setOpenWarning(false);
						setForm((prev) => ({
							...prev,
							reason: '',
						}));
					}}
				>
					<FormReasonUpdateBill
						onSubmit={handleSubmitReason}
						onClose={() => {
							setOpenWarning(false);
							setForm((prev) => ({
								...prev,
								reason: '',
							}));
						}}
					/>
				</Popup>
			</Form>
		</div>
	);
}

export default MainUpdateImport;
