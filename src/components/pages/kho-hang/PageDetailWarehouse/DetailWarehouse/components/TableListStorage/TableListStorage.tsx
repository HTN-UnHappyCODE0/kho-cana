import {useRouter} from 'next/router';
import React, {Fragment} from 'react';

import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';

import {IDataListStorage, PropsTableListStorage} from './interfaces';
import styles from './TableListStorage.module.scss';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Link from 'next/link';
import {convertCoin} from '~/common/funcs/convertCoin';
import storageServices from '~/services/storageServices';

function TableListStorage({}: PropsTableListStorage) {
	const router = useRouter();
	const {_id, _page, _pageSize} = router.query;

	const listStorage = useQuery([QUERY_KEY.table_bai, _page, _pageSize, _id], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: storageServices.listStorage({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.FILTER,
					warehouseUuid: _id as string,
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
		enabled: !!_id,
	});

	return (
		<Fragment>
			<DataWrapper data={listStorage?.data?.items || []} loading={listStorage.isLoading} noti={<Noti disableButton />}>
				<Table
					data={listStorage?.data?.items || []}
					column={[
						{
							title: 'STT',
							render: (data: IDataListStorage, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Mã kho hàng',
							render: (data: IDataListStorage) => <span>{data?.code || '---'}</span>,
						},
						{
							title: 'Tên kho hàng',
							fixedLeft: true,
							render: (data: IDataListStorage) => <span>{data?.name || '---'}</span>,
						},
						{
							title: 'Loại hàng',
							render: (data: IDataListStorage) => <span>{data?.productUu?.name || '---'}</span>,
						},
						{
							title: 'Quốc gia',
							render: (data: IDataListStorage) => <span>{data?.qualityUu?.name || '---'}</span>,
						},
						// {
						// 	title: 'Khách hàng',
						// 	render: (data: IDataListStorage) => <span>{data?.countCustomer || 0}</span>,
						// },
						{
							title: 'Tổng lượng tươi (Tấn)',
							render: (data: IDataListStorage) => <span style={{color: '#2A85FF'}}>{convertCoin(data?.totalAmountMt)}</span>,
						},
						{
							title: 'Tổng lượng quy khô (Tấn)',
							render: (data: IDataListStorage) => (
								<span style={{color: '#2A85FF'}}>{convertCoin(data?.totalAmountBdmt)}</span>
							),
						},
						{
							title: 'Khối lượng quy khô nhập (Tấn)',
							render: (data: IDataListStorage) => <span>{convertCoin(data?.totalAmountIn) || 0}</span>,
						},
						{
							title: 'Lượng quy khô xuất (Tấn)',
							render: (data: IDataListStorage) => <span>{convertCoin(data?.totalAmountOut) || 0}</span>,
						},
						{
							title: 'Tác vụ',
							fixedRight: true,
							render: (data: IDataListStorage) => (
								<Link href={`/kho-hang/${data?.uuid}?_storage=true`} className={styles.linkdetail}>
									Chi tiết
								</Link>
							),
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				total={listStorage?.data?.pagination?.totalCount}
				pageSize={Number(_pageSize) || 20}
				dependencies={[_pageSize, _id]}
			/>
		</Fragment>
	);
}

export default TableListStorage;
