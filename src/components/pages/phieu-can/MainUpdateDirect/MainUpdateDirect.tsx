import {useRouter} from 'next/router';
import {useState} from 'react';
import {IFormUpdateDirect, PropsMainUpdateDirect} from './interfaces';
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
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import truckServices from '~/services/truckServices';
import moment from 'moment';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import {toastWarn} from '~/common/funcs/toast';
import styles from './MainUpdateDirect.module.scss';
import Loading from '~/components/common/Loading';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import DatePicker from '~/components/common/DatePicker';
import ButtonSelectMany from '~/components/common/ButtonSelectMany';
import TextArea from '~/components/common/Form/components/TextArea';
import batchBillServices from '~/services/batchBillServices';
import customerServices from '~/services/customerServices';
import shipServices from '~/services/shipServices';
import {IDetailBatchBill} from '../../lenh-can/MainDetailBill/interfaces';
import FormReasonUpdateBill from '../FormReasonUpdateBill';
import Popup from '~/components/common/Popup';
import scalesStationServices from '~/services/scalesStationServices';
import {convertWeight} from '~/common/funcs/optionConvert';
import storageServices from '~/services/storageServices';
import warehouseServices from '~/services/warehouseServices';
import {IDetailCustomer} from '../../lenh-can/MainCreateImport/interfaces';

function MainUpdateDirect({}: PropsMainUpdateDirect) {
	const router = useRouter();

	const {_id} = router.query;

	const [openWarning, setOpenWarning] = useState<boolean>(false);
	const [listTruckChecked, setListTruckChecked] = useState<any[]>([]);
	const [listTruckBatchBill, setListTruckBatchBill] = useState<any[]>([]);

	const [form, setForm] = useState<IFormUpdateDirect>({
		batchUuid: '',
		billUuid: '',
		shipUuid: '',
		shipOutUuid: '',
		transportType: TYPE_TRANSPORT.DUONG_THUY,
		timeIntend: '',
		weightIntent: 0,
		isSift: null,
		specificationsUuid: '',
		productTypeUuid: '',
		documentId: '',
		description: '',
		fromUuid: '',
		toUuid: '',
		isPrint: 0,
		weightTotal: 0,
		timeEnd: null,
		timeStart: null,
		code: '',
		isBatch: TYPE_BATCH.CAN_LO,
		reason: '',
		scaleStationUuid: '',
		portname: '',
		warehouseUuid: '',
		storageTemporaryUuid: '',
		numShip: '',
	});

	const {data: detailBill} = useQuery<IDetailBatchBill>([QUERY_KEY.chi_tiet_lenh_can, _id], {
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
					transportType: data?.transportType,
					timeIntend: data?.batchsUu?.timeIntend,
					weightIntent: convertCoin(data?.batchsUu?.weightIntent),
					productTypeUuid: data?.productTypeUu?.uuid,
					description: data?.description,
					isPrint: data?.isPrint,
					fromUuid: data?.fromUu?.uuid,
					isSift: data?.isSift,
					specificationsUuid: data?.specificationsUu?.uuid,
					toUuid: data?.toUu?.uuid,
					documentId: data?.documentId,
					shipUuid: data?.batchsUu?.shipUu?.uuid || '',
					shipOutUuid: data?.batchsUu?.shipOutUu?.uuid || '',
					weightTotal: convertWeight(data?.weightTotal!),
					timeStart: data?.timeStart,
					timeEnd: data?.timeEnd,
					code: data?.code,
					isBatch: data?.isBatch,
					reason: '',
					scaleStationUuid: data?.scalesStationUu?.uuid || '',
					portname: data?.port || '',
					warehouseUuid: data?.storageTemporaryUu?.parentUu?.uuid || '',
					storageTemporaryUuid: data?.storageTemporaryUu?.uuid || '',
					numShip: data?.numShip || '',
				});

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

	const listCustomerFrom = useQuery([QUERY_KEY.dropdown_khach_hang_nhap], {
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

	const listCustomerTo = useQuery([QUERY_KEY.dropdown_khach_hang_xuat], {
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
		select(data) {
			return data;
		},
	});

	const {data: detailCustomer} = useQuery<IDetailCustomer>([QUERY_KEY.chi_tiet_khach_hang, form.fromUuid], {
		queryFn: () =>
			httpRequest({
				http: customerServices.getDetail({
					uuid: form.fromUuid,
				}),
			}),
		onSuccess(data) {
			if (data && !form.productTypeUuid && !form.specificationsUuid) {
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
			if (data) {
				setForm((prev) => ({
					...prev,
					storageTemporaryUuid: data?.[0]?.uuid || '',
				}));
			}
		},
		select(data) {
			return data;
		},
		enabled: !!form.warehouseUuid && !!form.productTypeUuid && !!form.specificationsUuid,
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

	const funcUpdateBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa phiếu cân thành công!',
				http: batchBillServices.upsertBatchBill({
					batchUuid: form?.batchUuid,
					billUuid: form?.billUuid,
					shipUuid: form?.shipUuid,
					transportType: form?.transportType,
					timeIntend: form?.timeIntend ? moment(form?.timeIntend!).format('YYYY-MM-DD') : null,
					weightIntent: price(form?.weightIntent),
					customerName: '',
					isCreateBatch: 1,
					isSift: form.isSift != null ? form.isSift : null,
					scalesType: TYPE_SCALES.CAN_TRUC_TIEP,
					specificationsUuid: form.specificationsUuid,
					productTypeUuid: form.productTypeUuid,
					documentId: form.documentId,
					description: form.description,
					fromUuid: form.fromUuid,
					toUuid: form?.toUuid,
					isPrint: form.isPrint,
					isBatch: form.isBatch,
					shipOutUuid: form.shipOutUuid,
					lstTruckAddUuid: listTruckChecked
						.filter((v) => !listTruckBatchBill.some((x) => v.uuid === x.uuid))
						?.map((item) => item.uuid),
					lstTruckRemoveUuid: listTruckBatchBill
						.filter((v) => !listTruckChecked.some((x) => v.uuid === x.uuid))
						?.map((item) => item.uuid),
					reason: form.reason,
					scaleStationUuid: form.scaleStationUuid,
					portname: form.portname,
					storageTemporaryUuid: form?.storageTemporaryUuid,
					numShip: form.numShip,
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
			return toastWarn({msg: 'Vui lòng chọn mã tàu đến!'});
		}
		if (form.transportType == TYPE_TRANSPORT.DUONG_THUY && !form.shipOutUuid) {
			return toastWarn({msg: 'Vui lòng chọn mã tàu đi!'});
		}
		if (!form.toUuid) {
			return toastWarn({msg: 'Vui lòng chọn khách hàng xuất!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại hàng!'});
		}
		if (!form.scaleStationUuid) {
			return toastWarn({msg: 'Vui lòng chọn trạm cân!'});
		}
		if (!form.specificationsUuid) {
			return toastWarn({msg: 'Vui lòng chọn quy cách!'});
		}
		if (!form.fromUuid) {
			return toastWarn({msg: 'Vui lòng chọn nhà cung cấp!'});
		}
		if (listTruckChecked.length == 0) {
			return toastWarn({msg: 'Vui lòng chọn xe hàng!'});
		}
		if (!form.warehouseUuid) {
			return toastWarn({msg: 'Vui lòng chọn kho chính!'});
		}
		if (!form.storageTemporaryUuid) {
			return toastWarn({msg: 'Vui lòng chọn kho trung chuyển!'});
		}
		if (
			form.toUuid != detailBill?.toUu?.uuid ||
			form.fromUuid != detailBill?.fromUu?.uuid ||
			form.productTypeUuid != detailBill?.productTypeUu?.uuid ||
			form.specificationsUuid != detailBill?.specificationsUu?.uuid
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
						<h4>Chỉnh sửa phiếu cân xuất thẳng #{form.code}</h4>
						<p>Điền đầy đủ các thông tin phiếu cân xuất thẳng</p>
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
					<div className={clsx('mt', 'col_3')}>
						<Input
							readOnly={true}
							name='weightTotal'
							value={form.weightTotal || ''}
							type='text'
							isMoney
							unit='TẤN'
							label={<span>Tổng khối lượng hàng</span>}
							placeholder='Nhập tổng khối lượng hàng'
						/>
						<DatePicker
							readonly={true}
							label={<span>Thời gian bắt đầu cân</span>}
							value={form.timeStart}
							onSetValue={(date) =>
								setForm((prev: any) => ({
									...prev,
									timeStart: date,
								}))
							}
							placeholder='Chọn thời gian bắt đầu cân'
						/>
						<DatePicker
							readonly={true}
							label={<span>Thời gian kết thúc</span>}
							value={form.timeEnd}
							onSetValue={(date) =>
								setForm((prev: any) => ({
									...prev,
									timeEnd: date,
								}))
							}
							placeholder='Chọn thời gian kết thúc'
						/>
					</div>
					<div className={clsx('mb', 'col_2', 'mt')}>
						<div className='col_2'>
							<div className={styles.item}>
								<label className={styles.label}>
									Hình thức vận chuyển <span style={{color: 'red'}}>*</span>
								</label>
								<div className={styles.group_radio}>
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
							name='fromUuid'
							placeholder='Chọn nhà cung cấp'
							value={form?.fromUuid}
							label={
								<span>
									Nhà cung cấp<span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listCustomerFrom?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											fromUuid: v?.uuid,
											productTypeUuid: '',
											specificationsUuid: '',
										}))
									}
								/>
							))}
						</Select>

						<div>
							<Select
								isSearch
								name='shipUuid'
								placeholder='Chọn tàu'
								value={form?.shipUuid}
								readOnly={form.transportType == TYPE_TRANSPORT.DUONG_BO}
								label={
									<span>
										Từ tàu <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listShip?.data
									?.filter((x: any) => x?.uuid != form.shipOutUuid)
									?.map((v: any) => (
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
							placeholder='Chọn kho hàng'
							value={form?.warehouseUuid}
							label={
								<span>
									Kho hàng <span style={{color: 'red'}}>*</span>
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
											storageTemporaryUuid: '',
											// scaleStationUuid: v?.scaleStationUu?.uuid || '',
										}))
									}
								/>
							))}
						</Select>
						<div>
							<Select
								isSearch
								name='storageTemporaryUuid'
								placeholder='Chọn bãi trung chuyển'
								value={form?.storageTemporaryUuid}
								readOnly={!form.warehouseUuid || !form.productTypeUuid || !form.specificationsUuid}
								label={
									<span>
										Bãi trung chuyển <span style={{color: 'red'}}>*</span>
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
												storageTemporaryUuid: v?.uuid,
											}))
										}
									/>
								))}
							</Select>
						</div>
					</div>
					<div className={clsx('mt', 'col_3')}>
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
							{listCustomerTo?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											toUuid: v?.uuid,
											isSift: v?.isSift,
										}))
									}
								/>
							))}
						</Select>
						<div>
							<Select
								isSearch
								name='shipOutUuid'
								placeholder='Chọn tàu'
								value={form?.shipOutUuid}
								readOnly={form.transportType == TYPE_TRANSPORT.DUONG_BO}
								label={
									<span>
										Đến tàu <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listShip?.data
									?.filter((x: any) => x?.uuid != form.shipUuid)
									?.map((v: any) => (
										<Option
											key={v?.uuid}
											value={v?.uuid}
											title={v?.licensePalate}
											onClick={() =>
												setForm((prev) => ({
													...prev,
													shipOutUuid: v?.uuid,
												}))
											}
										/>
									))}
							</Select>
						</div>
						<div>
							<Input
								name='numShip'
								value={form.numShip}
								type='text'
								label={<span>Số hiệu tàu</span>}
								placeholder='Nhập số tàu'
							/>
						</div>
					</div>

					<div className={clsx('mt')}>
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
					</div>
					<div className={clsx('mt')}>
						<Input
							name='documentId'
							value={form.documentId || ''}
							type='text'
							max={255}
							label={<span>Số chứng từ</span>}
							placeholder='Nhập số chứng từ'
						/>
					</div>
					<div className={clsx('mt', 'col_2')}>
						<ButtonSelectMany
							isShowCheckAll={false}
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
						<Input
							name='portname'
							value={form.portname}
							type='text'
							label={<span>Cảng bốc dỡ</span>}
							placeholder='Nhập cảng bốc dỡ'
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

export default MainUpdateDirect;
