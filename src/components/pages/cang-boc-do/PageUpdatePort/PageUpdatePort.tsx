import React, {useEffect, useState} from 'react';

import {ITableBillScale, PropsPageUpdatePort} from './interfaces';
import styles from './PageUpdatePort.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_BILL,
	TYPE_ACTION_AUDIT,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_SIFT,
} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
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
import {Eye, Ship} from 'iconsax-react';
import Popup from '~/components/common/Popup';
import FormUpdatePort from '../FormUpdatePort';
import Button from '~/components/common/Button';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import truckServices from '~/services/truckServices';
import companyServices from '~/services/companyServices';
import SelectFilterState from '~/components/common/SelectFilterState';

function PageUpdatePort({}: PropsPageUpdatePort) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _productTypeUuid, _dateFrom, _dateTo} = router.query;

	const [listBatchBillSubmit, setListBatchBillSubmit] = useState<ITableBillScale[]>([]);
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [truckUuid, setTruckUuid] = useState<string[]>([]);
	const [uuidQuality, setUuidQuality] = useState<string>('');
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
			QUERY_KEY.table_cang_boc_do,
			_page,
			_pageSize,
			customerUuid,
			_keyword,
			_productTypeUuid,
			_dateFrom,
			_dateTo,
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
						isBatch: TYPE_BATCH.CAN_LO,
						isCreateBatch: null,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: [
							STATUS_BILL.CHUA_CAN,
							STATUS_BILL.DANG_CAN,
							STATUS_BILL.TAM_DUNG,
							STATUS_BILL.DA_CAN_CHUA_KCS,
							STATUS_BILL.DA_KCS,
							STATUS_BILL.CHOT_KE_TOAN,
						],
						state: [],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						warehouseUuid: '',
						qualityUuid: uuidQuality,
						transportType: null,
						typeCheckDay: 0,
						scalesStationUuid: '',
						storageUuid: '',
						isHaveDryness: TYPE_ACTION_AUDIT.NO_DRY,
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
		}
	);

	useEffect(() => {
		if (uuidCompany) {
			setCustomerUuid([]);
		}
	}, [uuidCompany]);

	return (
		<div className={styles.container}>
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
									setListBatchBillSubmit(listBatchBill?.filter((v) => v.isChecked !== false));
								}}
							>
								Cập nhật cảng bốc dỡ
							</Button>
						</div>
					)}
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lô hàng' />
					</div>

					{/* <FilterCustom
						isSearch
						name='Khách hàng'
						query='_customerUuid'
						listFilter={listCustomer?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/> */}
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
					<SelectFilterState
						uuid={uuidQuality}
						setUuid={setUuidQuality}
						listData={listQuality?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Quốc gia'
					/>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
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
								checkBox: true,
								render: (data: ITableBillScale, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: ITableBillScale) => (
									<Link href={`/phieu-can/${data.uuid}`} className={styles.link}>
										{data?.code}
									</Link>
								),
							},
							{
								title: 'Cảng bốc dỡ',
								render: (data: ITableBillScale) => <p style={{fontWeight: 600}}>{data?.port || '---'}</p>,
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
								),
							},
							{
								title: 'KL tươi (Tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weightTotal) || 0}</>,
							},
							{
								title: 'KL quy khô (Tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weightBdmt) || 0}</>,
							},
							{
								title: 'Độ khô (%)',
								render: (data: ITableBillScale) => <>{data?.drynessAvg?.toFixed(2) || 0}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: ITableBillScale) => <>{data?.productTypeUu?.name || '---'}</>,
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
								title: 'Phân loại',
								render: (data: ITableBillScale) => (
									<>
										{data?.isSift == TYPE_SIFT.CAN_SANG && 'Cần sàng'}
										{data?.isSift == TYPE_SIFT.KHONG_CAN_SANG && 'Không cần sàng'}
									</>
								),
							},
							{
								title: 'Quy cách',
								render: (data: ITableBillScale) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'Đến',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
										<p style={{fontWeight: 400, color: '#3772FF'}}>
											{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
										</p>
									</>
								),
							},

							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: ITableBillScale) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
										<IconCustom
											edit
											icon={<Ship size={22} fontWeight={600} />}
											tooltip='Cập nhật cảng'
											color='#777E90'
											onClick={() => setListBatchBillSubmit([data])}
										/>
										<IconCustom
											edit
											icon={<Eye size={22} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={`/phieu-can/${data.uuid}`}
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
							_productTypeUuid,
							_dateFrom,
							_dateTo,
							truckUuid,
							uuidCompany,
							uuidQuality,
						]}
					/>
				)}
			</div>

			<Popup open={listBatchBillSubmit.length > 0} onClose={() => setListBatchBillSubmit([])}>
				<FormUpdatePort listBatchBillSubmit={listBatchBillSubmit} onClose={() => setListBatchBillSubmit([])} />
			</Popup>
		</div>
	);
}

export default PageUpdatePort;
