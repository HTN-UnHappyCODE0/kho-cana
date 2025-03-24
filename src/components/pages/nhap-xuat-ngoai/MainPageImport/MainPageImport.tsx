import React, {useEffect, useState} from 'react';

import {PropsMainPageImport} from './interfaces';
import styles from './MainPageImport.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import {Eye, SaveAdd} from 'iconsax-react';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import Moment from 'react-moment';
import {convertWeight} from '~/common/funcs/optionConvert';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATE_BILL,
	STATUS_BILL,
	STATUS_CUSTOMER,
	TYPE_ACTION_AUDIT,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import Link from 'next/link';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Button from '~/components/common/Button';
import Image from 'next/image';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import Search from '~/components/common/Search';
import {useRouter} from 'next/router';
import icons from '~/constants/images/icons';
import batchBillServices from '~/services/batchBillServices';
import {httpRequest} from '~/services';
import {useMutation, useQuery} from '@tanstack/react-query';
import FilterCustom from '~/components/common/FilterCustom';
import shipServices from '~/services/shipServices';
import wareServices from '~/services/wareServices';
import storageServices from '~/services/storageServices';
import customerServices from '~/services/customerServices';
import {clsx} from 'clsx';
import StateActive from '~/components/common/StateActive';
import Popup from '~/components/common/Popup';
import FormAccessSpecExcel from '../../phieu-can/MainDetailScales/components/FormAccessSpecExcel';
import FormUpdateShipBill from '../../lenh-can/FormUpdateShipBill';
import Loading from '~/components/common/Loading';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import truckServices from '~/services/truckServices';
import companyServices from '~/services/companyServices';

function MainPageImport({}: PropsMainPageImport) {
	const router = useRouter();
	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [billUuidUpdateShip, setBillUuidUpdateShip] = useState<string | null>(null);
	const [isHaveDryness, setIsHaveDryness] = useState<string>('');
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [truckUuid, setTruckUuid] = useState<string[]>([]);
	const [uuidCompany, setUuidCompany] = useState<string>('');
	const [uuidQuality, setUuidQuality] = useState<string>('');
	const [uuidStorage, setUuidStorage] = useState<string>('');
	const [listCompanyUuid, setListCompanyUuid] = useState<any[]>([]);

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

	const {_page, _pageSize, _keyword, _dateFrom, _dateTo, _isBatch, _state, _status, _productTypeUuid, _shipUuid, _scalesStationUuid} =
		router.query;

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

	const listBill = useQuery(
		[
			QUERY_KEY.table_phieu_can_tat_ca,
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
			listCompanyUuid,
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
						scalesType: [TYPE_SCALES.CAN_NHAP],
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
						isBatch: TYPE_BATCH.KHONG_CAN,
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
						companyUuid: uuidCompany,
						listCompanyUuid: listCompanyUuid,
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang, listCompanyUuid], {
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
					status: STATUS_CUSTOMER.HOP_TAC,
					typeCus: null,
					provinceId: '',
					specUuid: '',
					companyUuid: '',
					listCompanyUuid: listCompanyUuid,
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
					scalesType: [TYPE_SCALES.CAN_NHAP],
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
					isBatch: TYPE_BATCH.KHONG_CAN,
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
					documentId: '',
					isExportSpec: isHaveSpec,
					isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
					truckUuid: truckUuid,
					companyUuid: uuidCompany,
					listCompanyUuid: listCompanyUuid,
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
		if (listCompanyUuid) {
			setCustomerUuid([]);
		}
		if (uuidQuality) {
			setUuidStorage('');
		}
	}, [listCompanyUuid, uuidQuality]);
	return (
		<div className={styles.container}>
			<Loading loading={exportExcel.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lô hàng' />
					</div>
					<SelectFilterMany
						selectedIds={listCompanyUuid}
						setSelectedIds={setListCompanyUuid}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Kv cảng xuất khẩu'
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
								id: STATUS_BILL.TAM_DUNG,
								name: 'Tạm dừng',
							},
							{
								id: STATUS_BILL.DA_CAN_CHUA_KCS,
								name: 'Chưa KCS',
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
					<div>
						<Button
							rounded_2
							w_fit
							p_8_16
							bold
							href={'/nhap-xuat-ngoai/them-moi-nhap'}
							icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
						>
							Tạo phiếu
						</Button>
					</div>
				</div>
			</div>
			<div className={clsx('mt')}>
				<div className={styles.parameter}>
					<div>
						TỔNG LƯỢNG HÀNG TƯƠI:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertWeight(listBill?.data?.amountMt) || 0} </span>(Tấn)
					</div>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					loading={listBill?.isLoading}
					data={listBill?.data?.items || []}
					noti={<Noti des='Hiện tại chưa có dữ liệu nào!' disableButton />}
				>
					<Table
						data={listBill?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},

							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: any) => (
									<Link href={`/nhap-xuat-ngoai/${data.uuid}`} className={styles.link}>
										{data?.code}
									</Link>
								),
							},
							{
								title: 'Loại cân',
								render: (data: any) => (
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
								title: 'Vận chuyển',
								render: (data: any) => (
									<>
										{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
										{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
									</>
								),
							},
							{
								title: 'Từ (Tàu/Xe)',
								render: (data: any) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.fromUu?.name || data?.customerName}</p>
										{data?.scalesType == TYPE_SCALES.CAN_XUAT && (
											<>
												<p style={{fontWeight: 500, color: '#3772FF'}}>{'---'}</p>
											</>
										)}
										{!(data?.scalesType == TYPE_SCALES.CAN_XUAT) && (
											<>
												<p style={{fontWeight: 500, color: '#3772FF'}}>
													{data?.batchsUu?.shipUu?.licensePalate || '---'}
												</p>
											</>
										)}
									</>
								),
							},
							{
								title: 'Đến',
								render: (data: any) => (
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
										{/* <p style={{fontWeight: 600, color: '#3772FF'}}>
											{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
										</p> */}
									</>
								),
							},

							{
								title: 'Quy cách',
								render: (data: any) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'KL 1 (Tấn)',
								render: (data: any) => <>{convertWeight(data?.weigth1)}</>,
							},
							{
								title: 'KL 2 (Tấn)',
								render: (data: any) => <>{convertWeight(data?.weigth2)}</>,
							},
							{
								title: 'KL tươi (Tấn)',
								render: (data: any) => <>{convertWeight(data?.weightTotal) || 0}</>,
							},
							{
								title: 'Ngày bắt đầu',
								render: (data: any) => (
									<>{data?.timeStart ? <Moment date={data?.timeStart} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: 'Ngày kết thúc',
								render: (data: any) => <>{data?.timeEnd ? <Moment date={data?.timeEnd} format='DD/MM/YYYY' /> : '---'}</>,
							},
							{
								title: 'Tàu trung chuyển',
								render: (data: any) => <>{data?.shipTempUu?.licensePalate || '---'}</>,
							},
							{
								title: 'Xác nhận SL',
								render: (data: any) => (
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
								render: (data: any) => (
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
								render: (data: any) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
										{data?.isBatch == TYPE_BATCH.CAN_LO || data?.isBatch == TYPE_BATCH.KHONG_CAN ? (
											<IconCustom
												edit
												icon={<SaveAdd fontSize={20} fontWeight={600} />}
												tooltip='Cập nhật tàu trung chuyển'
												color='#777E90'
												onClick={() => setBillUuidUpdateShip(data.uuid)}
											/>
										) : null}
										<IconCustom
											edit
											icon={<LuPencil size={22} fontWeight={600} />}
											tooltip='chỉnh sửa nhập'
											color='#777E90'
											href={`/nhap-xuat-ngoai/chinh-sua-nhap?_id=${data.uuid}`}
										/>

										<IconCustom
											edit
											icon={<Eye size={22} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={`/nhap-xuat-ngoai/${data.uuid}`}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>

				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={listBill?.data?.pagination?.totalCount}
					dependencies={[
						_pageSize,
						_keyword,
						_dateFrom,
						_dateTo,
						_isBatch,
						_state,
						_status,
						customerUuid,
						_productTypeUuid,
						_shipUuid,
						uuidQuality,
						uuidStorage,
						_scalesStationUuid,
						isHaveDryness,
						truckUuid,
						uuidCompany,
						listCompanyUuid,
					]}
				/>
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

			<Popup open={!!billUuidUpdateShip} onClose={() => setBillUuidUpdateShip(null)}>
				<FormUpdateShipBill uuid={billUuidUpdateShip} onClose={() => setBillUuidUpdateShip(null)} />
			</Popup>
		</div>
	);
}

export default MainPageImport;
