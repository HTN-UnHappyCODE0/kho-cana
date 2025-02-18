import React, {useState} from 'react';

import {IWeightSession, PropsMainWeightSessionAll} from './interfaces';
import styles from './MainWeightSessionAll.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_WEIGHT_SESSION,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_SCALES,
} from '~/constants/config/enum';

import {useRouter} from 'next/router';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Link from 'next/link';
import Pagination from '~/components/common/Pagination';
import clsx from 'clsx';
import truckServices from '~/services/truckServices';
import wareServices from '~/services/wareServices';
import Moment from 'react-moment';
import useDebounce from '~/common/hooks/useDebounce';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import weightSessionServices from '~/services/weightSessionServices';
import {convertWeight} from '~/common/funcs/optionConvert';
import GridColumn from '~/components/layouts/GridColumn';
import icons from '~/constants/images/icons';
import DashbroadWeightsession from '~/components/common/DashbroadWeightsession';
import customerServices from '~/services/customerServices';
import storageServices from '~/services/storageServices';
import shipServices from '~/services/shipServices';
import StateActive from '~/components/common/StateActive';
import scalesStationServices from '~/services/scalesStationServices';
import SelectFilterMany from '~/components/common/SelectFilterMany';

function MainWeightSessionAll({}: PropsMainWeightSessionAll) {
	const router = useRouter();
	const {
		_page,
		_pageSize,
		_keyword,
		_specUuid,
		_status,
		_dateFrom,
		_dateTo,
		_customerUuid,
		_shipUuid,
		_isBatch,
		_shift,
		_storageUuid,
		_scalesStationUuid,
	} = router.query;

	const [byFilter, setByFilter] = useState<boolean>(false);
	const [formCode, setFormCode] = useState<{codeStart: string; codeEnd: string}>({
		codeStart: '',
		codeEnd: '',
	});
	const [truckUuid, setTruckUuid] = useState<string[]>([]);

	const debounceCodeStart = useDebounce(formCode.codeStart, 500);
	const debounceCodeEnd = useDebounce(formCode.codeEnd, 500);

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

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach], {
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

	const listWeightsession = useQuery(
		[
			QUERY_KEY.table_luot_can_tat_ca,
			_page,
			_pageSize,
			_keyword,
			truckUuid,
			_specUuid,
			_status,
			_dateFrom,
			_dateTo,
			byFilter,
			debounceCodeStart,
			debounceCodeEnd,
			_customerUuid,
			_storageUuid,
			_isBatch,
			_shipUuid,
			_shift,
			_scalesStationUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: weightSessionServices.listWeightsession({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						scalesType: [],
						storageUuid: (_storageUuid as string) || '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: (_customerUuid as string) || '',
						productTypeUuid: '',
						billUuid: '',
						codeEnd: byFilter && !!debounceCodeEnd ? Number(debounceCodeEnd) : null,
						codeStart: byFilter && !!debounceCodeStart ? Number(debounceCodeStart) : null,
						specUuid: !!_specUuid ? (_specUuid as string) : null,
						// status: !!_status ? [Number(_status)] : [],
						status: !!_status
							? [Number(_status)]
							: [
									STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE,
									STATUS_WEIGHT_SESSION.CAN_LAN_2,
									STATUS_WEIGHT_SESSION.UPDATE_DRY_DONE,
									STATUS_WEIGHT_SESSION.CHOT_KE_TOAN,
									STATUS_WEIGHT_SESSION.KCS_XONG,
							  ],
						shipUuid: (_shipUuid as string) || '',
						shift: !!_shift ? Number(_shift) : null,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						isHaveSpec: null,
						truckUuid: '',
						listTruckUuid: truckUuid,
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	const {data: dashbroadWeightsession, isLoading} = useQuery(
		[
			QUERY_KEY.thong_ke_tong_hop_phieu_can_tat_ca,
			_page,
			_pageSize,
			_keyword,
			truckUuid,
			_specUuid,
			_status,
			_dateFrom,
			_dateTo,
			byFilter,
			debounceCodeStart,
			debounceCodeEnd,
			_customerUuid,
			_storageUuid,
			_isBatch,
			_shipUuid,
			_shift,
			_scalesStationUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: weightSessionServices.dashbroadWeightsession({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						scalesType: [],
						storageUuid: (_storageUuid as string) || '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: (_customerUuid as string) || '',
						productTypeUuid: '',
						billUuid: '',
						codeEnd: byFilter && !!debounceCodeEnd ? Number(debounceCodeEnd) : null,
						codeStart: byFilter && !!debounceCodeStart ? Number(debounceCodeStart) : null,
						specUuid: !!_specUuid ? (_specUuid as string) : '',
						status: !!_status
							? [Number(_status)]
							: [
									STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE,
									STATUS_WEIGHT_SESSION.CAN_LAN_2,
									STATUS_WEIGHT_SESSION.UPDATE_DRY_DONE,
									STATUS_WEIGHT_SESSION.CHOT_KE_TOAN,
									STATUS_WEIGHT_SESSION.KCS_XONG,
							  ],
						truckUuid: '',
						listTruckUuid: truckUuid,
						shift: !!_shift ? Number(_shift) : null,
						shipUuid: (_shipUuid as string) || '',
						scalesStationUuid: (_scalesStationUuid as string) || '',
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.left}>
						<div className={styles.search}>
							<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lô và số phiếu' />
						</div>
						<div className={styles.search}>
							<Search type='number' keyName='_shift' placeholder='Tìm kiếm theo ca' />
						</div>

						<FilterCustom
							isSearch
							name='Khách hàng'
							query='_customerUuid'
							listFilter={listCustomer?.data?.map((v: any) => ({
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
							name='Mã tàu'
							query='_shipUuid'
							listFilter={listShip?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.licensePalate,
							}))}
						/>

						{/* <FilterCustom
							isSearch
							name='Biển số xe'
							query='_truckUuid'
							listFilter={listTruck?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.licensePalate,
							}))}
						/> */}
						<SelectFilterMany
							selectedIds={truckUuid}
							setSelectedIds={setTruckUuid}
							listData={listTruck?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.licensePalate,
							}))}
							name='Biển số xe'
						/>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Quy cách'
								query='_specUuid'
								listFilter={listSpecification?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
							/>
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
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Trạng thái'
								query='_status'
								listFilter={[
									{
										id: STATUS_WEIGHT_SESSION.CAN_LAN_2,
										name: 'Đã cân xong',
									},
									{
										id: STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE,
										name: 'Đã cập nhật quy cách',
									},
									{
										id: STATUS_WEIGHT_SESSION.UPDATE_DRY_DONE,
										name: 'Đã cập nhật độ khô',
									},
									{
										id: STATUS_WEIGHT_SESSION.KCS_XONG,
										name: 'Đã KCS',
									},
									{
										id: STATUS_WEIGHT_SESSION.CHOT_KE_TOAN,
										name: 'Kết thúc',
									},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
						</div>
						{/* <div className={clsx(styles.checkbox_right)}>
							<input
								type='checkbox'
								id='can-lan-1'
								onChange={(e) => handleChangeCheckBox(e, '_status', STATUS_WEIGHT_SESSION.CAN_LAN_1)}
								checked={!!_status}
							/>
							<label htmlFor='can-lan-1'>Chỉ hiển thị cân lần 1 </label>
						</div> */}
					</div>

					<div className={styles.right}>
						<div className={clsx(styles.box_right)}>
							<input
								type='checkbox'
								id='loc_theo_phieu'
								onChange={(e) => {
									const {checked} = e.target;

									if (checked) {
										setByFilter(true);
									} else {
										setByFilter(false);
									}
								}}
								checked={byFilter}
							/>
							<label htmlFor='loc_theo_phieu'>Lọc theo phiếu</label>
						</div>
						<div className={clsx(styles.filter_to)}>
							<input
								type='number'
								id='tu'
								className={styles.input}
								value={formCode.codeStart}
								onChange={(e) =>
									setFormCode((prev) => ({
										...prev,
										codeStart: e.target.value,
									}))
								}
							/>
							<p>Đến</p>
							<input
								type='number'
								id='den'
								className={styles.input}
								value={formCode.codeEnd}
								onChange={(e) =>
									setFormCode((prev) => ({
										...prev,
										codeEnd: e.target.value,
									}))
								}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className={clsx('mt')}>
				<GridColumn col_5>
					<DashbroadWeightsession
						text='Tổng khối lượng cân'
						value={convertWeight(dashbroadWeightsession?.totalWeight)}
						icons={icons.tongkhoiluongcan}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Số chuyến xe'
						value={dashbroadWeightsession?.totalSession || 0}
						icons={icons.sochuyenxe}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng hàng nhập'
						value={convertWeight(dashbroadWeightsession?.totalWeightIn)}
						icons={icons.khoiluonghangnhap}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng hàng xuất'
						value={convertWeight(dashbroadWeightsession?.totalWeightOut)}
						icons={icons.khoiluonghangxuat}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng cân dịch vụ'
						value={convertWeight(dashbroadWeightsession?.totalWeightService)}
						icons={icons.khoiluonghangdichvu}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng chuyển kho'
						value={convertWeight(dashbroadWeightsession?.totalWeightChange)}
						icons={icons.khoiluonghangchuyenkho}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng xuất thẳng'
						value={convertWeight(dashbroadWeightsession?.totalWeightOutDirectly)}
						icons={icons.khoiluonghangxuatthang}
						loading={isLoading}
					/>
				</GridColumn>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listWeightsession?.data?.items || []}
					loading={listWeightsession?.isLoading}
					noti={<Noti des='Hiện tại chưa có lượt cân nào!' disableButton />}
				>
					<Table
						data={listWeightsession?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IWeightSession, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: IWeightSession) => (
									<Link href={`/phieu-can/${data?.billUu?.uuid}`} className={styles.link}>
										{data?.billUu?.code}
									</Link>
								),
							},
							{
								title: 'Số phiếu',
								render: (data: IWeightSession) => <>{data?.code}</>,
							},
							{
								title: 'Loại cân',
								render: (data: IWeightSession) => (
									<p style={{fontWeight: 600}}>
										{data?.billUu?.scalesType == TYPE_SCALES.CAN_NHAP && 'Cân nhập'}
										{data?.billUu?.scalesType == TYPE_SCALES.CAN_XUAT && 'Cân xuất'}
										{data?.billUu?.scalesType == TYPE_SCALES.CAN_DICH_VU && 'Cân dịch vụ'}
										{data?.billUu?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO && 'Cân chuyển kho'}
										{data?.billUu?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP && 'Cân xuất thẳng'}
									</p>
								),
							},
							{
								title: 'Biển số xe',
								render: (data: IWeightSession) => <>{data?.truckUu?.licensePalate}</>,
							},
							{
								title: 'Từ',
								render: (data: IWeightSession) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.fromUu?.name || '---'}</p>
										{/* <p>({data?.fromUu?.parentUu?.name || '---'})</p> */}
									</>
								),
							},
							{
								title: 'KL 1 (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weight1?.weight)}</>,
							},
							{
								title: 'KL 2 (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weight2?.weight)}</>,
							},
							{
								title: 'KL hàng (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weightReal)}</>,
							},
							{
								title: 'Đến',
								render: (data: IWeightSession) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
										{/* <p>({data?.toUu?.parentUu?.name || '---'})</p> */}
									</>
								),
							},
							{
								title: 'Cân lần 1',
								render: (data: IWeightSession) => (
									<>
										<p style={{marginBottom: 4, color: '#2D74FF'}}>{data?.weight1?.scalesMachineUu?.name}</p>
										<p>
											<Moment date={data?.weight1?.timeScales} format='HH:mm, DD/MM/YYYY' />
										</p>
									</>
								),
							},
							{
								title: 'Cân lần 2',
								render: (data: IWeightSession) => (
									<>
										<p style={{marginBottom: 4, color: '#2D74FF'}}>{data?.weight2?.scalesMachineUu?.name}</p>
										<p>
											<Moment date={data?.weight2?.timeScales} format='HH:mm, DD/MM/YYYY' />
										</p>
									</>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: IWeightSession) => (
									<StateActive
										stateActive={data?.status}
										listState={[
											{
												state: STATUS_WEIGHT_SESSION.KCS_XONG,
												text: 'Đã KCS',
												textColor: '#9757D7',
												backgroundColor: 'rgba(151, 87, 215, 0.10)',
											},
											{
												state: STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE,
												text: 'Đã cập nhật quy cách',
												textColor: '#F95B5B',
												backgroundColor: 'rgba(249, 91, 91, 0.10)',
											},
											{
												state: STATUS_WEIGHT_SESSION.UPDATE_DRY_DONE,
												text: 'Đã cập nhật độ khô',
												textColor: '#2D74FF',
												backgroundColor: 'rgba(45, 116, 255, 0.10)',
											},
											{
												state: STATUS_WEIGHT_SESSION.CAN_LAN_2,
												text: 'Đã cân xong',
												textColor: '#41CD4F',
												backgroundColor: 'rgba(65, 205, 79, 0.1)',
											},
											{
												state: STATUS_WEIGHT_SESSION.CHOT_KE_TOAN,
												text: 'Kết thúc',
												textColor: '#0EA5E9',
												backgroundColor: 'rgba(14, 165, 233, 0.1)',
											},
										]}
									/>
								),
							},
							// {
							// 	title: 'Tác vụ',
							// 	render: (data: IWeightSession) => (
							// 		<IconCustom
							// 			edit
							// 			icon={
							// 				<Gallery
							// 					size='32'
							// 					color='rgba(109, 110, 124, 1)'
							// 					variant='Bold'
							// 					fontSize={20}
							// 					fontWeight={600}
							// 				/>
							// 			}
							// 			tooltip='Xem ảnh'
							// 			color='#777E90'
							// 			href={`#`}
							// 		/>
							// 	),
							// },
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={listWeightsession?.data?.pagination?.totalCount}
					dependencies={[
						_pageSize,
						_keyword,
						truckUuid,
						_specUuid,
						_status,
						_dateFrom,
						_dateTo,
						byFilter,
						debounceCodeStart,
						debounceCodeEnd,
						_customerUuid,
						_storageUuid,
						_isBatch,
						_shipUuid,
						_shift,
						_scalesStationUuid,
					]}
				/>
			</div>
		</div>
	);
}

export default MainWeightSessionAll;
