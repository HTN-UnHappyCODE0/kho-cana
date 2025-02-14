import React, {useState} from 'react';

import {IBillSend, PropsMainBillSend} from './interfaces';
import styles from './MainBillSend.module.scss';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
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
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';

import Pagination from '~/components/common/Pagination';
import Moment from 'react-moment';
import Link from 'next/link';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';
import IconCustom from '~/components/common/IconCustom';
import {Edit} from 'iconsax-react';
import Popup from '~/components/common/Popup';
import PopupChangeDryness from '../PopupChangeDryness';
import Button from '~/components/common/Button';
import batchBillServices from '~/services/batchBillServices';
import scalesStationServices from '~/services/scalesStationServices';
import storageServices from '~/services/storageServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import truckServices from '~/services/truckServices';

function MainBillSend({}: PropsMainBillSend) {
	const router = useRouter();
	const [isHaveDryness, setIsHaveDryness] = useState<string>('');
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [truckUuid, setTruckUuid] = useState<string[]>([]);

	const {
		_page,
		_pageSize,
		_keyword,
		_isBatch,
		_isShift,
		_productTypeUuid,
		_specUuid,
		_dateFrom,
		_dateTo,
		_storageUuid,
		_scalesStationUuid,
	} = router.query;

	const [dataSpec, setDataSpec] = useState<IBillSend | null>(null);
	const [total, setTotal] = useState<number>(0);
	const [listSelectBill, setListSelectBill] = useState<any[]>([]);
	const [listBillSend, setListBillSend] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

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
					typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
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

	useQuery(
		[
			QUERY_KEY.table_phieu_da_gui_KT,
			_page,
			_pageSize,
			_keyword,
			_isBatch,
			customerUuid,
			_productTypeUuid,
			_specUuid,
			_dateFrom,
			_dateTo,
			_isShift,
			_storageUuid,
			_scalesStationUuid,
			isHaveDryness,
			truckUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					setLoading: setLoading,
					http: batchBillServices.getListBill({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.IS_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
						status: [STATUS_BILL.DA_KCS, STATUS_BILL.CHOT_KE_TOAN],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: customerUuid,
						productTypeUuid: _productTypeUuid ? (_productTypeUuid as string) : '',
						specificationsUuid: (_specUuid as string) || '',
						isCreateBatch: null,
						qualityUuid: '',
						transportType: null,
						typeCheckDay: 0,
						warehouseUuid: '',
						shipUuid: '',
						state: [],
						scalesStationUuid: (_scalesStationUuid as string) || '',
						storageUuid: (_storageUuid as string) || '',
						isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
						truckUuid: truckUuid,
					}),
				}),
			onSuccess(data) {
				if (data) {
					setListBillSend(
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

	return (
		<div className={styles.container}>
			{/* <Loading loading={.isLoading} /> */}
			<div className={styles.header}>
				<div className={styles.main_search}>
					{listBillSend?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								danger
								p_4_12
								onClick={() => {
									setListSelectBill(listBillSend?.filter((v) => v.isChecked !== false));
								}}
							>
								Chỉnh sửa độ khô
							</Button>
						</div>
					)}
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo số phiếu và mã lô hàng' />
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
						name='Quy cách'
						query='_specUuid'
						listFilter={listSpecification?.data?.map((v: any) => ({
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
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listBillSend || []}
					loading={loading}
					noti={<Noti des='Hiện tại chưa có danh sách nhập liệu nào!' disableButton />}
				>
					<Table
						data={listBillSend || []}
						onSetData={setListBillSend}
						column={[
							{
								title: 'STT',
								checkBox: true,
								render: (data: IBillSend, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: IBillSend) => (
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
										<p style={{fontWeight: 500, color: '#3772FF'}}>
											<Moment date={data?.timeEnd} format='HH:mm - DD/MM/YYYY' />
										</p>
									</>
								),
							},
							{
								title: 'Số phiếu',
								render: (data: IBillSend) => <>{data?.code}</>,
							},
							{
								title: 'KL hàng (Tấn)',
								render: (data: IBillSend) => <>{convertWeight(data?.weightTotal)}</>,
							},
							{
								title: 'KL quy khô (Tấn)',
								render: (data: IBillSend) => <>{convertWeight(data?.weightBdmt) || 0}</>,
							},
							{
								title: 'Số lượt',
								render: (data: IBillSend) => <>{convertCoin(data?.countWs) || 0}</>,
							},
							{
								title: 'Khách hàng',
								render: (data: IBillSend) => <>{data?.fromUu?.name || '---'}</>,
							},
							{
								title: 'Kho hàng',
								render: (data: IBillSend) => <>{data?.toUu?.name || '---'}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: IBillSend) => <>{data?.productTypeUu?.name || '---'}</>,
							},

							// {
							// 	title: 'Quy cách',
							// 	render: (data: IBillSend) => (
							// 		<TippyHeadless
							// 			maxWidth={'100%'}
							// 			interactive
							// 			onClickOutside={() => setDataSpec(null)}
							// 			visible={dataSpec?.uuid == data?.uuid}
							// 			placement='top'
							// 			render={(attrs) => <BoxViewSpec dataUpdateSpec={dataSpec} />}
							// 		>
							// 			<Tippy content='Xem quy cách'>
							// 				<p
							// 					className={clsx(styles.specification, {
							// 						[styles.active]: dataSpec?.uuid == data?.uuid,
							// 					})}
							// 					onClick={() => setDataSpec(data)}
							// 				>
							// 					{data?.specificationsUu?.name || '---'}
							// 				</p>
							// 			</Tippy>
							// 		</TippyHeadless>
							// 	),
							// },
							{
								title: 'Độ khô',
								render: (data: IBillSend) => <p className={styles.dryness}>{data?.drynessAvg?.toFixed(2)} %</p>,
							},
							{
								title: 'Thời gian gửi',
								render: (data: IBillSend) => (
									<>{data?.updatedTime ? <Moment date={data?.updatedTime} format='HH:mm, DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IBillSend) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
										<IconCustom
											edit
											icon={<Edit fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#2CAE39'
											onClick={() => {
												setListSelectBill([data]);
											}}
										/>

										{/* <IconCustom
											edit
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={``}
										/> */}
										{/* <IconCustom
											edit
											icon={<DocumentText fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={PATH.LishSuPhieuGui + `?_BillSendUuid=${data?.uuid}`}
										/> */}
									</div>
								),
							},
						]}
					/>
				</DataWrapper>

				{/* {!queryWeightsession.isFetching && ( */}
				{!loading && (
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
							_specUuid,
							_dateFrom,
							_dateTo,
							_isShift,
							_storageUuid,
							_scalesStationUuid,
							isHaveDryness,
							truckUuid,
						]}
					/>
				)}
			</div>
			<Popup
				open={listSelectBill.length > 0}
				onClose={() => {
					setListSelectBill([]);
				}}
			>
				<PopupChangeDryness
					dataBillChangeDryness={listSelectBill}
					onClose={() => {
						setListSelectBill([]);
					}}
				/>
			</Popup>
		</div>
	);
}

export default MainBillSend;
