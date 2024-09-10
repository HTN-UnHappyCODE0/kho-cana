import React, {Fragment} from 'react';
import {IDataTableHistoryWarehouse, PropsTableHistoryWarehouse} from './interfaces';
import styles from './TableHistoryWarehouse.module.scss';
import {useRouter} from 'next/router';
import DataWrapper from '~/components/common/DataWrapper';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import Search from '~/components/common/Search';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Noti from '~/components/common/DataWrapper/components/Noti';
import warehouseServices from '~/services/warehouseServices';

function TableHistoryWarehouse({}: PropsTableHistoryWarehouse) {
	const router = useRouter();

	const {_id, _page, _pageSize, _keyword, _dateFrom, _dateTo} = router.query;

	const listHistoryStorage = useQuery([QUERY_KEY.table_lich_su_bai, _page, _pageSize, _keyword, _dateFrom, _dateTo, _id], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: warehouseServices.historyWarehouseInOut({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: null,
					warehouseUuid: _id as string,
					timeEnd: _dateTo ? (_dateTo as string) : null,
					timeStart: _dateFrom ? (_dateFrom as string) : null,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	return (
		<Fragment>
			<div className={styles.header}>
				<div className={styles.main_search}>
					{/* <div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm' />
					</div> */}

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' />
					</div>
				</div>
			</div>
			<div className='mt'>
				<DataWrapper
					data={listHistoryStorage?.data?.items || []}
					loading={listHistoryStorage.isLoading}
					noti={<Noti disableButton />}
				>
					<Table
						data={listHistoryStorage?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IDataTableHistoryWarehouse, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Thời gian',
								render: (data: IDataTableHistoryWarehouse) => <Moment date={data?.dayUpdate} format='DD/MM/YYYY' />,
							},

							{
								title: 'Tổng lượng quy khô nhập (tấn)',
								render: (data: IDataTableHistoryWarehouse) => (
									<span style={{color: '#2D74FF'}}>{convertCoin(data?.amountIn)}</span>
								),
							},
							{
								title: 'Tổng lượng quy khô xuất (tấn)',
								render: (data: IDataTableHistoryWarehouse) => (
									<span style={{color: '#2D74FF'}}>{convertCoin(data?.amountOut)}</span>
								),
							},
							{
								title: 'Tổng lượng quy khô chuyển kho (tấn)',
								render: (data: IDataTableHistoryWarehouse) => (
									<span style={{color: '#2D74FF'}}>
										{convertCoin(Number(data.amountChangeIn) - Number(data?.amountChangeOut))}
									</span>
								),
							},
							// {
							// 	title: 'Tổng hàng trong kho',
							// 	render: (data: IDataTableHistoryWarehouse) => (
							// 		<span style={{color: '#2D74FF'}}>{convertCoin(data?.totalAmount)}</span>
							// 	),
							// },
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listHistoryStorage?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword, _dateFrom, _dateTo, _id]}
				/>
			</div>
		</Fragment>
	);
}

export default TableHistoryWarehouse;
