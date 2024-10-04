import React, {useState} from 'react';

import {IFormCreateDirect, PropsMainCreateDirect} from './interfaces';
import styles from './MainCreateDirect.module.scss';
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
import DatePicker from '~/components/common/DatePicker';
import TextArea from '~/components/common/Form/components/TextArea';
import truckServices from '~/services/truckServices';
import ButtonSelectMany from '~/components/common/ButtonSelectMany';
import {useRouter} from 'next/router';
import moment from 'moment';
import {price} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import {timeSubmit} from '~/common/funcs/optionConvert';
import batchBillServices from '~/services/batchBillServices';
import priceTagServices from '~/services/priceTagServices';
import shipServices from '~/services/shipServices';
import scalesStationServices from '~/services/scalesStationServices';

function MainCreateDirect({}: PropsMainCreateDirect) {
	const router = useRouter();

	const [listTruckChecked, setListTruckChecked] = useState<any[]>([]);

	const [form, setForm] = useState<IFormCreateDirect>({
		shipUuid: '',
		shipOutUuid: '',
		transportType: TYPE_TRANSPORT.DUONG_THUY,
		timeIntend: new Date(),
		weightIntent: 0,
		isSift: TYPE_SIFT.KHONG_CAN_SANG,
		specificationsUuid: '',
		productTypeUuid: '',
		documentId: '',
		description: '',
		fromUuid: '',
		toUuid: '',
		isPrint: 0,
		scaleStationUuid: '',
	});

	const listCustomerFrom = useQuery([QUERY_KEY.dropdown_khach_hang_nhap], {
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
					customerUuid: form.fromUuid,
					priceTagUuid: '',
					productTypeUuid: '',
					specUuid: '',
				}),
			}),
		onSuccess(data) {
			if (data) {
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

	const funcCreateBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới lệnh cân thành công!',
				http: batchBillServices.upsertBatchBill({
					batchUuid: '',
					billUuid: '',
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
					isBatch: TYPE_BATCH.CAN_LO,
					shipOutUuid: form.shipOutUuid,
					lstTruckAddUuid: listTruckChecked?.map((v) => v.uuid),
					lstTruckRemoveUuid: [],
					scaleStationUuid: form.scaleStationUuid,
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
		const timeIntend = new Date(form.timeIntend);

		if (form.transportType == TYPE_TRANSPORT.DUONG_THUY && !form.shipUuid) {
			return toastWarn({msg: 'Vui lòng nhập mã tàu đến!'});
		}
		if (form.transportType == TYPE_TRANSPORT.DUONG_THUY && !form.shipOutUuid) {
			return toastWarn({msg: 'Vui lòng nhập mã tàu đi!'});
		}
		if (!form.toUuid) {
			return toastWarn({msg: 'Vui lòng chọn khách hàng xuất!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại hàng!'});
		}
		if (!form.specificationsUuid) {
			return toastWarn({msg: 'Vui lòng chọn quy cách!'});
		}
		if (!form.scaleStationUuid) {
			return toastWarn({msg: 'Vui lòng chọn trạm cân!'});
		}
		if (!form.fromUuid) {
			return toastWarn({msg: 'Vui lòng chọn nhà cung cấp!'});
		}
		if (listTruckChecked.length == 0) {
			return toastWarn({msg: 'Vui lòng chọn xe hàng!'});
		}

		if (today > timeIntend) {
			return toastWarn({msg: 'Ngày dự kiến không hợp lệ!'});
		}

		return funcCreateBatchBill.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcCreateBatchBill.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Thêm lệnh cân xuất thẳng dự kiến</h4>
						<p>Điền đầy đủ các thông tin lệnh cân xuất thẳng dự kiến</p>
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
					<div className={clsx('mb', 'col_2')}>
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
							{[...new Map(listPriceTagInfo?.data?.map((v: any) => [v?.productTypeUu?.uuid, v])).values()]?.map((v: any) => (
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
							placeholder='Nhập khối lượng dự kiến'
							label={<span>Khối lượng dự kiến</span>}
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

export default MainCreateDirect;
