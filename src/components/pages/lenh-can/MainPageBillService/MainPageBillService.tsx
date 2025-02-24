import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {PropsMainPageBillService} from './interfaces';
import styles from './MainPageBillService.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_BILL,
	STATUS_CUSTOMER,
	TYPE_ACTION_AUDIT,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import Moment from 'react-moment';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {Eye, Play, RefreshSquare, SaveAdd, Trash} from 'iconsax-react';
import {IDataBill} from '../MainPageBillAll/interfaces';
import Link from 'next/link';
import PopupDeleteBill from '../PopupDeleteBill';
import Popup from '~/components/common/Popup';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import batchBillServices from '~/services/batchBillServices';
import shipServices from '~/services/shipServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import {convertWeight} from '~/common/funcs/optionConvert';
import storageServices from '~/services/storageServices';
import scalesStationServices from '~/services/scalesStationServices';
import FormUpdateShipBill from '../FormUpdateShipBill';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import truckServices from '~/services/truckServices';
import companyServices from '~/services/companyServices';

function MainPageBillService({}: PropsMainPageBillService) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [uuidPlay, setUuidPlay] = useState<string>('');
	const [isHaveDryness, setIsHaveDryness] = useState<string>('');
	const [truckUuid, setTruckUuid] = useState<string[]>([]);

	const {_page, _pageSize, _keyword, _productTypeUuid, _shipUuid, _status, _scalesStationUuid, _dateFrom, _dateTo} = router.query;

	const [billUuid, setBilldUuid] = useState<string | null>(null);
	const [billUuidUpdateShip, setBillUuidUpdateShip] = useState<string | null>(null);
	const [billUuidReStart, setBillUuidReStart] = useState<string | null>(null);
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
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

	const listBatch = useQuery(
		[
			QUERY_KEY.table_lenh_can_dich_vu,
			_page,
			_pageSize,
			_keyword,
			customerUuid,
			_productTypeUuid,
			_shipUuid,
			_status,
			_dateFrom,
			_dateTo,
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
						scalesType: [TYPE_SCALES.CAN_DICH_VU],
						isBatch: TYPE_BATCH.CAN_LO,
						isCreateBatch: 1,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: !!_status ? (_status as string)?.split(',')?.map((v: string) => Number(v)) : [],
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
				queryClient.invalidateQueries([QUERY_KEY.table_lenh_can_dich_vu]);
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const funcReStartBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tiếp tục lệnh cân thành công!',
				http: batchBillServices.reStartBatchbill({
					uuid: billUuidReStart!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setBillUuidReStart('');
				queryClient.invalidateQueries([QUERY_KEY.table_lenh_can_dich_vu]);
			}
		},
		onError(error) {
			console.log({error});
		},
	});
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
			<Loading loading={funcStartBatchBill.isLoading || funcReStartBatchBill.isLoading} />
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

					<FilterCustom
						isSearch
						name='Trạng thái'
						query='_status'
						listFilter={[
							{
								id: STATUS_BILL.DA_HUY,
								name: 'Đã hủy bỏ',
							},
							{
								id: STATUS_BILL.CHUA_CAN,
								name: 'Chưa xử lý',
							},
							{
								id: `${STATUS_BILL.DANG_CAN}, ${STATUS_BILL.TAM_DUNG}`,
								name: 'Đang xử lý',
							},
							{
								id: `${STATUS_BILL.DA_CAN_CHUA_KCS}, ${STATUS_BILL.DA_KCS}, ${STATUS_BILL.CHOT_KE_TOAN}`,
								name: 'Đã hoàn thành',
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

				<div>
					<Button
						href={'/lenh-can/them-lenh-dich-vu'}
						p_8_16
						icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
						rounded_2
					>
						Tạo lệnh cân
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listBatch?.data?.items || []}
					loading={listBatch?.isLoading}
					noti={
						<Noti
							titleButton='Tạo lệnh cân'
							onClick={() => router.push('/lenh-can/them-lenh-dich-vu')}
							des='Hiện tại chưa có lệnh cân nào, thêm ngay?'
						/>
					}
				>
					<Table
						data={listBatch?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IDataBill, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô hàng',
								fixedLeft: true,
								render: (data: IDataBill) => (
									<Link href={`/lenh-can/${data.uuid}`} className={styles.link}>
										{data?.code || '---'}
									</Link>
								),
							},
							{
								title: 'Từ(Tàu/Xe)',
								render: (data: IDataBill) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>
											{data?.fromUu?.name || data?.customerName || '---'}
										</p>
										{data?.scalesType == TYPE_SCALES.CAN_XUAT && (
											<p style={{fontWeight: 400, color: '#3772FF'}}>{'---'}</p>
										)}
										{!(data?.scalesType == TYPE_SCALES.CAN_XUAT) && (
											<p style={{fontWeight: 400, color: '#3772FF'}}>
												{data?.batchsUu?.shipUu?.licensePalate || '---'}
											</p>
										)}
									</>
								),
							},
							{
								title: 'Đến',
								render: (data: IDataBill) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
										{
											data?.scalesType == TYPE_SCALES.CAN_XUAT &&
												(data?.isBatch == TYPE_BATCH.CAN_LO ? (
													<p style={{fontWeight: 400, color: '#3772FF'}}>
														{data?.numShip || '---'} . {data?.batchsUu?.shipUu?.licensePalate || '---'}
													</p>
												) : (
													<p style={{fontWeight: 400, color: '#3772FF'}}>
														{data?.batchsUu?.shipUu?.licensePalate || '---'}
													</p>
												))
											// (
											// 	<p style={{fontWeight: 400, color: '#3772FF'}}>
											// 		{data?.batchsUu?.shipUu?.licensePalate || '---'}
											// 	</p>
											// )
										}
										{
											!(data?.scalesType == TYPE_SCALES.CAN_XUAT) &&
												(data?.isBatch == TYPE_BATCH.CAN_LO ? (
													<p style={{fontWeight: 400, color: '#3772FF'}}>
														{data?.numShip || '---'} . {data?.batchsUu?.shipOutUu?.licensePalate || '---'}
													</p>
												) : (
													<p style={{fontWeight: 400, color: '#3772FF'}}>
														{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
													</p>
												))
											// (
											// 	<p style={{fontWeight: 400, color: '#3772FF'}}>
											// 		{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
											// 	</p>
											// )
										}
									</>
								),
							},
							{
								title: 'KL dự kiến (Tấn)',
								render: (data: IDataBill) => <>{convertCoin(data?.batchsUu?.weightIntent) || 0}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: IDataBill) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Tổng KL (Tấn)',
								render: (data: IDataBill) => <>{convertWeight(data?.weightTotal) || 0}</>,
							},
							{
								title: 'KL 1 (Tấn)',
								render: (data: IDataBill) => <>{convertWeight(data?.weigth1) || 0}</>,
							},
							{
								title: 'KL 2 (Tấn)',
								render: (data: IDataBill) => <>{convertWeight(data?.weigth2) || 0}</>,
							},
							{
								title: 'Cảng bốc dỡ',
								render: (data: IDataBill) => <>{data?.port || '---'}</>,
							},
							{
								title: 'Trạm cân',
								render: (data: IDataBill) => <>{data?.scalesStationUu?.name || '---'}</>,
							},
							{
								title: 'Loại cân',
								render: (data: IDataBill) => (
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
								title: 'Tàu trung chuyển',
								render: (data: IDataBill) => <>{data?.shipTempUu?.licensePalate || '---'}</>,
							},
							{
								title: 'Ngày dự kiến',
								render: (data: IDataBill) => (
									<>
										{data?.batchsUu?.timeIntend ? (
											<Moment date={data?.batchsUu?.timeIntend} format='DD/MM/YYYY' />
										) : (
											'---'
										)}
									</>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: IDataBill) => (
									<>
										{data?.status == STATUS_BILL.DA_HUY && <span style={{color: '#D94212'}}>Đã hủy bỏ</span>}
										{data?.status == STATUS_BILL.CHUA_CAN && <span style={{color: '#3772FF'}}>Chưa xử lý</span>}
										{(data?.status == STATUS_BILL.DANG_CAN || data?.status == STATUS_BILL.TAM_DUNG) && (
											<span style={{color: '#9757D7'}}>Đang xử lý</span>
										)}
										{data?.status >= STATUS_BILL.DA_CAN_CHUA_KCS && (
											<span style={{color: '#2CAE39'}}>Đã hoàn thành</span>
										)}
									</>
								),
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IDataBill) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
										{data?.status == STATUS_BILL.CHUA_CAN || data?.status == STATUS_BILL.TAM_DUNG ? (
											<IconCustom
												edit
												icon={<Play size={22} fontWeight={600} />}
												tooltip='Bắt đầu cân'
												color='#777E90'
												onClick={() => setUuidPlay(data?.uuid)}
											/>
										) : null}
										{data?.status < STATUS_BILL.DA_CAN_CHUA_KCS && data?.status != STATUS_BILL.DA_HUY ? (
											<IconCustom
												edit
												icon={<LuPencil fontSize={20} fontWeight={600} />}
												tooltip='Chỉnh sửa'
												color='#777E90'
												href={`/lenh-can/chinh-sua-lenh-dich-vu?_id=${data.uuid}`}
											/>
										) : null}
										{data?.status == STATUS_BILL.CHUA_CAN && (
											<IconCustom
												lock
												icon={<Trash size='22' />}
												tooltip={'Hủy phiếu'}
												color='#777E90'
												onClick={() => setBilldUuid(data.uuid)}
											/>
										)}
										{data?.status == STATUS_BILL.DA_CAN_CHUA_KCS && (
											<IconCustom
												edit
												icon={<RefreshSquare fontSize={20} fontWeight={600} />}
												tooltip='Tiếp tục cân'
												color='#777E90'
												onClick={() => setBillUuidReStart(data.uuid)}
											/>
										)}
										<IconCustom
											edit
											icon={<SaveAdd fontSize={20} fontWeight={600} />}
											tooltip='Cập nhật tàu trung chuyển'
											color='#777E90'
											onClick={() => setBillUuidUpdateShip(data.uuid)}
										/>
										<IconCustom
											edit
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={`/lenh-can/${data.uuid}`}
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
					total={listBatch?.data?.pagination?.totalCount}
					dependencies={[
						_pageSize,
						_keyword,
						customerUuid,
						_productTypeUuid,
						_shipUuid,
						_status,
						_dateFrom,
						_dateTo,
						uuidQuality,
						uuidStorage,
						_scalesStationUuid,
						isHaveDryness,
						truckUuid,
						uuidStorage,
						listCompanyUuid,
					]}
				/>
			</div>
			<Dialog
				open={!!uuidPlay}
				title='Bắt đầu cân'
				note='Bạn có muốn thực hiện thao tác cân cho phiếu cân này không?'
				onClose={() => setUuidPlay('')}
				onSubmit={funcStartBatchBill.mutate}
			/>
			<Dialog
				open={!!billUuidReStart}
				title='Tiếp tục cân'
				note='Bạn có muốn thực hiện tiếp tục cân cho phiếu cân này không?'
				onClose={() => setBillUuidReStart('')}
				onSubmit={funcReStartBatchBill.mutate}
			/>
			<Popup open={!!billUuid} onClose={() => setBilldUuid(null)}>
				<PopupDeleteBill uuid={billUuid} onClose={() => setBilldUuid(null)} />
			</Popup>
			<Popup open={!!billUuidUpdateShip} onClose={() => setBillUuidUpdateShip(null)}>
				<FormUpdateShipBill uuid={billUuidUpdateShip} onClose={() => setBillUuidUpdateShip(null)} />
			</Popup>
		</div>
	);
}

export default MainPageBillService;
