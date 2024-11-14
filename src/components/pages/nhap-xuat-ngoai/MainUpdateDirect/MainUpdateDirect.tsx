import React, {useState} from 'react';

import {IFormUpdateDirect, PropsMainUpdateDirect} from './interfaces';
import styles from './MainUpdateDirect.module.scss';
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
import batchBillServices from '~/services/batchBillServices';
import {httpRequest} from '~/services';
import {IDetailBatchBill} from '../../lenh-can/MainDetailBill/interfaces';
import {useMutation, useQuery} from '@tanstack/react-query';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import DatePicker from '~/components/common/DatePicker';
import TextArea from '~/components/common/Form/components/TextArea';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import customerServices from '~/services/customerServices';
import shipServices from '~/services/shipServices';
import warehouseServices from '~/services/warehouseServices';
import storageServices from '~/services/storageServices';
import {IDetailCustomer} from '../MainCreateDirect/interfaces';
import moment from 'moment';
import {toastWarn} from '~/common/funcs/toast';
import uploadImageService from '~/services/uploadService';
import {timeSubmit} from '~/common/funcs/optionConvert';

function MainUpdateDirect({}: PropsMainUpdateDirect) {
	const router = useRouter();
	const {_id} = router.query;
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<any[]>([]);
	const [form, setForm] = useState<IFormUpdateDirect>({
		transportType: TYPE_TRANSPORT.DUONG_THUY,
		fromUuid: '',
		shipUuid: '',
		shipOutUuid: '',
		toUuid: '',
		productTypeUuid: '',
		specificationsUuid: '',
		weightIntent: 0,
		documentId: '',
		description: '',
		warehouseUuid: '',
		storageTemporaryUuid: '',
		timeStart: '',
		timeEnd: '',
		batchUuid: '',
		billUuid: '',
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
					batchUuid: data?.batchsUu?.uuid,
					billUuid: data?.uuid,
					transportType: data?.transportType, //đường thủy
					fromUuid: data?.fromUu?.uuid, //Nhà cung cấp
					shipUuid: data?.batchsUu?.shipUu?.uuid || '', // Từ tàu
					productTypeUuid: data?.productTypeUu?.uuid, //Loại hàng
					specificationsUuid: data?.specificationsUu?.uuid, //Quy cách
					warehouseUuid: data?.storageTemporaryUu?.parentUu?.uuid || '', //Kho hàng
					storageTemporaryUuid: data?.storageTemporaryUu?.uuid || '', //Bãi trung chuyển
					toUuid: data?.toUu?.uuid, //Khách hàng xuất
					shipOutUuid: data?.batchsUu?.shipOutUu?.uuid || '', //Đến tàu
					weightIntent: convertCoin(data?.batchsUu?.weightIntent), //Khối lượng cân
					documentId: data?.documentId || '', //Chứng từ
					timeStart: moment(data.timeStart).format('yyyy-MM-DD'),
					timeEnd: moment(data.timeEnd).format('yyyy-MM-DD'),
					description: data?.description,
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

	const funcUpdateBatchBillNoScale = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa thành công!',
				http: batchBillServices.upsertBillNoScales({
					batchUuid: form?.batchUuid,
					billUuid: form.billUuid,
					shipUuid: form.shipUuid,
					shipOutUuid: form.shipOutUuid,
					transportType: form?.transportType,
					timeIntend: null,
					weightIntent: price(form?.weightIntent),
					customerName: '',
					isBatch: TYPE_BATCH.KHONG_CAN,
					isCreateBatch: 1,
					isSift: TYPE_SIFT.KHONG_CAN_SANG,
					scalesType: TYPE_SCALES.CAN_TRUC_TIEP,
					fromUuid: form?.fromUuid,
					toUuid: form?.toUuid,
					documentId: form.documentId,
					description: form.description,
					isPrint: 0,
					specificationsUuid: form?.specificationsUuid,
					productTypeUuid: form.productTypeUuid,
					scaleStationUuid: '',
					storageTemporaryUuid: form?.storageTemporaryUuid,
					portname: '',
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

		if (!form.fromUuid) {
			return toastWarn({msg: 'Vui lòng chọn nhà cung cấp!'});
		}
		if (!form.shipUuid) {
			return toastWarn({msg: 'Vui lòng chọn tàu!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại hàng!'});
		}
		if (!form.specificationsUuid) {
			return toastWarn({msg: 'Vui lòng chọn quy cách!'});
		}
		if (!form.warehouseUuid) {
			return toastWarn({msg: 'Vui lòng chọn kho hàng!'});
		}

		if (!form.storageTemporaryUuid) {
			return toastWarn({msg: 'Vui lòng chọn bãi trung chuyển!'});
		}
		if (!form.toUuid) {
			return toastWarn({msg: 'Vui lòng chọn khách hàng xuất!'});
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
			return toastWarn({msg: 'Ngày bắt đầu không được nhỏ hơn!'});
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
						<h4>Chỉnh sửa phiếu xuất thẳng</h4>
						<p>Điền đầy đủ các thông tin cân trực tiếp</p>
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

				<div className={styles.from}>
					<div className={clsx('mt', 'col_2')}>
						<div className={styles.item}>
							<label className={styles.label}>
								Hình thức vận chuyển <span style={{color: 'red'}}>*</span>
							</label>
							<div className={styles.group_radio}>
								{/* <div className={styles.item_radio}>
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
								</div> */}
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
								// readOnly={form.transportType == TYPE_TRANSPORT.DUONG_BO}
								label={
									<span>
										Từ tàu
										<span style={{color: 'red'}}>*</span>
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
						<Input
							name='weightIntent'
							value={form.weightIntent || ''}
							type='text'
							isMoney
							unit='KG'
							placeholder='Nhập khối lượng cân'
							label={
								<span>
									Khối lượng cân <span style={{color: 'red'}}>*</span>
								</span>
							}
						/>
						<div>
							<Input
								name='documentId'
								value={form.documentId || ''}
								type='text'
								max={255}
								label={<span>Chứng từ </span>}
								placeholder='Nhập chứng từ'
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

export default MainUpdateDirect;
