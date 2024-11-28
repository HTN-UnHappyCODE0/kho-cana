import React from 'react';

import {PropsMainHistoryUpdateDraftShip} from './interfaces';
import styles from './MainHistoryUpdateDraftShip.module.scss';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {IoArrowBackOutline} from 'react-icons/io5';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_TRANSPORT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import priceTagServices from '~/services/priceTagServices';
import {useRouter} from 'next/router';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';

function MainHistoryUpdateDraftShip({}: PropsMainHistoryUpdateDraftShip) {
	// const router = useRouter();
	// const {_page, _pageSize, _customerUuid, _specUuid, _productTypeUuid, _transportType} = router.query;
	// // const historyPriceTag = useQuery(
	// // 	[QUERY_KEY.table_lich_su_gia_tien_hang, _page, _pageSize, _customerUuid, _specUuid, _productTypeUuid, _transportType],
	// // 	{
	// // 		queryFn: () =>
	// // 			httpRequest({
	// // 				isList: true,
	// // 				http: priceTagServices.listPriceTagHistory({
	// // 					page: Number(_page) || 1,
	// // 					pageSize: Number(_pageSize) || 200,
	// // 					keyword: '',
	// // 					isPaging: CONFIG_PAGING.IS_PAGING,
	// // 					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
	// // 					typeFind: CONFIG_TYPE_FIND.TABLE,
	// // 					status: null,
	// // 					customerUuid: (_customerUuid as string) || '',
	// // 					specUuid: (_specUuid as string) || '',
	// // 					productTypeUuid: (_productTypeUuid as string) || '',
	// // 					priceTagUuid: '',
	// // 					state: null,
	// // 					transportType: Number(_transportType) || null,
	// // 					partnerUuid: '',
	// // 				}),
	// // 			}),
	// // 		select(data) {
	// // 			return data;
	// // 		},
	// // 	}
	// // );
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Link
					href={'#'}
					onClick={(e) => {
						e.preventDefault();
						window.history.back();
					}}
					className={styles.header_title}
				>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					{/* <p>Lịch sửa thay đổi mớn tàu {detailCustomer?.code}</p> */}
				</Link>
			</div>
			{/* <div className={styles.table}>
				<DataWrapper
					data={historyPriceTag?.data?.items || []}
					loading={historyPriceTag?.isLoading}
					noti={<Noti disableButton title='Dữ liệu trống!' des='Hiện tại chưa có lịch sử thay đổi mớn tàu nào, thêm ngay?' />}
				>
					<Table
						data={historyPriceTag?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô/Số phiếu',
								render: (data: any) => <p style={{fontWeight: 500, color: '#3772FF'}}>{'---'}</p>,
							},
							{
								title: 'Tươi theo mớn (tấn)',
								render: (data: any) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Tổng lượng khô (tấn)',
								render: (data: any) => <>{data?.specUu?.name || '---'}</>,
							},
							{
								title: 'Độ khô',
								render: (data: any) => <>{'---'}</>,
							},
							{
								title: 'Tươi theo mớn mới (tấn)',
								render: (data: any) => <>{convertCoin(0) || 0} </>,
							},
							{
								title: 'Tươi theo mớn mới (tấn)',
								render: (data: any) => <>{convertCoin(data?.pricetagUu?.amount) || 0} </>,
							},
							{
								title: 'Tổng lượng khô mới (tấn)',
								render: (data: any) => '---',
							},
							{
								title: 'Độ khô mới',
								render: (data: any) => <>{'---'}</>,
							},
							{
								title: 'Lý do',
								render: (data: any) => <>{'---'}</>,
							},
							{
								title: 'Thời gia thay đổi',
								render: (data: any) => (data.created ? <Moment date={data.created} format='HH:mm, DD/MM/YYYY' /> : '---'),
							},
							{
								title: 'Người thay đổi',
								render: (data: any) => <>{data?.accountUu?.username || '---'}</>,
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={historyPriceTag?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[_pageSize, _customerUuid, _specUuid, _productTypeUuid, _transportType]}
				/>
			</div> */}
		</div>
	);
}

export default MainHistoryUpdateDraftShip;
