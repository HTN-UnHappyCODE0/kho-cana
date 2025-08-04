import {useRouter} from 'next/router';
import {useState} from 'react';
import {IFormCreateTransfer, PropsMainUpdateTransfer} from './interfaces';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_BATCH,
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import truckServices from '~/services/truckServices';
import moment from 'moment';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import {toastWarn} from '~/common/funcs/toast';
import styles from './MainUpdateTransfer.module.scss';
import Loading from '~/components/common/Loading';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import warehouseServices from '~/services/warehouseServices';
import storageServices from '~/services/storageServices';
import DatePicker from '~/components/common/DatePicker';
import ButtonSelectMany from '~/components/common/ButtonSelectMany';
import TextArea from '~/components/common/Form/components/TextArea';
import {timeSubmit} from '~/common/funcs/optionConvert';
import batchBillServices from '~/services/batchBillServices';
import scalesStationServices from '~/services/scalesStationServices';
import uploadImageService from '~/services/uploadService';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import {IDetailBatchBill} from '../../lenh-can/MainDetailBill/interfaces';

function MainUpdateTransfer({}: PropsMainUpdateTransfer) {
	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<any[]>([]);

	const {_id} = router.query;

	const [form, setForm] = useState<IFormCreateTransfer>({
		batchUuid: '',
		billUuid: '',
		weight1: 0,
		weight2: 0,
		isSift: TYPE_SIFT.KHONG_CAN_SANG,
		specificationsUuid: '',
		warehouseToUuid: '',
		warehouseFromUuid: '',
		productTypeUuid: '',
		description: '',
		fromUuid: '',
		toUuid: '',
		isPrint: 0,
		transportType: TYPE_TRANSPORT.DUONG_BO,
		timeStart: null,
		timeEnd: null,
		code: '',
		dryness: 0,
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
					weight1: convertCoin(data?.weight1),
					weight2: convertCoin(data?.weight2),
					productTypeUuid: data?.productTypeUu?.uuid,
					description: data?.description,
					isPrint: data?.isPrint,
					fromUuid: data?.fromUu?.uuid,
					isSift: data?.isSift,
					specificationsUuid: data?.specificationsUu?.uuid,
					toUuid: data?.toUu?.uuid,
					warehouseFromUuid: data?.fromUu?.parentUu?.uuid || '',
					warehouseToUuid: data?.toUu?.parentUu?.uuid || '',
					code: data?.code,
					timeStart: moment(data.timeStart).format('yyyy-MM-DD'),
					timeEnd: moment(data.timeEnd).format('yyyy-MM-DD'),
					dryness: data?.drynessAvg || 0,
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
					typeFind: CONFIG_TYPE_FIND.FILTER,
					type: [TYPE_PRODUCT.CONG_TY, TYPE_PRODUCT.DUNG_CHUNG],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach, form?.productTypeUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
					productTypeUuid: form?.productTypeUuid,
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
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listWarehouseFrom = useQuery([QUERY_KEY.dropdown_kho_hang_nguon], {
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
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					customerUuid: '',
					timeEnd: null,
					timeStart: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listWarehouseTo = useQuery([QUERY_KEY.dropdown_kho_hang_den], {
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

	const listStorageFrom = useQuery([QUERY_KEY.dropdown_bai_nguon, form.warehouseFromUuid], {
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
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					warehouseUuid: form.warehouseFromUuid,
				}),
			}),
		onSuccess(data) {
			if (data && !form.fromUuid) {
				setForm((prev) => ({
					...prev,
					fromUuid: data?.[0]?.uuid || '',
				}));
			}
		},
		select(data) {
			return data;
		},
		enabled: !!form.warehouseFromUuid,
	});

	const listStorageTo = useQuery([QUERY_KEY.dropdown_bai_dich, form.warehouseToUuid], {
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
					productUuid: '',
					qualityUuid: '',
					warehouseUuid: form.warehouseToUuid,
					specificationsUuid: '',
				}),
			}),
		onSuccess(data) {
			if (data && !form.toUuid) {
				setForm((prev) => ({
					...prev,
					toUuid: data?.filter((x: any) => x?.uuid != form?.fromUuid)?.[0]?.uuid || '',
					productTypeUuid: data?.filter((x: any) => x?.uuid != form?.fromUuid)?.[0]?.productUu?.uuid,
					specificationsUuid: data?.filter((x: any) => x?.uuid != form?.fromUuid)?.[0]?.specificationsUu?.uuid,
				}));
			}
		},
		select(data) {
			return data;
		},
		enabled: !!form.warehouseToUuid,
	});

	const funcCreateBatchBill = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa chuyển kho ngoài hệ thống thành công!',
				http: batchBillServices.upsertBillNoScales({
					batchUuid: form?.batchUuid,
					billUuid: form?.billUuid,
					shipUuid: '',
					shipOutUuid: '',
					transportType: form.transportType,
					timeIntend: null,
					weight1: price(form?.weight1),
					weight2: price(form?.weight2),
					isBatch: TYPE_BATCH.KHONG_CAN,
					isCreateBatch: 1,
					isSift: TYPE_SIFT.KHONG_CAN_SANG,
					scalesType: TYPE_SCALES.CAN_CHUYEN_KHO,
					specificationsUuid: form.specificationsUuid,
					productTypeUuid: form.productTypeUuid,
					documentId: '',
					description: form.description,
					customerName: '',
					fromUuid: form.fromUuid,
					toUuid: form?.toUuid,
					isPrint: 0,
					lstTruckPlateAdd: [],
					lstTruckPlateRemove: [],
					scaleStationUuid: '',
					portname: '',
					descriptionWs: '',
					paths: body.paths,
					timeEnd: form?.timeEnd ? timeSubmit(new Date(form?.timeEnd!), true) : null,
					timeStart: form?.timeStart ? timeSubmit(new Date(form?.timeStart!)) : null,
					dryness: Number(form.dryness || 0),
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
			return toastWarn({msg: 'Vui lòng chọn bãi chuyển!'});
		}
		if (!form.toUuid) {
			return toastWarn({msg: 'Vui lòng chọn bãi đích!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại hàng!'});
		}
		if (!form.specificationsUuid) {
			return toastWarn({msg: 'Vui lòng chọn quy cách!'});
		}
		if (form.dryness < 0 || form.dryness > 100) {
			return toastWarn({msg: 'Độ khô không hợp lệ!'});
		}
		if (form?.fromUuid == form.toUuid) {
			return toastWarn({msg: 'Trùng kho đích!'});
		}
		if (Math.abs(Number(form.weight1) - Number(form.weight2)) < 0.01) {
			return toastWarn({msg: 'Khối lượng cân lần 1 và lần 2 chưa đúng!'});
		}
		if (tomorrow < timeStart) {
			return toastWarn({msg: 'Ngày bắt đầu không lớn hơn hôm này!'});
		}

		if (!form?.timeStart) {
			return toastWarn({msg: 'Vui lòng chọn ngày bắt đầu!'});
		}
		if (!form?.timeEnd) {
			return toastWarn({msg: 'Vui lòng chọn ngày kết thúc!'});
		}
		if (tomorrow < timeEnd) {
			return toastWarn({msg: 'Ngày kết thúc không lớn hơn hôm này!'});
		}

		if (timeStart > timeEnd) {
			return toastWarn({msg: 'Ngày kết thúc phải lớn hơn ngày bắt đầu!'});
		}

		const imgs = images?.map((v: any) => v?.file);

		if (imgs.length > 0) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadMutilImage(imgs),
			});
			if (dataImage?.error?.code == 0) {
				return funcCreateBatchBill.mutate({
					paths: dataImage.items,
				});
			} else {
				return toastWarn({msg: 'Upload ảnh thất bại!'});
			}
		} else {
			return funcCreateBatchBill.mutate({
				...form,
				paths: [],
			});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcCreateBatchBill.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Chỉnh sửa chuyển kho ngoài hệ thống #{form.code}</h4>
						<p>Điền đầy đủ các thông tin chuyển kho ngoài hệ thống</p>
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
					<div className={clsx('mb')}>
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
					</div>
					<div className={clsx('mt', 'col_2')}>
						<Select
							isSearch
							name='warehouseFromUuid'
							placeholder='Chọn kho'
							value={form?.warehouseFromUuid}
							label={
								<span>
									Từ kho chính <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listWarehouseFrom?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											warehouseFromUuid: v?.uuid,
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
								placeholder='Chọn bãi phụ'
								value={form?.fromUuid}
								readOnly={!form.warehouseFromUuid}
								label={
									<span>
										Từ bãi phụ <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listStorageFrom?.data?.map((v: any) => (
									<Option
										key={v?.uuid}
										value={v?.uuid}
										title={v?.name}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												fromUuid: v?.uuid,
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
							name='warehouseToUuid'
							placeholder='Chọn kho'
							value={form?.warehouseToUuid}
							label={
								<span>
									Chọn kho chính <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listWarehouseTo?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											warehouseToUuid: v?.uuid,
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
								placeholder='Chọn bãi địch'
								value={form?.toUuid}
								readOnly={!form.warehouseToUuid}
								label={
									<span>
										Chọn bãi đích <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listStorageTo?.data
									?.filter((x: any) => x?.uuid != form?.fromUuid)
									?.map((v: any) => (
										<Option
											key={v?.uuid}
											value={v?.uuid}
											title={v?.name}
											onClick={() =>
												setForm((prev: any) => ({
													...prev,
													toUuid: v?.uuid,
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
											specificationsUuid: '',
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
											}))
										}
									/>
								))}
							</Select>
						</div>
					</div>
					<div className={clsx('mt', 'col_3')}>
						<Input
							name='weight1'
							value={form.weight1 || ''}
							type='text'
							isMoney
							unit='KG'
							label={
								<span>
									KL cân lần 1 <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập kL cân lần 1'
						/>

						<div>
							<Input
								name='weight2'
								value={form.weight2 || ''}
								type='text'
								isMoney
								unit='KG'
								label={
									<span>
										KL cân lần 2 <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập kL cân lần 2'
							/>
						</div>
						<div>
							<Input
								name='dryness'
								value={form.dryness || ''}
								unit='%'
								type='number'
								blur={true}
								placeholder='Nhập độ khô'
								label={<span>Độ khô</span>}
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
					{/* <div className={clsx('mt', 'col_2')}>
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
								name='dryness'
								value={form.dryness || ''}
								unit='%'
								type='number'
								blur={true}
								placeholder='Nhập độ khô'
								label={<span>Độ khô</span>}
							/>
						</div>
					</div> */}

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

export default MainUpdateTransfer;
