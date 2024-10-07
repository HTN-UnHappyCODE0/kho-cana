import React from 'react';
import {ICustomer, PropsPageCustomerExport} from './interfaces';
import styles from './PageCustomerExport.module.scss';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_CUSTOMER,
	TYPE_PARTNER,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import partnerServices from '~/services/partnerServices';
import IconCustom from '~/components/common/IconCustom';
import {Eye} from 'iconsax-react';
import Link from 'next/link';

function PageCustomerExport({}: PropsPageCustomerExport) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _partnerUuid} = router.query;

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap_xuat], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: partnerServices.listPartner({
					page: 1,
					pageSize: 20,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					userUuid: '',
					provinceId: '',
					type: TYPE_PARTNER.KH_XUAT,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listCustomerStorage = useQuery([QUERY_KEY.table_khach_hang_xuat, _keyword, _page, _pageSize, _partnerUuid], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: customerServices.listCustomerStorage({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					specUuid: '',
					userUuid: '',
					provinceId: '',
					status: CONFIG_STATUS.HOAT_DONG,
					typeCus: TYPE_CUSTOMER.KH_XUAT,
					partnerUUid: (_partnerUuid as string) || null,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					isPaging: CONFIG_PAGING.IS_PAGING,
				}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên khách hàng xuất' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Khách hàng'
							query='_partnerUuid'
							listFilter={listPartner?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={listCustomerStorage.data?.items || []}
					loading={listCustomerStorage.isLoading}
					noti={<Noti disableButton des='Hiện tại chưa có khách hàng dịch vụ nào!' />}
				>
					<Table
						data={listCustomerStorage.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: ICustomer, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã KH',
								fixedLeft: true,
								render: (data: ICustomer) => (
									<Link href={`/khach-hang-xuat/${data.customerUu?.uuid}`} className={styles.link}>
										{data?.customerUu?.code || '---'}
									</Link>
								),
							},

							{
								title: 'Tên KH',
								render: (data: ICustomer) => <>{data?.customerUu?.name || '---'}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: ICustomer) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Quốc gia',
								render: (data: ICustomer) => <>{data?.qualityUu?.name || '---'}</>,
							},
							{
								title: 'Quy cách',
								render: (data: ICustomer) => <>{data?.specUu?.name || '---'}</>,
							},
							{
								title: 'Vận chuyển',
								render: (data: ICustomer) => (
									<>
										{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
										{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
									</>
								),
							},
							{
								title: 'Bãi',
								render: (data: ICustomer) => <>{data?.storageUu?.name || '---'}</>,
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: ICustomer) => (
									<IconCustom
										edit
										icon={<Eye fontSize={20} fontWeight={600} />}
										tooltip='Xem chi tiết'
										color='#777E90'
										href={`/khach-hang-xuat/${data.customerUu.uuid}`}
									/>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listCustomerStorage?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 50}
					dependencies={[_pageSize, _keyword, _partnerUuid]}
				/>
			</div>
		</div>
	);
}

export default PageCustomerExport;
