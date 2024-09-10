import Moment from 'react-moment';
import {useRouter} from 'next/router';
import React, {Fragment} from 'react';

import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';

import {IDataTableCustomerStorage, PropsTableCustomer} from './interfaces';
import styles from './TableCustommer.module.scss';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_CUSTOMER} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Link from 'next/link';
import storageServices from '~/services/storageServices';
import {convertCoin} from '~/common/funcs/convertCoin';

function TableCustomer({setTotalCustomer}: PropsTableCustomer) {
	const router = useRouter();

	const {_id, _page, _pageSize} = router.query;

	const listCustomerStorage = useQuery([QUERY_KEY.table_khach_hang_bai, _page, _pageSize, _id], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: storageServices.historyStorageCustomer({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					storageUuid: _id as string,
					timeEnd: null,
					timeStart: null,
					status: null,
				}),
			}),
		select(data) {
			if (data) {
				setTotalCustomer(data?.items.length || 0);
				return data;
			}
		},
		enabled: !!_id,
	});

	return (
		<Fragment>
			<DataWrapper
				data={listCustomerStorage?.data?.items || []}
				loading={listCustomerStorage.isLoading}
				noti={<Noti disableButton />}
			>
				<Table
					data={listCustomerStorage?.data?.items || []}
					column={[
						{
							title: 'STT',
							render: (data: IDataTableCustomerStorage, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Tên NCC',
							fixedLeft: true,
							render: (data: IDataTableCustomerStorage) => <span>{data?.customerUu?.name || '---'}</span>,
						},

						{
							title: 'Loại',
							render: (data: IDataTableCustomerStorage) => (
								<span>
									{data?.type == TYPE_CUSTOMER.NHA_CUNG_CAP
										? 'Nhập'
										: data?.type == TYPE_CUSTOMER.KH_XUAT
										? 'Xuất'
										: '---'}
								</span>
							),
						},
						{
							title: 'Lượng quy khô nhập (tấn)',
							render: (data: IDataTableCustomerStorage) => (
								<span style={{color: '#2D74FF'}}>{convertCoin(data?.amount)}</span>
							),
						},
						{
							title: 'Thay đổi gần nhất',
							render: (data: IDataTableCustomerStorage) => <Moment date={data?.dayChange} format='HH:mm, DD/MM/YYYY' />,
						},
						{
							title: 'Tác vụ',
							fixedRight: true,
							render: (data: IDataTableCustomerStorage) => (
								<Link href={`/xuong/${data?.customerUu?.uuid}`} className={styles.linkdetail}>
									Chi tiết
								</Link>
							),
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				total={listCustomerStorage?.data?.pagination?.totalCount}
				pageSize={Number(_pageSize) || 20}
				dependencies={[_pageSize, _id]}
			/>
		</Fragment>
	);
}

export default TableCustomer;
