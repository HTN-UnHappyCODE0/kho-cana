import React, {useState} from 'react';

import {IWeightSession, PropsMainSpecification} from './interfaces';
import styles from './MainSpecification.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
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
	TYPE_PRODUCT,
	TYPE_SCALES,
} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import batchBillServices from '~/services/batchBillServices';
import {useRouter} from 'next/router';
import weightSessionServices from '~/services/weightSessionServices';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import Button from '~/components/common/Button';
import {AiOutlineFileAdd} from 'react-icons/ai';
import Popup from '~/components/common/Popup';
import FormUpdateSpecWS from '../FormUpdateSpecWS';
import {toastWarn} from '~/common/funcs/toast';
import {convertCoin} from '~/common/funcs/convertCoin';
import Link from 'next/link';

function MainSpecification({}: PropsMainSpecification) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _isBatch, _customerUuid, _productTypeUuid, _specUuid, _billUuid, _dateFrom, _dateTo, _isShift} =
		router.query;

	const [weightSessionSubmits, setWeightSessionSubmits] = useState<any[]>([]);
	const [weightSessions, setWeightSessions] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 20,
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
					pageSize: 20,
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
					pageSize: 20,
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

	const listWeightSessionBill = useQuery([QUERY_KEY.dropdown_ma_lo_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: batchBillServices.getListBill({
					page: 1,
					pageSize: 20,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					scalesType: [],
					customerUuid: '',
					isBatch: null,
					isCreateBatch: null,
					productTypeUuid: '',
					specificationsUuid: '',
					status: [
						STATUS_BILL.DANG_CAN,
						STATUS_BILL.TAM_DUNG,
						STATUS_BILL.DA_CAN_CHUA_KCS,
						STATUS_BILL.DA_KCS,
						STATUS_BILL.CHOT_KE_TOAN,
					],
					timeStart: null,
					timeEnd: null,
					warehouseUuid: '',
					qualityUuid: '',
					transportType: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	useQuery(
		[
			QUERY_KEY.table_nhap_lieu_quy_cach,
			_page,
			_pageSize,
			_keyword,
			_isBatch,
			_customerUuid,
			_productTypeUuid,
			_specUuid,
			_billUuid,
			_dateFrom,
			_dateTo,
			_isShift,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					setLoading: setLoading,
					http: weightSessionServices.listWeightsession({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 20,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						billUuid: _billUuid ? (_billUuid as string) : '',
						codeEnd: null,
						codeStart: null,
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
						specUuid: !!_specUuid ? (_specUuid as string) : null,
						status: [STATUS_WEIGHT_SESSION.CAN_LAN_2],
						storageUuid: '',
						truckUuid: '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: _customerUuid ? (_customerUuid as string) : '',
						productTypeUuid: _productTypeUuid ? (_productTypeUuid as string) : '',
						shift: !!_isShift ? Number(_isBatch) : null,
					}),
				}),
			onSuccess(data) {
				if (data) {
					setWeightSessions(
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

	const handleUpdateAll = () => {
		const arr = weightSessions?.filter((v) => v.isChecked !== false);

		if (!arr?.every((obj: any) => obj?.specificationsUu?.uuid === arr[0]?.specificationsUu?.uuid)) {
			return toastWarn({msg: 'Chỉ chọn được các lô có cùng quy cách!'});
		} else {
			setWeightSessionSubmits(arr);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					{weightSessions?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								green
								p_4_12
								icon={<AiOutlineFileAdd size={20} />}
								onClick={handleUpdateAll}
							>
								Cập nhật quy cách
							</Button>
						</div>
					)}
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo số phiếu' />
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
						name='Loại gỗ'
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
						name='Mã lô hàng'
						query='_billUuid'
						listFilter={listWeightSessionBill?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.code,
						}))}
					/>
					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' />
					</div>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={weightSessions || []}
					loading={loading}
					noti={<Noti des='Hiện tại chưa có danh sách nhập liệu nào!' disableButton />}
				>
					<Table
						data={weightSessions || []}
						onSetData={setWeightSessions}
						column={[
							{
								title: 'STT',
								checkBox: true,
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
								title: 'Số xe',
								render: (data: IWeightSession) => <>{data?.truckUu?.licensePalate || '---'}</>,
							},
							{
								title: 'Khách hàng',
								render: (data: IWeightSession) => <>{data?.fromUu?.name || '---'}</>,
							},
							{
								title: 'Kho hàng',
								render: (data: IWeightSession) => <>{data?.toUu?.name || '---'}</>,
							},
							{
								title: 'Loại gỗ',
								render: (data: IWeightSession) => <>{data?.producTypeUu?.name || '---'}</>,
							},
							{
								title: 'KL hàng (kg)',
								render: (data: IWeightSession) => <>{convertCoin(data?.weightReal)}</>,
							},
							{
								title: 'Quy cách',
								render: (data: IWeightSession) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							// {
							// 	title: 'Tiêu chí',
							// 	render: (data: IWeightSession) => (
							// 		<div className={styles.ruler}>
							// 			<TippyHeadless
							// 				maxWidth={'100%'}
							// 				interactive
							// 				onClickOutside={() => setUuidWeightSession('')}
							// 				visible={uuidWeightSession == data?.uuid}
							// 				placement='bottom'
							// 				render={(attrs) => (
							// 					<div className={styles.main_ruler}>
							// 						<div className={styles.content}>
							// 							{data?.specStyleUu?.ruleItems?.map((v, i) => (
							// 								<div key={i} className={styles.item}>
							// 									<div className={styles.dot}></div>
							// 									<p>{v?.titleType}</p>
							// 								</div>
							// 							))}
							// 						</div>
							// 					</div>
							// 				)}
							// 			>
							// 				<Tippy content='Xem tiêu chí'>
							// 					<p
							// 						onClick={() => {
							// 							if (data?.specStyleUu?.countRuler == 0) {
							// 								return null;
							// 							} else {
							// 								setUuidWeightSession(uuidWeightSession ? '' : data.uuid);
							// 							}
							// 						}}
							// 						className={clsx(styles.value, {[styles.active]: uuidWeightSession == data.uuid})}
							// 					>
							// 						{data?.specStyleUu?.countRuler || 0}
							// 					</p>
							// 				</Tippy>
							// 			</TippyHeadless>
							// 		</div>
							// 	),
							// },
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IWeightSession) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<div>
											<Button
												className={styles.btn}
												rounded_2
												maxHeight
												green
												p_4_12
												icon={<AiOutlineFileAdd size={20} />}
												onClick={() => setWeightSessionSubmits([data])}
											>
												CN quy cách
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
					pageSize={Number(_pageSize) || 20}
					total={total}
					dependencies={[
						_pageSize,
						_keyword,
						_isBatch,
						_customerUuid,
						_productTypeUuid,
						_specUuid,
						_billUuid,
						_dateFrom,
						_dateTo,
						_isShift,
					]}
				/>
			</div>

			<Popup open={weightSessionSubmits.length > 0} onClose={() => setWeightSessionSubmits([])}>
				<FormUpdateSpecWS dataUpdateSpecWS={weightSessionSubmits} onClose={() => setWeightSessionSubmits([])} />
			</Popup>
		</div>
	);
}

export default MainSpecification;
