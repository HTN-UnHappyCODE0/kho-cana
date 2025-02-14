import React from 'react';

import {IWeightSessionByTruck, PropsMainWeightSessionCollection} from './interfaces';
import styles from './MainWeightSessionCollection.module.scss';
import Search from '~/components/common/Search';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_DATE} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {useRouter} from 'next/router';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import weightSessionServices from '~/services/weightSessionServices';
import {convertWeight} from '~/common/funcs/optionConvert';
import DashbroadWeightsession from '~/components/common/DashbroadWeightsession';
import icons from '~/constants/images/icons';
import GridColumn from '~/components/layouts/GridColumn';
import clsx from 'clsx';

function MainWeightSessionCollection({}: PropsMainWeightSessionCollection) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _dateFrom, _dateTo} = router.query;

	const listWeightSessionGroupTruck = useQuery([QUERY_KEY.table_luot_can_nhom_theo_xe, _page, _pageSize, _keyword, _dateFrom, _dateTo], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: weightSessionServices.getListWeightSessionGroupTruck({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					billUuid: '',
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
	});

	const {data: dashbroadWeightsession, isLoading} = useQuery(
		[QUERY_KEY.thong_ke_tong_hop_phieu_nhom_theo_xe, _page, _pageSize, _keyword, _dateFrom, _dateTo],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: weightSessionServices.dashbroadWeightsession({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						isBatch: null,
						scalesType: [],
						storageUuid: '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: '',
						productTypeUuid: '',
						billUuid: '',
						codeEnd: null,
						codeStart: null,
						specUuid: '',
						status: [],
						truckUuid: [],
						shift: null,
						shipUuid: '',
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
						<Search keyName='_keyword' placeholder='Tìm kiếm theo biển số xe' />
					</div>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div>
				</div>
			</div>
			<div className={clsx('mt')}>
				<GridColumn col_5>
					<DashbroadWeightsession
						text='Tổng khối lượng cân'
						value={convertWeight(dashbroadWeightsession?.totalWeight)}
						icons={icons.tongkhoiluongcan}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Số chuyến xe'
						value={dashbroadWeightsession?.totalSession || 0}
						icons={icons.sochuyenxe}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng hàng nhập'
						value={convertWeight(dashbroadWeightsession?.totalWeightIn)}
						icons={icons.khoiluonghangnhap}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng hàng xuất'
						value={convertWeight(dashbroadWeightsession?.totalWeightOut)}
						icons={icons.khoiluonghangxuat}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng cân dịch vụ'
						value={convertWeight(dashbroadWeightsession?.totalWeightService)}
						icons={icons.khoiluonghangdichvu}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng chuyển kho'
						value={convertWeight(dashbroadWeightsession?.totalWeightChange)}
						icons={icons.khoiluonghangchuyenkho}
						loading={isLoading}
					/>
					<DashbroadWeightsession
						text='Khối lượng xuất thẳng'
						value={convertWeight(dashbroadWeightsession?.totalWeightOutDirectly)}
						icons={icons.khoiluonghangxuatthang}
						loading={isLoading}
					/>
				</GridColumn>
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
								fixedLeft: true,
								render: (data: IWeightSessionByTruck) => <>{data?.truckUu?.code}</>,
							},
							{
								title: 'Biển số xe',
								render: (data: IWeightSessionByTruck) => (
									<p style={{color: '#2D74FF', fontWeight: 600}}>{data?.truckUu?.licensePalate || '---'}</p>
								),
							},
							{
								title: 'Số lượt cân',
								render: (data: IWeightSessionByTruck) => <p style={{fontWeight: 600}}>{data?.count}</p>,
							},
							{
								title: 'Tổng khối lượng 1 (Tấn)',
								render: (data: IWeightSessionByTruck) => <>{convertWeight(data?.weight1?.weight)}</>,
							},
							{
								title: 'Tổng khối lượng 2 (Tấn)',
								render: (data: IWeightSessionByTruck) => <>{convertWeight(data?.weight2?.weight)}</>,
							},
							{
								title: 'Tổng khối lượng hàng (Tấn)',
								render: (data: IWeightSessionByTruck) => <>{convertWeight(data?.weightReal)}</>,
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
					pageSize={Number(_pageSize) || 200}
					total={listWeightSessionGroupTruck?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _dateFrom, _dateTo]}
				/>
			</div>
		</div>
	);
}

export default MainWeightSessionCollection;
