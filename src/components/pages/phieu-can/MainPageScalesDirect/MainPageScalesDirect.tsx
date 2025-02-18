import React, {useState} from 'react';

import {PropsMainPageScalesDirect} from './interfaces';
import styles from './MainPageScalesDirect.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATE_BILL,
	STATUS_BILL,
	TYPE_ACTION_AUDIT,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_SIFT,
} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import batchBillServices from '~/services/batchBillServices';
import {ITableBillScale} from '../MainPageScalesAll/interfaces';
import IconCustom from '~/components/common/IconCustom';
import {Eye, Play, SaveAdd, StopCircle} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import Link from 'next/link';
import {LuPencil} from 'react-icons/lu';
import shipServices from '~/services/shipServices';
import clsx from 'clsx';
import {convertWeight} from '~/common/funcs/optionConvert';
import Button from '~/components/common/Button';
import storageServices from '~/services/storageServices';
import StateActive from '~/components/common/StateActive';
import scalesStationServices from '~/services/scalesStationServices';
import Popup from '~/components/common/Popup';
import FormUpdateShipBill from '../../lenh-can/FormUpdateShipBill';
import FormAccessSpecExcel from '../MainDetailScales/components/FormAccessSpecExcel';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import truckServices from '~/services/truckServices';

function MainPageScalesDirect({}: PropsMainPageScalesDirect) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isHaveDryness, setIsHaveDryness] = useState<string>('');
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [truckUuid, setTruckUuid] = useState<string[]>([]);

	const {
		_page,
		_pageSize,
		_keyword,
		_isBatch,
		_productTypeUuid,
		_shipUuid,
		_status,
		_dateFrom,
		_dateTo,
		_state,
		_storageUuid,
		_scalesStationUuid,
	} = router.query;

	const [uuidPlay, setUuidPlay] = useState<string>('');
	const [uuidStop, setUuidStop] = useState<string>('');
	const [billUuidUpdateShip, setBillUuidUpdateShip] = useState<string | null>(null);
	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [listBatchBill, setListBatchBill] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);

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
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					partnerUUid: '',
					userUuid: '',
					status: null,
					typeCus: null,
					provinceId: '',
					specUuid: '',
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

	const getListBatch = useQuery(
		[
			QUERY_KEY.table_phieu_can_xuat_thang,
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
			_storageUuid,
			_scalesStationUuid,
			isHaveDryness,
			truckUuid,
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
						scalesType: [TYPE_SCALES.CAN_TRUC_TIEP],
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						isCreateBatch: null,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
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
						qualityUuid: '',
						transportType: null,
						shipUuid: (_shipUuid as string) || '',
						typeCheckDay: 0,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						storageUuid: (_storageUuid as string) || '',
						isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
						truckUuid: truckUuid,
						customerUuid: '',
						listCustomerUuid: customerUuid,
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

	const funcStartBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Bắt đầu lệnh cân thành công!',
				http: batchBillServices.startBatchbill({
					uuid: uuidPlay,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidPlay('');
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_xuat_thang]);
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const funcStopBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Kết thúc lệnh cân thành công!',
				http: batchBillServices.stopBatchbill({
					uuid: uuidStop,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidStop('');
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_xuat_thang]);
			}
		},
		onError(error) {
			console.log({error});
		},
	});

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
					scalesType: [TYPE_SCALES.CAN_TRUC_TIEP],
					customerUuid: '',
					listCustomerUuid: customerUuid,
					isBatch: !!_isBatch ? Number(_isBatch) : null,
					isCreateBatch: null,
					productTypeUuid: (_productTypeUuid as string) || '',
					specificationsUuid: '',
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
					qualityUuid: '',
					transportType: null,
					shipUuid: (_shipUuid as string) || '',
					typeCheckDay: 0,
					scalesStationUuid: (_scalesStationUuid as string) || '',
					documentId: '',
					storageUuid: (_storageUuid as string) || '',
					isExportSpec: isHaveSpec,
					isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
					truckUuid: truckUuid,
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

	return (
		<div className={styles.container}>
			<Loading loading={funcStartBatchBill.isLoading || funcStopBatchBill.isLoading || exportExcel.isLoading} />
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
					<FilterCustom
						isSearch
						name='Bãi'
						query='_storageUuid'
						listFilter={listStorage?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
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
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.fromUu?.name || data?.customerName}</p>
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
									</>
								),
							},

							{
								title: 'Kiểu cân',
								render: (data: ITableBillScale) => (
									<>
										{data?.isBatch == TYPE_BATCH.CAN_LO && 'Cân lô'}
										{data?.isBatch == TYPE_BATCH.CAN_LE && 'Cân lẻ'}
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
										{/* Bắt đầu cân */}
										{data?.status == STATUS_BILL.CHUA_CAN || data?.status == STATUS_BILL.TAM_DUNG ? (
											<IconCustom
												edit
												icon={<Play size={22} fontWeight={600} />}
												tooltip='Bắt đầu cân'
												color='#777E90'
												onClick={() => setUuidPlay(data?.uuid)}
											/>
										) : null}

										{/* Kết thúc phiên cân */}
										{data?.status == STATUS_BILL.DANG_CAN || data?.status == STATUS_BILL.TAM_DUNG ? (
											<IconCustom
												edit
												icon={<StopCircle size={22} fontWeight={600} />}
												tooltip='Kết thúc cân'
												color='#D95656'
												onClick={() => setUuidStop(data?.uuid)}
											/>
										) : null}

										{/* Cập nhật tàu trung chuyển */}
										{data?.isBatch == TYPE_BATCH.CAN_LO || data?.isBatch == TYPE_BATCH.KHONG_CAN ? (
											<IconCustom
												edit
												icon={<SaveAdd fontSize={20} fontWeight={600} />}
												tooltip='Cập nhật tàu trung chuyển'
												color='#777E90'
												onClick={() => setBillUuidUpdateShip(data.uuid)}
											/>
										) : null}

										{/* Chỉnh sửa phiếu */}
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											href={
												data?.isBatch == TYPE_BATCH.KHONG_CAN
													? `/nhap-xuat-ngoai/chinh-sua-xuat-thang?_id=${data.uuid}`
													: `/phieu-can/chinh-sua-phieu-xuat-thang?_id=${data.uuid}`
											}
										/>

										{/* Xem chi tiết */}
										<IconCustom
											edit
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={
												data?.isBatch == TYPE_BATCH.KHONG_CAN
													? `/nhap-xuat-ngoai/${data.uuid}`
													: `/phieu-can/${data.uuid}`
											}
										/>
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
							_storageUuid,
							_scalesStationUuid,
							isHaveDryness,
							truckUuid,
						]}
					/>
				)}
			</div>

			<Dialog
				open={!!uuidPlay}
				title='Bắt đầu cân'
				note='Bạn có muốn thực hiện thao tác cân cho phiếu cân này không?'
				onClose={() => setUuidPlay('')}
				onSubmit={funcStartBatchBill.mutate}
			/>
			<Dialog
				danger
				open={!!uuidStop}
				title='Kết thúc cân'
				note='Bạn có muốn thực hiện thao tác kết thúc cho phiếu cân này không?'
				onClose={() => setUuidStop('')}
				onSubmit={funcStopBatchBill.mutate}
			/>

			{/* Cập nhật tàu trung chuyển */}
			<Popup open={!!billUuidUpdateShip} onClose={() => setBillUuidUpdateShip(null)}>
				<FormUpdateShipBill uuid={billUuidUpdateShip} onClose={() => setBillUuidUpdateShip(null)} />
			</Popup>

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
		</div>
	);
}

export default MainPageScalesDirect;
