import React, {useEffect, useState} from 'react';

import {ITableBillScale, PropsPageConfirmBill} from './interfaces';
import styles from './PageConfirmBill.module.scss';
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
} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import wareServices from '~/services/wareServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Link from 'next/link';
import Pagination from '~/components/common/Pagination';
import batchBillServices from '~/services/batchBillServices';
import IconCustom from '~/components/common/IconCustom';
import {Eye, TickCircle} from 'iconsax-react';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import {convertWeight} from '~/common/funcs/optionConvert';
import scalesStationServices from '~/services/scalesStationServices';
import storageServices from '~/services/storageServices';
import StateActive from '~/components/common/StateActive';
import Moment from 'react-moment';
import Popup from '~/components/common/Popup';
import FormAccessSpecExcel from '../../phieu-can/MainDetailScales/components/FormAccessSpecExcel';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import truckServices from '~/services/truckServices';
import companyServices from '~/services/companyServices';

function PageConfirmBill({}: PropsPageConfirmBill) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isHaveDryness, setIsHaveDryness] = useState<string>('');
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [truckUuid, setTruckUuid] = useState<string[]>([]);
	const [uuidQuality, setUuidQuality] = useState<string>('');
	const [uuidStorage, setUuidStorage] = useState<string>('');
	const {_page, _pageSize, _keyword, _isBatch, _productTypeUuid, _state, _dateFrom, _dateTo, _scalesStationUuid} = router.query;

	const [uuidQLKConfirm, setUuidQLKConfirm] = useState<string[]>([]);
	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [listBatchBill, setListBatchBill] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [uuidCompany, setUuidCompany] = useState<string>('');

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

	const listStorage = useQuery([QUERY_KEY.table_bai, uuidQuality], {
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
					qualityUuid: uuidQuality,
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

	const getListBatch = useQuery(
		[
			QUERY_KEY.table_qlk_duyet_phieu,
			_page,
			_pageSize,
			_keyword,
			_isBatch,
			_productTypeUuid,
			_state,
			_dateFrom,
			_dateTo,
			_scalesStationUuid,
			uuidStorage,
			isHaveDryness,
			customerUuid,
			truckUuid,
			uuidCompany,
			uuidQuality,
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
						isDescending: CONFIG_DESCENDING.IS_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						isCreateBatch: null,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: [STATUS_BILL.DA_CAN_CHUA_KCS, STATUS_BILL.DA_KCS, STATUS_BILL.CHOT_KE_TOAN],
						state: !!_state
							? [Number(_state)]
							: [STATE_BILL.QLK_CHECKED, STATE_BILL.KTK_REJECTED, STATE_BILL.KTK_CHECKED, STATE_BILL.END],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						warehouseUuid: '',
						qualityUuid: uuidQuality,
						transportType: null,
						typeCheckDay: 1,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						storageUuid: uuidStorage,
						isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
						truckUuid: truckUuid,
						customerUuid: '',
						listCustomerUuid: customerUuid,
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
				if (data) {
					return data;
				}
			},
		}
	);

	const funcQLKConfirmBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'QLK duyệt sản lượng thành công!',
				http: batchBillServices.QLKConfirmBatchbill({
					uuid: uuidQLKConfirm,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidQLKConfirm([]);
				queryClient.invalidateQueries([QUERY_KEY.table_qlk_duyet_phieu]);
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
					isDescending: CONFIG_DESCENDING.IS_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
					customerUuid: '',
					listCustomerUuid: customerUuid,
					isBatch: !!_isBatch ? Number(_isBatch) : null,
					isCreateBatch: null,
					productTypeUuid: (_productTypeUuid as string) || '',
					specificationsUuid: '',
					status: [STATUS_BILL.DA_CAN_CHUA_KCS, STATUS_BILL.DA_KCS, STATUS_BILL.CHOT_KE_TOAN],
					state: !!_state
						? [Number(_state)]
						: [STATE_BILL.QLK_CHECKED, STATE_BILL.KTK_REJECTED, STATE_BILL.KTK_CHECKED, STATE_BILL.END],
					timeStart: _dateFrom ? (_dateFrom as string) : null,
					timeEnd: _dateTo ? (_dateTo as string) : null,
					warehouseUuid: '',
					qualityUuid: uuidQuality,
					transportType: null,
					typeCheckDay: 1,
					scalesStationUuid: (_scalesStationUuid as string) || '',
					documentId: '',
					shipUuid: '',
					storageUuid: uuidStorage,
					isExportSpec: isHaveSpec,
					isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
					truckUuid: truckUuid,
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
			<Loading loading={funcQLKConfirmBatchBill.isLoading || exportExcel.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					{listBatchBill?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								primary
								p_4_12
								onClick={() => {
									setUuidQLKConfirm(listBatchBill?.filter((v) => v.isChecked !== false)?.map((x: any) => x.uuid));
								}}
							>
								QLK duyệt sản lượng
							</Button>
						</div>
					)}

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
					{/* <FilterCustom
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
						]}
					/> */}
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
						placeholder='Chất lượng'
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
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.YESTERDAY} />
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
					<div>
						TỔNG LƯỢNG HÀNG KHÔ:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertWeight(getListBatch?.data?.amountBdmt) || 0} </span>(Tấn)
					</div>
					<div>
						TỔNG LƯỢNG QUY KHÔ TẠM TÍNH:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertWeight(getListBatch?.data?.amountDemo) || 0} </span>(Tấn)
					</div>
					<div>
						TỔNG LƯỢNG QUY KHÔ CHUẨN:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertWeight(getListBatch?.data?.amountKCS) || 0} </span>(Tấn)
					</div>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listBatchBill || []}
					loading={getListBatch?.isFetching}
					noti={<Noti des='Hiện tại chưa có lô nào!' disableButton />}
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
								title: 'Mã lô/Số phiếu',
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
										<p style={{fontWeight: 500, color: '#3772FF'}}>{data?.weightSessionUu?.code || '---'}</p>
									</>
								),
							},
							{
								title: 'Loại cân/ Thời gian kết thúc',
								render: (data: ITableBillScale) => (
									<>
										<p style={{fontWeight: 600}}>
											{data?.scalesType == TYPE_SCALES.CAN_NHAP && 'Cân nhập'}
											{data?.scalesType == TYPE_SCALES.CAN_XUAT && 'Cân xuất'}
											{data?.scalesType == TYPE_SCALES.CAN_DICH_VU && 'Cân dịch vụ'}
											{data?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO && 'Cân chuyển kho'}
											{data?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP && 'Cân xuất thẳng'}
										</p>
										<p style={{fontWeight: 500, color: '#3772FF'}}>
											<Moment date={data?.timeEnd} format='HH:mm - DD/MM/YYYY' />
										</p>
									</>
								),
							},
							// {
							// 	title: 'Mã tàu',
							// 	render: (data: ITableBillScale) => (
							// 		<p style={{fontWeight: 600}}>{data?.batchsUu?.shipUu?.licensePalate || '---'}</p>
							// 	),
							// },
							// {
							// 	title: 'Mã tàu xuất',
							// 	render: (data: ITableBillScale) => (
							// 		<p style={{fontWeight: 600}}>{data?.batchsUu?.shipOutUu?.licensePalate || '---'}</p>
							// 	),
							// },
							{
								title: 'Từ (Tàu/Xe)',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.fromUu?.name || data?.customerName}</p>
										{data?.isBatch == TYPE_BATCH.CAN_LO && (
											<p style={{fontWeight: 600, color: '#3772FF'}}>
												{data?.batchsUu?.shipUu?.licensePalate || '---'}
											</p>
										)}
										{data?.isBatch == TYPE_BATCH.CAN_LE && (
											<p style={{fontWeight: 600, color: '#3772FF'}}>
												{data?.weightSessionUu?.truckUu?.licensePalate || '---'}
											</p>
										)}
									</>
								),
							},
							{
								title: 'Loại hàng',
								render: (data: ITableBillScale) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'KL tươi (Tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weightTotal) || 0}</>,
							},
							{
								title: 'Độ khô (%)',
								render: (data: ITableBillScale) => <>{data?.drynessAvg?.toFixed(2) || 0}</>,
							},
							{
								title: 'KL quy khô (Tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weightBdmt) || 0}</>,
							},
							{
								title: 'Quy cách',
								render: (data: ITableBillScale) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'KL 1 (Tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weigth1)}</>,
							},
							{
								title: 'KL 2 (Tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weigth2)}</>,
							},

							{
								title: 'Đến',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
										<p style={{fontWeight: 600, color: '#3772FF'}}>
											{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
										</p>
									</>
								),
							},
							// {
							// 	title: 'Phân loại',
							// 	render: (data: ITableBillScale) => (
							// 		<>
							// 			{data?.isSift == TYPE_SIFT.CAN_SANG && 'Cần sàng'}
							// 			{data?.isSift == TYPE_SIFT.KHONG_CAN_SANG && 'Không cần sàng'}
							// 		</>
							// 	),
							// },
							{
								title: 'Số chứng từ',
								render: (data: ITableBillScale) => <>{data?.documentId || '---'}</>,
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
								),
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: ITableBillScale) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
										{/* Duyệt sản lượng */}
										{data?.status >= STATUS_BILL.DA_CAN_CHUA_KCS && data.state <= STATE_BILL.QLK_REJECTED ? (
											<IconCustom
												edit
												icon={<TickCircle size={22} fontWeight={600} />}
												tooltip='QLK duyệt'
												color='#2CAE39'
												onClick={() => setUuidQLKConfirm([data?.uuid])}
											/>
										) : null}

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
							customerUuid,
							_isBatch,
							_productTypeUuid,
							_state,
							_dateFrom,
							_dateTo,
							_scalesStationUuid,
							uuidStorage,
							isHaveDryness,
							truckUuid,
							uuidCompany,
							uuidQuality,
						]}
					/>
				)}
			</div>
			{/* Quản lý kho duyệt */}
			<Dialog
				danger
				open={uuidQLKConfirm.length > 0}
				title='QLK duyệt sản lượng'
				note='Bạn có muốn thực hiện thao tác duyệt sản lượng cho phiếu cân này không?'
				onClose={() => setUuidQLKConfirm([])}
				onSubmit={funcQLKConfirmBatchBill.mutate}
			/>

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

export default PageConfirmBill;
