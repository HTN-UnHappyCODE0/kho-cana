import {useRouter} from 'next/router';
import {IInventory, PropsTableHistoryInventory} from './interfaces';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import storageServices from '~/services/storageServices';
import {Fragment} from 'react';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import Link from 'next/link';
import styles from './TableHistoryInventory.module.scss';
import Moment from 'react-moment';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Popup from '~/components/common/Popup';
import PopupTableHistoryInventory from '../PopupTableHistoryInventory';
import {convertCoin} from '~/common/funcs/convertCoin';

function TableHistoryInventory({}: PropsTableHistoryInventory) {
	const router = useRouter();
	const {_id, _page, _uuidInventory, _pageSize} = router.query;

	const listInventory = useQuery([QUERY_KEY.table_kiem_ke_bai, _uuidInventory, _page, _pageSize, _id], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: storageServices.listHistoryInventory({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.FILTER,
					storageUuid: _id as string,
					timeEnd: null,
					timeStart: null,
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
			<DataWrapper
				data={listInventory?.data?.items || []}
				loading={listInventory.isLoading}
				noti={<Noti disableButton title='Dữ liệu trống!' des='Lịch sữ kiểm kê trống!' />}
			>
				<Table
					data={listInventory?.data?.items || []}
					column={[
						{
							title: 'STT',
							render: (data: IInventory, index: number) => <>{index + 1}</>,
						},

						{
							title: 'Tổng lượng quy khô ban đầu (tấn)',
							render: (data: IInventory) => <span>{convertCoin(data?.totalAmountBefore) || 0}</span>,
						},
						{
							title: 'Tổng lượng quy khô còn lại (tấn)',
							render: (data: IInventory) => <span>{convertCoin(data?.totalAmountAfter) || 0}</span>,
						},

						{
							title: 'Thời gian thay đổi',
							render: (data: IInventory) => <Moment date={data?.created} format='HH:mm,DD/MM/YYYY' />,
						},
						{
							title: 'Người thay đổi ',
							render: (data: IInventory) => <span>{data?.accountUu?.username || '---'}</span>,
						},
						{
							title: 'Tác vụ',
							fixedRight: true,
							render: (data: IInventory) => (
								<Link href={`${router.asPath}&_uuidInventory=${data?.uuid}`} className={styles.linkdetail}>
									Chi tiết
								</Link>
							),
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				total={listInventory?.data?.pagination?.totalCount}
				pageSize={Number(_pageSize) || 20}
				dependencies={[_pageSize, _id]}
			/>
			<Popup
				open={!!_uuidInventory}
				onClose={() => {
					const {_uuidInventory, ...rest} = router.query;
					router.replace({
						pathname: router.pathname,
						query: {...rest},
					});
				}}
			>
				<PopupTableHistoryInventory
					onClose={() => {
						const {_uuidInventory, ...rest} = router.query;
						router.replace({
							pathname: router.pathname,
							query: {...rest},
						});
					}}
				/>
			</Popup>
		</Fragment>
	);
}

export default TableHistoryInventory;
