import React, {useRef, useState} from 'react';

import {PropsMainPageDraftShip} from './interfaces';
import styles from './MainPageDraftShip.module.scss';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_BILL,
	TYPE_ACTION_AUDIT,
	TYPE_BATCH,
	TYPE_CUSTOMER,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
} from '~/constants/config/enum';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import customerServices from '~/services/customerServices';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import {useRouter} from 'next/router';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Button from '~/components/common/Button';
import Link from 'next/link';
import {convertWeight} from '~/common/funcs/optionConvert';
import Moment from 'react-moment';
import storageServices from '~/services/storageServices';
import scalesStationServices from '~/services/scalesStationServices';
import batchBillServices from '~/services/batchBillServices';
import {TickCircle} from 'iconsax-react';
import Popup from '~/components/common/Popup';
import FormUpdateDraftShip from '../FormUpdateDraftShip';
import {ITableBillScale} from '~/components/pages/duyet-phieu/PageConfirmBill/interfaces';

function MainPageDraftShip({}: PropsMainPageDraftShip) {
	const router = useRouter();

	const {
		_page,
		_pageSize,
		_keyword,
		_isBatch,
		_isShift,
		_customerUuid,
		_status,
		_productTypeUuid,
		_specUuid,
		_dateFrom,
		_dateTo,
		_storageUuid,
		_scalesStationUuid,
		_state,
		_typeProduct,
	} = router.query;

	const [dataWeightSessionSubmit, setDataWeightSessionSubmit] = useState<any>();

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
					typeCus: TYPE_CUSTOMER.KH_XUAT,
					provinceId: '',
					specUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_hang], {
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

	const getListBill = useQuery(
		[
			QUERY_KEY.table_cap_nhat_mon_tau,
			_page,
			_pageSize,
			_keyword,
			_customerUuid,
			_isBatch,
			_productTypeUuid,
			_state,
			_dateFrom,
			_dateTo,
			_scalesStationUuid,
			_storageUuid,
			_typeProduct,
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
						scalesType: [TYPE_SCALES.CAN_XUAT],
						customerUuid: (_customerUuid as string) || '',
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						isCreateBatch: null,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: [STATUS_BILL.DA_CAN_CHUA_KCS, STATUS_BILL.DA_KCS],
						state: !!_state ? [Number(_state)] : [],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						warehouseUuid: '',
						qualityUuid: '',
						transportType: null,
						typeCheckDay: 0,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						storageUuid: (_storageUuid as string) || '',
						isHaveDryness: TYPE_ACTION_AUDIT.NO_DRY,
						typeProduct: TYPE_PRODUCT.CONG_TY,
					}),
				}),

			select(data) {
				if (data) {
					return data;
				}
			},
		}
	);

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

	return (
		<div className={styles.container}>
			{/* <Loading loading={funcUpdateKCSWeightSession.isLoading} /> */}
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo số phiếu và mã lô hàng' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Kiểu cân'
							query='_isBatch'
							// all={false}
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
						name='Loại hàng'
						query='_productTypeUuid'
						listFilter={listProductType?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>
					{/* <FilterCustom
						isSearch
						name='Quy cách'
						query='_specUuid'
						listFilter={listSpecification?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
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
					<FilterCustom
						isSearch
						name='Bãi'
						query='_storageUuid'
						listFilter={listStorage?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.YESTERDAY} />
					</div>
				</div>
			</div>
			{/* <div className={clsx('mt')}>
				<div className={styles.parameter}>
					<div>
						TỔNG LƯỢNG HÀNG TƯƠI:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertCoin(getListBatch?.data?.amountMt) || 0} </span>
						(Tấn)
					</div>
					<div>
						TỔNG LƯỢNG HÀNG QUY KHÔ:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertCoin(getListBatch?.data?.amountBdmt) || 0} </span>
						(Tấn)
					</div>
				</div>
			</div> */}

			<div className={styles.table}>
				<DataWrapper
					data={getListBill?.data?.items || []}
					loading={getListBill?.isLoading}
					noti={<Noti des='Hiện tại chưa có dữ liệu nào!' disableButton />}
				>
					<Table
						data={getListBill?.data?.items || []}
						// onSetData={setWeightSessions}
						column={[
							{
								title: 'STT',
								// checkBox: true,
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
										<p style={{fontWeight: 500, color: '#3772FF'}}>{data?.weightSessionUu?.code || '---'}</p>
									</>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										Loại cân <br /> Thời gian kết thúc
									</span>
								),
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
							{
								title: (
									<span className={styles.unit}>
										Từ <br /> (Tàu/Xe)
									</span>
								),
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
								title: 'Đến',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
										{/* <p style={{fontWeight: 600, color: '#3772FF'}}>
											{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
										</p> */}
									</>
								),
							},
							{
								title: 'Loại hàng',
								render: (data: ITableBillScale) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Lượng tươi theo mớn <br /> (Tấn)
									</span>
								),
								render: (data: ITableBillScale) => <>{convertWeight(data?.weightMon) || 0}</>,
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
								title: 'Tổng số lượt',
								render: (data: ITableBillScale) => <>{data?.countWs}</>,
							},

							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: ITableBillScale) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<div>
											<Button
												className={styles.btn}
												rounded_2
												maxHeight
												primary
												p_4_12
												icon={<TickCircle size={20} />}
												onClick={() => {
													setDataWeightSessionSubmit(data);
												}}
											>
												CN mớn tàu
											</Button>
										</div>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={getListBill?.data?.pagination?.totalCount}
					dependencies={[
						_pageSize,
						_keyword,
						_isBatch,
						_customerUuid,
						_productTypeUuid,
						_specUuid,
						_dateFrom,
						_dateTo,
						_isShift,
						_status,
						_storageUuid,
						_scalesStationUuid,
						_state,
						_typeProduct,
					]}
				/>
			</div>

			<Popup open={!!dataWeightSessionSubmit} onClose={() => setDataWeightSessionSubmit(null)}>
				<FormUpdateDraftShip dataUpdate={dataWeightSessionSubmit} onClose={() => setDataWeightSessionSubmit(null)} />
			</Popup>
		</div>
	);
}

export default MainPageDraftShip;
