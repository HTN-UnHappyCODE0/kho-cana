import React, {Fragment} from 'react';
import {PropsTableUpdateBillHistory} from './interfaces';
import styles from './TableUpdateBillHistory.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import clsx from 'clsx';
import Search from '~/components/common/Search';
import {useRouter} from 'next/router';

import Noti from '~/components/common/DataWrapper/components/Noti';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_UPDATE_BILL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import weightSessionServices from '~/services/weightSessionServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import {convertWeight} from '~/common/funcs/optionConvert';
import batchBillServices from '~/services/batchBillServices';

function TableUpdateBillHistory({}: PropsTableUpdateBillHistory) {
	const router = useRouter();

	const {_id} = router.query;

	const detailBatchBillAudit = useQuery([QUERY_KEY.chi_tiet_lich_su_thay_doi_phieu, _id], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: batchBillServices.ViewActionAudit({
					uuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	return (
		<Fragment>
			{/* <div className={clsx('mt')}>
				<div className={styles.header}>
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search keyName='_keyword' placeholder='Tìm kiếm theo logo, biển số xe' />
						</div>
					</div>
				</div>
			</div> */}
			<div className={styles.table}>
				<DataWrapper
					data={detailBatchBillAudit?.data?.items || []}
					loading={detailBatchBillAudit?.isLoading}
					noti={<Noti des='Dữ liệu trống?' disableButton />}
				>
					<Table
						data={detailBatchBillAudit?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Tài khoản',
								fixedLeft: true,
								render: (data: any) => <>{data?.username || '---'}</>,
							},
							{
								title: 'Tác vụ',
								render: (data: any) => <>{data?.method || '---'}</>,
							},
							{
								title: 'Trang thái',
								render: (data: any) => (
									<p style={{fontWeight: 600}}>
										{data?.actionId == TYPE_UPDATE_BILL.DUYET_PHIEU && (
											<span style={{color: '#6FD195'}}>Duyệt phiếu</span>
										)}
										{data?.actionId == TYPE_UPDATE_BILL.DOI_TRANG_THAI && (
											<span style={{color: '#FFAE4C'}}>Đổi trạng thái</span>
										)}
										{data?.actionId == TYPE_UPDATE_BILL.CHINH_SUA && <span style={{color: '#3CC3DF'}}>Chỉnh sửa</span>}
										{data?.actionId == TYPE_UPDATE_BILL.TU_CHOI_DUYET && (
											<span style={{color: '#D95656'}}>Từ chối duyệt</span>
										)}
									</p>
								),
							},
							{
								title: 'Thời gian',
								render: (data: any) => (
									<>{data?.created ? <Moment date={data?.created} format='HH:mm, DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: 'Lý do',
								render: (data: any) => <>{data?.description || '---'}</>,
							},
						]}
					/>
				</DataWrapper>
				{/* <Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 50}
					total={detailBatchBillAudit?.data?.pagination?.totalCount}
					dependencies={[_id, _keyword, _pageSize]}
				/> */}
			</div>
		</Fragment>
	);
}

export default TableUpdateBillHistory;
