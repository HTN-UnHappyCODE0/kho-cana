import React, {useState} from 'react';

import {IFormUpdateExport, PropsMainUpdateExport} from './interfaces';
import styles from './MainUpdateExport.module.scss';
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
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
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
import shipServices from '~/services/shipServices';
import scalesStationServices from '~/services/scalesStationServices';

function MainUpdateExport({}: PropsMainUpdateExport) {
	const router = useRouter();

	const {_id} = router.query;

	const [listTruckChecked, setListTruckChecked] = useState<any[]>([]);
	const [listTruckBatchBill, setListTruckBatchBill] = useState<any[]>([]);

	const [form, setForm] = useState<IFormUpdateExport>({
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
	});

	useQuery<IDetailBatchBill>([QUERY_KEY.chi_tiet_lenh_can, _id], {
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
					warehouseUuid: data?.fromUu?.parentUu?.uuid || '',
					productTypeUuid: data?.productTypeUu?.uuid,
					documentId: data?.documentId,
					description: data?.description,
					fromUuid: data?.fromUu?.uuid,
					toUuid: data?.toUu?.uuid,
					isPrint: data?.isPrint,
					code: data?.code,
					reason: '',
					scaleStationUuid: data?.scalesStationUu?.uuid || '',
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
					pageSize: 20,
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
					pageSize: 20,
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
					pageSize: 20,
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
					pageSize: 20,
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
					pageSize: 20,
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

	const listStorage = useQuery([QUERY_KEY.dropdown_bai, form.warehouseUuid], {
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
					typeFind: CONFIG_TYPE_FIND.TABLE,
					warehouseUuid: form.warehouseUuid,
					specificationsUuid: '',
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

	const listScaleStation = useQuery([QUERY_KEY.dropdown_tram_can], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: scalesStationServices.listScalesStation({
					page: 1,
					pageSize: 20,
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
					pageSize: 20,
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

	const fucnUpdateBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa lệnh cân thành công!',
				http: batchBillServices.upsertBatchBill({
					batchUuid: form?.batchUuid,
					billUuid: form.billUuid,
					shipUuid: form?.shipUuid,
					transportType: form?.transportType,
					timeIntend: form?.timeIntend ? moment(form?.timeIntend!).format('YYYY-MM-DD') : null,
					weightIntent: price(form?.weightIntent),
					customerName: '',
					isCreateBatch: 1,
					isSift: form.isSift != null ? form.isSift : TYPE_SIFT.KHONG_CAN_SANG,
					scalesType: TYPE_SCALES.CAN_XUAT,
					specificationsUuid: form.specificationsUuid,
					productTypeUuid: form.productTypeUuid,
					documentId: form.documentId,
					description: form.description,
					fromUuid: form.fromUuid,
					toUuid: form?.toUuid,
					isPrint: form.isPrint,
					isBatch: TYPE_BATCH.CAN_LO,
					shipOutUuid: '',
					scaleStationUuid: form?.scaleStationUuid,
					lstTruckAddUuid: listTruckChecked
						.filter((v) => !listTruckBatchBill.some((x) => v.uuid === x.uuid))
						?.map((item) => item.uuid),
					lstTruckRemoveUuid: listTruckBatchBill
						.filter((v) => !listTruckChecked.some((x) => v.uuid === x.uuid))
						?.map((item) => item.uuid),
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
		if (!form.toUuid) {
			return toastWarn({msg: 'Vui lòng chọn khách hàng!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại gỗ!'});
		}
		if (!form.specificationsUuid) {
			return toastWarn({msg: 'Vui lòng chọn quy cách!'});
		}
		if (!form.warehouseUuid) {
			return toastWarn({msg: 'Vui lòng chọn kho chính!'});
		}
		if (!form.fromUuid) {
			return toastWarn({msg: 'Vui lòng chọn bãi!'});
		}
		if (listTruckChecked.length == 0) {
			return toastWarn({msg: 'Vui lòng chọn xe hàng!'});
		}
		if (!form.timeIntend) {
			return toastWarn({msg: 'Vui lòng chọn ngày dự kiến!'});
		}
		if (!form.scaleStationUuid) {
			return toastWarn({msg: 'Vui lòng chọn trạm cân!'});
		}
		if (form.timeIntend) {
			const today = new Date(timeSubmit(new Date())!);
			const timeIntend = new Date(form.timeIntend);

			if (today > timeIntend) {
				return toastWarn({msg: 'Ngày dự kiến không hợp lệ!'});
			}
		}

		return fucnUpdateBatchBill.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnUpdateBatchBill.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Chỉnh sửa lệnh cân xuất dự kiến #{form.code}</h4>
						<p>Điền đầy đủ các thông tin lệnh cân</p>
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
							name='toUuid'
							placeholder='Chọn khách hàng'
							value={form?.toUuid}
							label={
								<span>
									Khách hàng<span style={{color: 'red'}}>*</span>
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
											isSift: v?.isSift,
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
					<div className={clsx('mt')}>
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
											fromUuid: '',
											specificationsUuid: '',
											productTypeUuid: '',
											scaleStationUuid: v?.scaleStationUu?.uuid || '',
										}))
									}
								/>
							))}
						</Select>
						<div>
							<Select
								isSearch
								name='fromUuid'
								placeholder='Nhập bãi'
								value={form?.fromUuid}
								readOnly={!form.warehouseUuid}
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
							placeholder='Chọn loại gỗ'
							value={form?.productTypeUuid}
							label={
								<span>
									Loại gỗ<span style={{color: 'red'}}>*</span>
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
										Quy cách <span style={{color: 'red'}}>*</span>
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
												fromUuid: '',
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
							type='text'
							max={255}
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
			</Form>
		</div>
	);
}

export default MainUpdateExport;
