import React, {useState} from 'react';

import {PropsMainWeightSessionDirect} from './interfaces';
import styles from './MainWeightSessionDirect.module.scss';
import {useRouter} from 'next/router';
import useDebounce from '~/common/hooks/useDebounce';
import {useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_DATE,
	TYPE_SCALES,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import batchBillServices from '~/services/batchBillServices';
import truckServices from '~/services/truckServices';
import wareServices from '~/services/wareServices';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Moment from 'react-moment';
import {IWeightSession} from '../MainWeightSessionAll/interfaces';
import {convertCoin} from '~/common/funcs/convertCoin';
import Link from 'next/link';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import clsx from 'clsx';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import weightSessionServices from '~/services/weightSessionServices';
import {convertWeight} from '~/common/funcs/optionConvert';

function MainWeightSessionDirect({}: PropsMainWeightSessionDirect) {
	const router = useRouter();
	const {_page, _pageSize, _keyword, _truckUuid, _specUuid, _dateFrom, _dateTo} = router.query;

	const [byFilter, setByFilter] = useState<boolean>(false);
	const [formCode, setFormCode] = useState<{codeStart: string; codeEnd: string}>({
		codeStart: '',
		codeEnd: '',
	});

	const debounceCodeStart = useDebounce(formCode.codeStart, 500);
	const debounceCodeEnd = useDebounce(formCode.codeEnd, 500);

	const listBills = useQuery([QUERY_KEY.dropdown_lo_hang], {
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
					isCreateBatch: 1,
					productTypeUuid: '',
					specificationsUuid: '',
					status: [],
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

	const listTruck = useQuery([QUERY_KEY.dropdown_xe_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: truckServices.listTruck({
					page: 1,
					pageSize: 20,
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

	const listWeightsession = useQuery(
		[
			QUERY_KEY.table_luot_can_phieu_xuat_thang,
			_page,
			_pageSize,
			_keyword,
			_truckUuid,
			_specUuid,
			_dateFrom,
			_dateTo,
			byFilter,
			debounceCodeStart,
			debounceCodeEnd,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: weightSessionServices.listWeightsession({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 20,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						isBatch: null,
						scalesType: [TYPE_SCALES.CAN_TRUC_TIEP],
						storageUuid: '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: '',
						productTypeUuid: '',
						billUuid: '',
						codeEnd: byFilter && !!debounceCodeEnd ? Number(debounceCodeEnd) : null,
						codeStart: byFilter && !!debounceCodeStart ? Number(debounceCodeStart) : null,
						specUuid: !!_specUuid ? (_specUuid as string) : null,
						status: [],
						truckUuid: !!_truckUuid ? (_truckUuid as string) : '',
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
							<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lô' />
						</div>

						<FilterCustom
							isSearch
							name='Biển số xe'
							query='_truckUuid'
							listFilter={listTruck?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.licensePalate,
							}))}
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
							<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
						</div>
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
								title: 'Biển số xe',
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
								title: 'KL 1 (tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weight1?.weight)}</>,
							},
							{
								title: 'KL 2 (tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weight2?.weight)}</>,
							},
							{
								title: 'KL hàng (tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weightReal)}</>,
							},
							{
								title: 'Đến',
								render: (data: IWeightSession) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name}</p>
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
					pageSize={Number(_pageSize) || 20}
					total={listWeightsession?.data?.pagination?.totalCount}
					dependencies={[
						_pageSize,
						_keyword,
						_truckUuid,
						_specUuid,
						_dateFrom,
						_dateTo,
						byFilter,
						debounceCodeStart,
						debounceCodeEnd,
					]}
				/>
			</div>
		</div>
	);
}

export default MainWeightSessionDirect;
