import React, {Fragment} from 'react';
import {PropsTableListTruck} from './interfaces';
import styles from './TableListTruck.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import clsx from 'clsx';
import Search from '~/components/common/Search';
import {useRouter} from 'next/router';

import Noti from '~/components/common/DataWrapper/components/Noti';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import weightSessionServices from '~/services/weightSessionServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';

function TableListTruck({}: PropsTableListTruck) {
	const router = useRouter();

	const {_id, _keyword, _page, _pageSize} = router.query;

	const listWeightSessionGroupTruck = useQuery([QUERY_KEY.table_chi_tiet_xe_hang_phieu_can, _page, _pageSize, _keyword, _id], {
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
					billUuid: _id as string,
					codeEnd: null,
					codeStart: null,
					isBatch: null,
					scalesType: [],
					specUuid: '',
					storageUuid: '',
					timeEnd: null,
					timeStart: null,
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
		enabled: !!_id,
	});

	return (
		<Fragment>
			<div className={clsx('mt')}>
				<div className={styles.header}>
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search keyName='_keyword' placeholder='Tìm kiếm theo logo, biển số xe' />
						</div>
					</div>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listWeightSessionGroupTruck?.data?.items || []}
					loading={listWeightSessionGroupTruck?.isLoading}
					noti={<Noti des='Dữ liệu trống?' disableButton />}
				>
					<Table
						data={listWeightSessionGroupTruck?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Logo xe',
								render: (data: any) => <>{data?.truckUu?.code}</>,
							},
							{
								title: 'Biển số xe',
								render: (data: any) => <>{data?.truckUu?.licensePalate}</>,
							},
							{
								title: 'Số lượt cân',
								render: (data: any) => <>{data?.count || 0}</>,
							},
							{
								title: 'Tổng khối lượng hàng (KG)',
								render: (data: any) => <>{convertCoin(data?.weightReal)}</>,
							},
							{
								title: 'Thời gian bắt đầu',
								render: (data: any) => (
									<>
										{data?.weight1?.timeScales ? (
											<Moment date={data?.weight1?.timeScales} format='HH:mm, DD/MM/YYYY' />
										) : (
											'---'
										)}
									</>
								),
							},
							{
								title: 'Thời gian kết thúc',
								render: (data: any) => (
									<>
										{data?.weight2?.timeScales ? (
											<Moment date={data?.weight2?.timeScales} format='HH:mm, DD/MM/YYYY' />
										) : (
											'---'
										)}
									</>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={listWeightSessionGroupTruck?.data?.pagination?.totalCount}
					dependencies={[_id, _keyword, _pageSize]}
				/>
			</div>
		</Fragment>
	);
}

export default TableListTruck;
