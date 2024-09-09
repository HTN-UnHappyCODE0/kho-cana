import React, {useState} from 'react';

import styles from './MainUpdateService.module.scss';
import {IFormUpdateService, PropsMainUpdateService} from './interfaces';
import {toastWarn} from '~/common/funcs/toast';
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
import {convertCoin, price} from '~/common/funcs/convertCoin';
import moment from 'moment';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import truckServices from '~/services/truckServices';
import wareServices from '~/services/wareServices';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import Loading from '~/components/common/Loading';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import DatePicker from '~/components/common/DatePicker';
import ButtonSelectMany from '~/components/common/ButtonSelectMany';
import TextArea from '~/components/common/Form/components/TextArea';
import SelectSearch from '~/components/common/SelectSearch';
import batchBillServices from '~/services/batchBillServices';
import shipServices from '~/services/shipServices';
import {IDetailBatchBill} from '../../lenh-can/MainDetailBill/interfaces';

function MainUpdateService({}: PropsMainUpdateService) {
	const router = useRouter();

	const {_id} = router.query;

	const [dataCustomer, setDataCustomer] = useState<any>({});
	const [listTruckChecked, setListTruckChecked] = useState<any[]>([]);
	const [listTruckBatchBill, setListTruckBatchBill] = useState<any[]>([]);

	const [form, setForm] = useState<IFormUpdateService>({
		batchUuid: '',
		billUuid: '',
		shipUuid: '',
		transportType: TYPE_TRANSPORT.DUONG_THUY,
		timeIntend: '',
		weightIntent: 0,
		productTypeUuid: '',
		documentId: '',
		description: '',
		isPrint: 0,
		weightTotal: 0,
		timeEnd: null,
		timeStart: null,
		code: '',
		isBatch: TYPE_BATCH.CAN_LO,
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
					transportType: data?.transportType,
					shipUuid: data?.batchsUu?.shipUu?.uuid || '',
					timeIntend: data?.batchsUu?.timeIntend,
					weightIntent: convertCoin(data?.batchsUu?.weightIntent),
					productTypeUuid: data?.productTypeUu?.uuid,
					documentId: data?.documentId,
					description: data?.description,
					isPrint: data?.isPrint,
					weightTotal: convertCoin(data?.weightTotal!),
					timeStart: data?.timeStart,
					timeEnd: data?.timeEnd,
					code: data?.code,
					isBatch: data?.isBatch,
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
				setDataCustomer(
					data?.customerName
						? {
								id: '',
								name: data?.customerName,
						  }
						: {
								id: data?.fromUu?.uuid,
								name: data?.fromUu?.name,
						  }
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
					typeFind: CONFIG_TYPE_FIND.FILTER,
					partnerUUid: '',
					userUuid: '',
					status: STATUS_CUSTOMER.HOP_TAC,
					typeCus: TYPE_CUSTOMER.DICH_VU,
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
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					type: [TYPE_PRODUCT.DICH_VU, TYPE_PRODUCT.DUNG_CHUNG],
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
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
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
				msgSuccess: 'Chỉnh sửa phiếu cân thành công!',
				http: batchBillServices.upsertBatchBill({
					batchUuid: form?.batchUuid,
					billUuid: form.billUuid,
					shipUuid: form?.shipUuid,
					shipOutUuid: '',
					isSift: TYPE_SIFT.KHONG_CAN_SANG,
					isCreateBatch: 1,
					specificationsUuid: '',
					transportType: form?.transportType,
					timeIntend: form?.timeIntend ? moment(form?.timeIntend!).format('YYYY-MM-DD') : null,
					weightIntent: price(form?.weightIntent),
					isBatch: form.isBatch,
					scalesType: TYPE_SCALES.CAN_DICH_VU,
					productTypeUuid: form.productTypeUuid,
					documentId: form.documentId,
					description: form.description,
					customerName: !dataCustomer?.id ? dataCustomer?.name : '',
					fromUuid: dataCustomer?.id ? dataCustomer?.id : '',
					toUuid: dataCustomer?.id ? dataCustomer?.id : '',
					isPrint: form.isPrint,
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
		if (!dataCustomer?.id && !dataCustomer?.name) {
			return toastWarn({msg: 'Vui lòng chọn khách hàng!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại gỗ!'});
		}
		if (listTruckChecked.length == 0) {
			return toastWarn({msg: 'Vui lòng chọn xe hàng!'});
		}

		return fucnUpdateBatchBill.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnUpdateBatchBill.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Chỉnh sửa phiếu cân dịch vụ #{form.code}</h4>
						<p>Điền đầy đủ các thông tin phiếu cân dịch vụ</p>
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
							unit='KG'
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
					<div className={clsx('mb', 'mt', 'col_3')}>
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
						<SelectSearch
							options={listCustomer?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
							data={dataCustomer}
							setData={setDataCustomer}
							label={
								<span>
									Khách hàng <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập, chọn khách hàng'
						/>
						<div>
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
						</div>
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

export default MainUpdateService;
