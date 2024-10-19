import React, {Fragment, useState} from 'react';
import {IWeightSession, PropsTableDetail} from './interfaces';
import styles from './TableDetail.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import clsx from 'clsx';
import Search from '~/components/common/Search';
import {useRouter} from 'next/router';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_WEIGHT_SESSION,
	TYPE_BATCH,
	TYPE_DATE,
} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Moment from 'react-moment';
import Tippy from '@tippyjs/react';
import TippyHeadless from '@tippyjs/react/headless';
import weightSessionServices from '~/services/weightSessionServices';
import {convertWeight} from '~/common/funcs/optionConvert';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import FilterCustom from '~/components/common/FilterCustom';
import shipServices from '~/services/shipServices';
import wareServices from '~/services/wareServices';
import truckServices from '~/services/truckServices';
import storageServices from '~/services/storageServices';
import customerServices from '~/services/customerServices';
import useDebounce from '~/common/hooks/useDebounce';

function TableDetail({}: PropsTableDetail) {
	const router = useRouter();

	const {
		_id,
		_page,
		_pageSize,
		_keyword,
		_truckUuid,
		_specUuid,
		_status,
		_dateFrom,
		_dateTo,
		_customerUuid,
		_storageUuid,
		_isBatch,
		_shipUuid,
		_shift,
	} = router.query;

	const [uuidDescription, setUuidDescription] = useState<string>('');

	const [byFilter, setByFilter] = useState<boolean>(false);
	const [formCode, setFormCode] = useState<{codeStart: string; codeEnd: string}>({
		codeStart: '',
		codeEnd: '',
	});

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
					status: null,
				}),
			}),
		select(data) {
			if (data) {
				return data;
			}
		},
	});

	const listTruck = useQuery([QUERY_KEY.dropdown_xe_hang, _id], {
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
					billUuid: (_id as string) || '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
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

	const listWeightSession = useQuery(
		[
			QUERY_KEY.table_chi_tiet_don_hang_phieu,
			_page,
			_pageSize,
			_keyword,
			_truckUuid,
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
			_id,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: weightSessionServices.listWeightsession({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 50,
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
						billUuid: (_id as string) || '',
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
						truckUuid: !!_truckUuid ? (_truckUuid as string) : '',
						shipUuid: (_shipUuid as string) || '',
						shift: !!_shift ? Number(_shift) : null,
					}),
				}),
			select(data) {
				return data;
			},
			enabled: !!_id,
		}
	);

	const handleChangeCheckBox = (e: any) => {
		const {checked} = e.target;
		const {_status, ...rest} = router.query;

		if (checked) {
			return router.replace(
				{
					query: {
						...router.query,
						_status: STATUS_WEIGHT_SESSION.CAN_LAN_1,
					},
				},
				undefined,
				{
					scroll: false,
				}
			);
		} else {
			return router.replace(
				{
					query: {
						...rest,
					},
				},
				undefined,
				{
					scroll: false,
				}
			);
		}
	};

	return (
		<Fragment>
			<div className={clsx('mt')}>
				<div className={styles.header}>
					<div className={styles.main_search}>
						<div className={styles.left}>
							<div className={styles.search}>
								<Search keyName='_keyword' placeholder='Tìm kiếm theo số phiếu' />
							</div>

							<div className={styles.search}>
								<Search type='number' keyName='_shift' placeholder='Tìm kiếm theo ca' />
							</div>

							{/* <FilterCustom
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
							/> */}

							{/* <FilterCustom
								isSearch
								name='Mã tàu'
								query='_shipUuid'
								listFilter={listShip?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.licensePalate,
								}))}
							/> */}

							<FilterCustom
								isSearch
								name='Biển số xe'
								query='_truckUuid'
								listFilter={listTruck?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.licensePalate,
								}))}
							/>
							{/* <div className={styles.filter}>
								<FilterCustom
									isSearch
									name='Quy cách'
									query='_specUuid'
									listFilter={listSpecification?.data?.map((v: any) => ({
										id: v?.uuid,
										name: v?.name,
									}))}
								/>
							</div> */}
							{/* <div className={styles.filter}>
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
							</div> */}
							<div className={styles.filter}>
								<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
							</div>
						</div>
						{/* <div className={clsx(styles.checkbox_right)}>
							<input type='checkbox' id='can-lan-1' onChange={handleChangeCheckBox} />
							<label htmlFor='can-lan-1'>Chỉ hiển thị cân lần 1 </label>
						</div> */}
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
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listWeightSession?.data?.items || []}
					loading={listWeightSession?.isLoading}
					noti={<Noti des='Dữ liệu trống?' disableButton />}
				>
					<Table
						data={listWeightSession?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IWeightSession, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Số phiếu',
								fixedLeft: true,
								render: (data: IWeightSession) => <>{data?.code}</>,
							},
							{
								title: 'Số xe',
								render: (data: IWeightSession) => <>{data?.truckUu?.licensePalate}</>,
							},
							{
								title: 'Từ',
								render: (data: IWeightSession) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.fromUu?.name}</p>
										{/* <p>({data?.fromUu?.parentUu?.name || '---'})</p> */}
									</>
								),
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
								title: 'Loại hàng',
								render: (data: IWeightSession) => <>{data?.producTypeUu?.name || '---'}</>,
							},
							{
								title: 'Quy cách',
								render: (data: IWeightSession) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'TL lần 1 (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weight1?.weight)}</>,
							},
							{
								title: 'TL lần 2 (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weight2?.weight || 0)}</>,
							},
							{
								title: 'TL hàng (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weightReal || 0)}</>,
							},
							{
								title: 'Cân lần 1',
								render: (data: IWeightSession) => (
									<>
										{data?.weight1?.scalesMachineUu?.name}
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
										{data?.weight2?.timeScales ? (
											<>
												{data?.weight2?.scalesMachineUu?.name}
												<p>
													<Moment date={data?.weight2?.timeScales} format='HH:mm, DD/MM/YYYY' />
												</p>
											</>
										) : (
											'---'
										)}
									</>
								),
							},
							{
								title: 'Ghi chú',
								render: (data: IWeightSession) => (
									<TippyHeadless
										maxWidth={'100%'}
										interactive
										onClickOutside={() => setUuidDescription('')}
										visible={uuidDescription == data?.uuid}
										placement='bottom'
										render={(attrs) => (
											<div className={styles.main_description}>
												<p>{data?.description}</p>
											</div>
										)}
									>
										<Tippy content='Xem chi tiết mô tả'>
											<p
												onClick={() => {
													if (!data.description) {
														return;
													} else {
														setUuidDescription(uuidDescription ? '' : data.uuid);
													}
												}}
												className={clsx(styles.description, {[styles.active]: uuidDescription == data.uuid})}
											>
												{data?.description || '---'}
											</p>
										</Tippy>
									</TippyHeadless>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 50}
					total={listWeightSession?.data?.pagination?.totalCount}
					dependencies={[
						_id,
						_pageSize,
						_keyword,
						_truckUuid,
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
					]}
				/>
			</div>
		</Fragment>
	);
}

export default TableDetail;
