import React, {useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';

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
	STATUS_WEIGHT_SESSION,
	TYPE_BATCH,
	TYPE_CUSTOMER,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import weightSessionServices from '~/services/weightSessionServices';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';

import Pagination from '~/components/common/Pagination';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import BoxViewSpec from '../BoxViewSpec';
import Moment from 'react-moment';
import Link from 'next/link';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';
import IconCustom from '~/components/common/IconCustom';
import {DocumentText, Edit, Eye} from 'iconsax-react';
import Popup from '~/components/common/Popup';
import PopupChangeDryness from '../PopupChangeDryness';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';
import batchBillServices from '~/services/batchBillServices';

function MainBillSend({}: PropsMainBillSend) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _isBatch, _isShift, _customerUuid, _productTypeUuid, _specUuid, _dateFrom, _dateTo} = router.query;

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

	useQuery(
		[
			QUERY_KEY.table_phieu_da_gui_KT,
			_page,
			_pageSize,
			_keyword,
			_isBatch,
			_customerUuid,
			_productTypeUuid,
			_specUuid,
			_dateFrom,
			_dateTo,
			_isShift,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					setLoading: setLoading,
					http: batchBillServices.getListBill({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 50,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
						status: [STATUS_BILL.DA_KCS, STATUS_BILL.CHOT_KE_TOAN],
						storageUuid: '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: _customerUuid ? (_customerUuid as string) : '',
						productTypeUuid: _productTypeUuid ? (_productTypeUuid as string) : '',
						specificationsUuid: (_specUuid as string) || '',
						isCreateBatch: null,
						qualityUuid: '',
						scalesStationUuid: '',
						transportType: null,
						typeCheckDay: 0,
						warehouseUuid: '',
						shipUuid: '',
						state: [],
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
					<FilterCustom
						isSearch
						name='Quy cách'
						query='_specUuid'
						listFilter={listSpecification?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
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
									<Link href={`/phieu-can/${data?.uuid}`} className={styles.link}>
										{data?.code}
									</Link>
								),
							},
							{
								title: 'Số phiếu',
								render: (data: IBillSend) => <>{data?.code}</>,
							},
							{
								title: 'Tổng số phiếu',
								render: (data: IBillSend) => <>{'---'}</>,
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
							{
								title: 'KL hàng (Tấn)',
								render: (data: IBillSend) => <>{convertWeight(data?.weightTotal)}</>,
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
								render: (data: IBillSend) => <p className={styles.dryness}>{formatDrynessAvg(data?.drynessAvg)} %</p>,
							},
							{
								title: 'Thời gian gửi',
								render: (data: IBillSend) => <Moment date={data?.updatedTime} format='HH:mm, DD/MM/YYYY' />,
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IBillSend) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
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
						pageSize={Number(_pageSize) || 50}
						total={total}
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
