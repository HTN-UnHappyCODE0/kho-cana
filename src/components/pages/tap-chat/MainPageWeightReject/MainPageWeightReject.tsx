import React, {useEffect, useState} from 'react';

import {PropsMainPageWeightReject} from './interfaces';
import styles from './MainPageWeightReject.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATE_BILL,
	STATUS_BILL,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_SIFT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import batchBillServices from '~/services/batchBillServices';
import storageServices from '~/services/storageServices';
import shipServices from '~/services/shipServices';
import wareServices from '~/services/wareServices';
import truckServices from '~/services/truckServices';
import scalesStationServices from '~/services/scalesStationServices';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import SelectFilterState from '~/components/common/SelectFilterState';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {convertWeight} from '~/common/funcs/optionConvert';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {ITableBillScale} from '../../phieu-can/MainPageScalesAll/interfaces';
import Link from 'next/link';
import clsx from 'clsx';
import StateActive from '~/components/common/StateActive';
import Button from '~/components/common/Button';
import Popup from '~/components/common/Popup';
import FormAccessSpecExcel from '../../phieu-can/MainDetailScales/components/FormAccessSpecExcel';
import FormAccessWeighReject from '../FormAccessWeighReject';
import IconCustom from '~/components/common/IconCustom';
import {TickCircle} from 'iconsax-react';
import companyServices from '~/services/companyServices';

function MainPageWeightReject({}: PropsMainPageWeightReject) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isHaveDryness, setIsHaveDryness] = useState<string>('');
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [truckUuid, setTruckUuid] = useState<string[]>([]);
	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [openConfirm, setOpenConfirm] = useState<boolean>(false);

	const {_page, _pageSize, _keyword, _isBatch, _productTypeUuid, _shipUuid, _status, _dateFrom, _dateTo, _state, _scalesStationUuid} =
		router.query;

	const [listBatchBill, setListBatchBill] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [uuidConfirm, setUuidConfirm] = useState<string | null>(null);
	const [uuidCompany, setUuidCompany] = useState<string>('');
	const [uuidQuality, setUuidQuality] = useState<string>('');
	const [uuidStorage, setUuidStorage] = useState<string>('');

	const listQuality = useQuery([QUERY_KEY.dropdown_quoc_gia], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listQuality({
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

	const listCompany = useQuery([QUERY_KEY.dropdown_cong_ty], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: companyServices.listCompany({
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

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang, uuidCompany], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					partnerUUid: '',
					userUuid: '',
					status: null,
					typeCus: null,
					provinceId: '',
					specUuid: '',
					companyUuid: uuidCompany,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listScalesStation = useQuery([QUERY_KEY.table_tram_can], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: scalesStationServices.listScalesStation({
					page: 1,
					pageSize: 50,
					keyword: '',
					companyUuid: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
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
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
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
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					type: [TYPE_PRODUCT.CONG_TY, TYPE_PRODUCT.DUNG_CHUNG],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listShip = useQuery([QUERY_KEY.dropdown_ma_tau], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: shipServices.listShip({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
				}),
			}),

		select(data) {
			return data;
		},
	});

	const listStorage = useQuery([QUERY_KEY.table_bai], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					warehouseUuid: '',
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			if (data) {
				return data;
			}
		},
	});

	const getListBatch = useQuery(
		[
			QUERY_KEY.table_tap_chat,
			_page,
			_pageSize,
			_keyword,
			_isBatch,
			customerUuid,
			_productTypeUuid,
			_shipUuid,
			_status,
			_dateFrom,
			_dateTo,
			_state,
			uuidQuality,
			uuidStorage,
			_scalesStationUuid,
			isHaveDryness,
			truckUuid,
			uuidCompany,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: batchBillServices.getListBill({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						scalesType: [],
						state: !!_state
							? [Number(_state)]
							: [
									STATE_BILL.NOT_CHECK,
									STATE_BILL.QLK_REJECTED,
									STATE_BILL.QLK_CHECKED,
									STATE_BILL.KTK_REJECTED,
									STATE_BILL.KTK_CHECKED,
									STATE_BILL.END,
							  ],
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						isCreateBatch: null,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: !!_status
							? [Number(_status)]
							: [
									STATUS_BILL.DANG_CAN,
									STATUS_BILL.TAM_DUNG,
									STATUS_BILL.DA_CAN_CHUA_KCS,
									STATUS_BILL.DA_KCS,
									STATUS_BILL.CHOT_KE_TOAN,
							  ],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						warehouseUuid: '',
						qualityUuid: uuidQuality,
						transportType: null,
						shipUuid: (_shipUuid as string) || '',
						typeCheckDay: 0,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						storageUuid: uuidStorage,
						isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
						truckUuid: truckUuid,
						customerUuid: '',
						listCustomerUuid: customerUuid,
						isNeedConfirmReject: 1,
						companyUuid: uuidCompany,
					}),
				}),
			onSuccess(data) {
				if (data) {
					setListBatchBill(
						data?.items?.map((v: any, index: number) => ({
							...v,
							index: index,
							isChecked: false,
						}))
					);
					setTotal(data?.pagination?.totalCount);
				}
			},
			select(data) {
				return data;
			},
		}
	);

	const exportExcel = useMutation({
		mutationFn: (isHaveSpec: number) => {
			return httpRequest({
				http: batchBillServices.exportExcel({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					scalesType: [],
					state: !!_state
						? [Number(_state)]
						: [
								STATE_BILL.NOT_CHECK,
								STATE_BILL.QLK_REJECTED,
								STATE_BILL.QLK_CHECKED,
								STATE_BILL.KTK_REJECTED,
								STATE_BILL.KTK_CHECKED,
								STATE_BILL.END,
						  ],
					customerUuid: '',
					listCustomerUuid: customerUuid,
					isBatch: !!_isBatch ? Number(_isBatch) : null,
					isCreateBatch: null,
					productTypeUuid: (_productTypeUuid as string) || '',
					specificationsUuid: '',
					status: !!_status
						? [Number(_status)]
						: [
								STATUS_BILL.DANG_CAN,
								STATUS_BILL.TAM_DUNG,
								STATUS_BILL.DA_CAN_CHUA_KCS,
								STATUS_BILL.DA_KCS,
								STATUS_BILL.CHOT_KE_TOAN,
						  ],
					timeStart: _dateFrom ? (_dateFrom as string) : null,
					timeEnd: _dateTo ? (_dateTo as string) : null,
					warehouseUuid: '',
					qualityUuid: uuidQuality,
					transportType: null,
					shipUuid: (_shipUuid as string) || '',
					typeCheckDay: 0,
					scalesStationUuid: (_scalesStationUuid as string) || '',
					documentId: '',
					storageUuid: uuidStorage,
					isExportSpec: isHaveSpec,
					isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
					truckUuid: truckUuid,
					isNeedConfirmReject: 1,
					companyUuid: uuidCompany,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
				setOpenExportExcel(false);
			}
		},
	});

	const handleExportExcel = (isHaveSpec: number) => {
		return exportExcel.mutate(isHaveSpec);
	};

	const accessWeighReject = useMutation({
		mutationFn: (isConfirm: number) => {
			return httpRequest({
				http: batchBillServices.confirmWeighReject({
					uuid: uuidConfirm as string,
					isConfirm: isConfirm,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setUuidConfirm(null);
				queryClient.invalidateQueries([QUERY_KEY.table_tap_chat]);
			}
		},
	});

	const handleConfirm = (isConfirm: number) => {
		return accessWeighReject.mutate(isConfirm);
	};

	useEffect(() => {
		if (uuidCompany) {
			setCustomerUuid([]);
		}
		if (uuidQuality) {
			setUuidStorage('');
		}
	}, [uuidCompany, uuidQuality]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lô hàng' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Kiểu cân'
							query='_isBatch'
							listFilter={[
								{
									id: TYPE_BATCH.CAN_LO,
									name: 'Cân lô',
								},
								{
									id: TYPE_BATCH.CAN_LE,
									name: 'Cân lẻ',
								},
								{
									id: TYPE_BATCH.KHONG_CAN,
									name: 'Không qua cân',
								},
							]}
						/>
					</div>
					<SelectFilterState
						uuid={uuidCompany}
						setUuid={setUuidCompany}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Kv cảng xuất khẩu'
					/>
					<SelectFilterMany
						selectedIds={customerUuid}
						setSelectedIds={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Khách hàng'
					/>
					<SelectFilterMany
						selectedIds={truckUuid}
						setSelectedIds={setTruckUuid}
						listData={listTruck?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.licensePalate,
						}))}
						name='Biển số xe'
					/>

					<FilterCustom
						isSearch
						name='Loại hàng'
						query='_productTypeUuid'
						listFilter={listProductType?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>

					<FilterCustom
						isSearch
						name='Mã tàu'
						query='_shipUuid'
						listFilter={listShip?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.licensePalate,
						}))}
					/>

					<FilterCustom
						isSearch
						name='Xác nhận SL'
						query='_state'
						listFilter={[
							{
								id: STATE_BILL.NOT_CHECK,
								name: 'Chưa duyệt',
							},
							{
								id: STATE_BILL.QLK_REJECTED,
								name: 'QLK duyệt lại',
							},
							{
								id: STATE_BILL.QLK_CHECKED,
								name: 'QLK đã duyệt',
							},
							{
								id: STATE_BILL.KTK_REJECTED,
								name: 'KTK duyệt lại',
							},
							{
								id: STATE_BILL.KTK_CHECKED,
								name: 'KTK đã duyệt',
							},
							{
								id: STATE_BILL.END,
								name: 'Kết thúc',
							},
						]}
					/>
					<FilterCustom
						isSearch
						name='Trạng thái'
						query='_status'
						listFilter={[
							{
								id: STATUS_BILL.DANG_CAN,
								name: 'Đang cân',
							},
							{
								id: STATUS_BILL.TAM_DUNG,
								name: 'Tạm dừng',
							},
							{
								id: STATUS_BILL.DA_CAN_CHUA_KCS,
								name: 'Đã cân chưa KCS',
							},
							{
								id: STATUS_BILL.DA_KCS,
								name: 'Đã KCS',
							},
							{
								id: STATUS_BILL.CHOT_KE_TOAN,
								name: 'Chốt kế toán',
							},
						]}
					/>
					<FilterCustom
						isSearch
						name='Trạm cân'
						query='_scalesStationUuid'
						listFilter={listScalesStation?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>
					<SelectFilterState
						uuid={uuidQuality}
						setUuid={setUuidQuality}
						listData={listQuality?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Quốc gia'
					/>
					<SelectFilterState
						uuid={uuidStorage}
						setUuid={setUuidStorage}
						listData={listStorage?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Bãi'
					/>
					<SelectFilterState
						uuid={isHaveDryness}
						setUuid={setIsHaveDryness}
						listData={[
							{
								uuid: String(0),
								name: 'Chưa có',
							},
							{
								uuid: String(1),
								name: 'Đã có',
							},
						]}
						placeholder='Độ khô'
					/>
					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div>
				</div>
				<div className={styles.btn}>
					<Button
						rounded_2
						w_fit
						p_8_16
						green
						bold
						onClick={() => {
							setOpenExportExcel(true);
						}}
					>
						Xuất excel
					</Button>
				</div>
			</div>
			<div className={clsx('mt')}>
				<div className={styles.parameter}>
					<div>
						TỔNG LƯỢNG HÀNG TƯƠI:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertWeight(getListBatch?.data?.amountMt) || 0} </span>(Tấn)
					</div>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listBatchBill || []}
					loading={getListBatch?.isFetching}
					noti={<Noti des='Hiện tại chưa có phiếu cân nào, thêm ngay?' disableButton />}
				>
					<Table
						data={listBatchBill || []}
						onSetData={setListBatchBill}
						column={[
							{
								title: 'STT',
								render: (data: ITableBillScale, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: ITableBillScale) => (
									<>
										{data?.isBatch == TYPE_BATCH.KHONG_CAN ? (
											<Link href={`/nhap-xuat-ngoai/${data.uuid}`} className={styles.link}>
												{data?.code}
											</Link>
										) : (
											<Link href={`/phieu-can/${data.uuid}`} className={styles.link}>
												{data?.code}
											</Link>
										)}
									</>
								),
							},
							{
								title: 'Loại cân',
								render: (data: ITableBillScale) => (
									<p style={{fontWeight: 600}}>
										{data?.scalesType == TYPE_SCALES.CAN_NHAP && 'Cân nhập'}
										{data?.scalesType == TYPE_SCALES.CAN_XUAT && 'Cân xuất'}
										{data?.scalesType == TYPE_SCALES.CAN_DICH_VU && 'Cân dịch vụ'}
										{data?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO && 'Cân chuyển kho'}
										{data?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP && 'Cân xuất thẳng'}
									</p>
								),
							},

							{
								title: 'Từ(Tàu/Xe)',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>
											{data?.fromUu?.name || data?.customerName || '---'}
										</p>
										{data?.scalesType == TYPE_SCALES.CAN_XUAT && (
											<>
												{data?.isBatch == TYPE_BATCH.CAN_LO && (
													<p style={{fontWeight: 500, color: '#3772FF'}}>{'---'}</p>
												)}
												{data?.isBatch == TYPE_BATCH.CAN_LE && (
													<p style={{fontWeight: 500, color: '#3772FF'}}>{'---'}</p>
												)}
											</>
										)}
										{!(data?.scalesType == TYPE_SCALES.CAN_XUAT) && (
											<>
												{data?.isBatch == TYPE_BATCH.CAN_LO && (
													<p style={{fontWeight: 500, color: '#3772FF'}}>
														{data?.batchsUu?.shipUu?.licensePalate || '---'}
													</p>
												)}
												{data?.isBatch == TYPE_BATCH.CAN_LE && (
													<p style={{fontWeight: 500, color: '#3772FF'}}>
														{data?.weightSessionUu?.truckUu?.licensePalate || '---'}
													</p>
												)}
											</>
										)}
									</>
								),
							},
							{
								title: 'Đến',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
										{data?.scalesType == TYPE_SCALES.CAN_XUAT && (
											<p style={{fontWeight: 400, color: '#3772FF'}}>
												{data?.batchsUu?.shipUu?.licensePalate || '---'}
											</p>
										)}
										{!(data?.scalesType == TYPE_SCALES.CAN_XUAT) && (
											<p style={{fontWeight: 400, color: '#3772FF'}}>
												{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
											</p>
										)}

										{/* <p>({data?.toUu?.parentUu?.name || '---'})</p> */}
									</>
								),
							},
							{
								title: 'KL hàng (Tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weightTotal) || 0}</>,
							},
							{
								title: 'KL 1 (Tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weigth1) || 0}</>,
							},
							{
								title: 'KL 2 (Tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weigth2) || 0}</>,
							},
							{
								title: 'Cảng bốc dỡ',
								render: (data: ITableBillScale) => <>{data?.port || '---'}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: ITableBillScale) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Quy cách',
								render: (data: ITableBillScale) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'Phân loại',
								render: (data: ITableBillScale) => (
									<>
										{data?.isSift == TYPE_SIFT.CAN_SANG && 'Cần sàng'}
										{data?.isSift == TYPE_SIFT.KHONG_CAN_SANG && 'Không cần sàng'}
									</>
								),
							},
							{
								title: 'Tàu trung chuyển',
								render: (data: ITableBillScale) => <>{data?.shipTempUu?.licensePalate || '---'}</>,
							},
							{
								title: 'Xác nhận SL',
								render: (data: ITableBillScale) => (
									<StateActive
										stateActive={data?.state}
										listState={[
											{
												state: STATE_BILL.NOT_CHECK,
												text: 'Chưa duyệt',
												textColor: '#fff',
												backgroundColor: '#FF5C5C',
											},
											{
												state: STATE_BILL.QLK_REJECTED,
												text: 'QLK duyệt lại',
												textColor: '#fff',
												backgroundColor: '#FB923C',
											},
											{
												state: STATE_BILL.QLK_CHECKED,
												text: 'QLK đã duyệt',
												textColor: '#fff',
												backgroundColor: '#0EA5E9',
											},
											{
												state: STATE_BILL.KTK_REJECTED,
												text: 'KTK duyệt lại',
												textColor: '#fff',
												backgroundColor: '#FF6838',
											},
											{
												state: STATE_BILL.KTK_CHECKED,
												text: 'KTK đã duyệt',
												textColor: '#fff',
												backgroundColor: '#2A85FF',
											},
											{
												state: STATE_BILL.END,
												text: 'Kết thúc',
												textColor: '#fff',
												backgroundColor: '#9757D7',
											},
										]}
									/>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: ITableBillScale) => (
									<>
										{data?.isBatch == TYPE_BATCH.KHONG_CAN ? (
											<StateActive
												stateActive={data?.status}
												listState={[
													{
														state: STATUS_BILL.TAM_DUNG,
														text: 'Tạm dừng',
														textColor: '#F95B5B',
														backgroundColor: 'rgba(249, 91, 91, 0.10)',
													},
													{
														state: STATUS_BILL.DA_CAN_CHUA_KCS,
														text: 'Chưa KCS',
														textColor: '#2D74FF',
														backgroundColor: 'rgba(45, 116, 255, 0.10)',
													},
													{
														state: STATUS_BILL.DA_KCS,
														text: 'Đã KCS',
														textColor: '#41CD4F',
														backgroundColor: 'rgba(65, 205, 79, 0.1)',
													},
													{
														state: STATUS_BILL.CHOT_KE_TOAN,
														text: 'Chốt kế toán',
														textColor: '#0EA5E9',
														backgroundColor: 'rgba(14, 165, 233, 0.1)',
													},
												]}
											/>
										) : (
											<StateActive
												stateActive={data?.status}
												listState={[
													{
														state: STATUS_BILL.DANG_CAN,
														text: 'Đang cân',
														textColor: '#9757D7',
														backgroundColor: 'rgba(151, 87, 215, 0.10)',
													},
													{
														state: STATUS_BILL.TAM_DUNG,
														text: 'Tạm dừng',
														textColor: '#F95B5B',
														backgroundColor: 'rgba(249, 91, 91, 0.10)',
													},
													{
														state: STATUS_BILL.DA_CAN_CHUA_KCS,
														text: 'Đã cân chưa KCS',
														textColor: '#2D74FF',
														backgroundColor: 'rgba(45, 116, 255, 0.10)',
													},
													{
														state: STATUS_BILL.DA_KCS,
														text: 'Đã KCS',
														textColor: '#41CD4F',
														backgroundColor: 'rgba(65, 205, 79, 0.1)',
													},
													{
														state: STATUS_BILL.CHOT_KE_TOAN,
														text: 'Chốt kế toán',
														textColor: '#0EA5E9',
														backgroundColor: 'rgba(14, 165, 233, 0.1)',
													},
												]}
											/>
										)}
									</>
								),
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: ITableBillScale) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
										{/* Duyệt sản lượng */}
										{data?.isNeedConfirmReject == 1 ? (
											<IconCustom
												edit
												icon={<TickCircle size={22} fontWeight={600} />}
												tooltip='Xác nhận khối lượng tạp chất'
												color='#2CAE39'
												onClick={() => setUuidConfirm(data?.uuid)}
											/>
										) : null}
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				{!getListBatch.isFetching && (
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 200}
						total={total}
						dependencies={[
							_pageSize,
							_keyword,
							_isBatch,
							customerUuid,
							_productTypeUuid,
							_shipUuid,
							_status,
							_dateFrom,
							_dateTo,
							_state,
							uuidQuality,
							uuidStorage,
							_scalesStationUuid,
							isHaveDryness,
							truckUuid,
							uuidCompany,
						]}
					/>
				)}
			</div>

			<Popup open={openExportExcel} onClose={() => setOpenExportExcel(false)}>
				<FormAccessSpecExcel
					onAccess={() => {
						handleExportExcel(1);
					}}
					onClose={() => {
						setOpenExportExcel(false);
					}}
					onDeny={() => {
						handleExportExcel(0);
					}}
				/>
			</Popup>
			<Popup open={!!uuidConfirm} onClose={() => setUuidConfirm(null)}>
				<FormAccessWeighReject
					onAccess={() => {
						handleConfirm(1);
					}}
					onClose={() => {
						setUuidConfirm(null);
					}}
					onDeny={() => {
						handleConfirm(0);
					}}
				/>
			</Popup>
		</div>
	);
}

export default MainPageWeightReject;
