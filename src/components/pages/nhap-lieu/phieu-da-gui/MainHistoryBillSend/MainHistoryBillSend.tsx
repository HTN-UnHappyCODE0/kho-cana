import React, {useState} from 'react';

import {PropsMainHistoryBillSend} from './interfaces';
import styles from './MainHistoryBillSend.module.scss';
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
import {formatDrynessAvg} from '~/common/funcs/optionConvert';
import TippyHeadless from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import weightSessionServices from '~/services/weightSessionServices';

function MainHistoryBillSend({}: PropsMainHistoryBillSend) {
	const router = useRouter();

	const {_page, _pageSize, _BillSendUuid} = router.query;

	const [uuidDescription, setUuidDescription] = useState<string>('');

	// const historyBillSend = useQuery(
	// 	[QUERY_KEY.table_lich_su_thay_doi_do_kho, _page, _pageSize, _BillSendUuid],
	// 	{
	// 		queryFn: () =>
	// 			httpRequest({
	// 				isList: true,
	// 				http: weightSessionServices.({
	// 					page: Number(_page) || 1,
	// 					pageSize: Number(_pageSize) || 200,
	// 					keyword: '',
	// 					isPaging: CONFIG_PAGING.IS_PAGING,
	// 					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
	// 					typeFind: CONFIG_TYPE_FIND.TABLE,

	// 				}),
	// 			}),
	// 		select(data) {
	// 			return data;
	// 		},
	// 	}
	// );

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Link
					href='#'
					onClick={(e) => {
						e.preventDefault();
						window.history.back();
					}}
					className={styles.header_title}
				>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Lịch sử thay đổi lô</p>
				</Link>
			</div>

			{/* <div className={styles.table}>
				<DataWrapper
					data={historyBillSend?.data?.items || []}
					loading={historyBillSend?.isLoading}
					noti={<Noti disableButton title='Dữ liệu trống!' des='Hiện tại chưa có lịch sử giá tiền nào, thêm ngay?' />}
				>
					<Table
						data={historyBillSend?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: any) => (
									<Link href={``} className={styles.link}>
										{data?.billUu?.code}
									</Link>
								),
							},
							{
								title: 'Độ khô ban đầu',
								render: (data: any) => <p className={styles.dryness}>{formatDrynessAvg(data?.dryness)} %</p>,
							},
							{
								title: 'Độ khô mới',
								render: (data: any) => <p className={styles.dryness}>{formatDrynessAvg(data?.dryness)} %</p>,
							},
							{
								title: 'Mô tả',
								render: (data: any) => (
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
							{
								title: 'Thời gian thay đổi',
								render: (data: any) => <Moment date={data?.created} format='HH:mm - DD/MM/YYYY' />,
							},
							{
								title: 'Người thay đổi',
								render: (data: any) => <>{data?.accountUu?.username || '---'}</>,
							},
							{
								title: 'Người duyệt',
								render: (data: any) => <>{data?.accountUu?.username || '---'}</>,
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={historyBillSend?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[_pageSize, _BillSendUuid]}
				/>
			</div> */}
		</div>
	);
}

export default MainHistoryBillSend;
