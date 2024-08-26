import React from 'react';

import {IWeightSessionByTruck, PropsMainWeightSessionCollection} from './interfaces';
import styles from './MainWeightSessionCollection.module.scss';
import Search from '~/components/common/Search';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_SCALES} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import batchBillServices from '~/services/batchBillServices';
import FilterCustom from '~/components/common/FilterCustom';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {useRouter} from 'next/router';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import weightSessionServices from '~/services/weightSessionServices';

function MainWeightSessionCollection({}: PropsMainWeightSessionCollection) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _billUuid, _dateFrom, _dateTo} = router.query;

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

	const listWeightSessionGroupTruck = useQuery(
		[QUERY_KEY.table_luot_can_nhom_theo_xe, _page, _pageSize, _keyword, _billUuid, _dateFrom, _dateTo],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: weightSessionServices.getListWeightSessionGroupTruck({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 20,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						billUuid: !!_billUuid ? (_billUuid as string) : '',
						codeEnd: null,
						codeStart: null,
						isBatch: null,
						scalesType: [],
						specUuid: '',
						storageUuid: '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						truckUuid: '',
						customerUuid: '',
						groupBy: 1,
						productTypeUuid: '',
						shift: null,
						status: [],
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
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo số phiếu' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Lô'
							query='_billUuid'
							listFilter={listBills?.data?.map((v: any) => ({
								id: v.uuid,
								name: v?.code,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<DateRangerCustom />
					</div>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listWeightSessionGroupTruck?.data?.items || []}
					loading={listWeightSessionGroupTruck?.isLoading}
					noti={<Noti des='Hiện tại chưa có lượt cân nào!' disableButton />}
				>
					<Table
						data={listWeightSessionGroupTruck?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IWeightSessionByTruck, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Logo xe',
								render: (data: IWeightSessionByTruck) => <>{data?.truckUu?.code}</>,
							},
							{
								title: 'Biển số xe',
								render: (data: IWeightSessionByTruck) => (
									<p style={{color: '#2D74FF', fontWeight: 600}}>{data?.truckUu?.licensePalate}</p>
								),
							},
							{
								title: 'Số lượt cân',
								render: (data: IWeightSessionByTruck) => <p style={{fontWeight: 600}}>{data?.count}</p>,
							},
							{
								title: 'Tổng TL 1 (KG)',
								render: (data: IWeightSessionByTruck) => <>{convertCoin(data?.weight1?.weight)}</>,
							},
							{
								title: 'Tổng TL 2 (KG)',
								render: (data: IWeightSessionByTruck) => <>{convertCoin(data?.weight2?.weight)}</>,
							},
							{
								title: 'Tổng TL hàng (KG)',
								render: (data: IWeightSessionByTruck) => <>{convertCoin(data?.weightReal)}</>,
							},
							{
								title: 'Cân lần đầu',
								render: (data: IWeightSessionByTruck) => (
									<Moment date={data?.weight1?.timeScales} format='HH:mm, DD/MM/YYYY' />
								),
							},
							{
								title: 'Cân lần cuối',
								render: (data: IWeightSessionByTruck) => (
									<Moment date={data?.weight2?.timeScales} format='HH:mm, DD/MM/YYYY' />
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={listWeightSessionGroupTruck?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _billUuid, _dateFrom, _dateTo]}
				/>
			</div>
		</div>
	);
}

export default MainWeightSessionCollection;
