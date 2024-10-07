import React, {useState} from 'react';

import {IShip, PropsMainPageShip} from './interfaces';
import styles from './MainPageShip.module.scss';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Search from '~/components/common/Search';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import FilterCustom from '~/components/common/FilterCustom';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {useRouter} from 'next/router';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import TagStatus from '~/components/common/TagStatus';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {HiOutlineLockClosed} from 'react-icons/hi';
import Dialog from '~/components/common/Dialog';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import TippyHeadless from '@tippyjs/react/headless';
import shipServices from '~/services/shipServices';
import Loading from '~/components/common/Loading';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import Moment from 'react-moment';

function MainPageShip({}: PropsMainPageShip) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const {_page, _pageSize, _keyword, _status} = router.query;

	const [dataStatus, setDataStatus] = useState<IShip | null>(null);
	const [uuidDescription, setUuidDescription] = useState<string>('');

	const listShip = useQuery([QUERY_KEY.table_tau, _page, _pageSize, _keyword, _status], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: shipServices.listShip({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					status: !!_status ? Number(_status) : null,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					isPaging: CONFIG_PAGING.IS_PAGING,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcChangeStatus = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa thành công' : 'Mở khóa thành công',
				http: shipServices.changeStatus({
					uuid: dataStatus?.uuid!,
					status: dataStatus?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.table_tau, _page, _pageSize, _keyword, _status]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatus.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã tàu và logo tàu' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_status'
							listFilter={[
								{
									id: CONFIG_STATUS.BI_KHOA,
									name: 'Bị khóa',
								},
								{
									id: CONFIG_STATUS.HOAT_DONG,
									name: 'Hoạt động',
								},
							]}
						/>
					</div>
				</div>

				<div>
					<Button
						p_8_16
						rounded_2
						onClick={() => router.push('/tau/them-moi')}
						icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
					>
						Thêm tàu
					</Button>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={listShip?.data?.items || []}
					loading={listShip?.isLoading}
					noti={
						<Noti
							titleButton='Thêm tàu'
							onClick={() => router.push('/tau/them-moi')}
							des='Hiện tại chưa có tàu nào, thêm ngay?'
						/>
					}
				>
					<Table
						data={listShip?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IShip, index: number) => <>{index + 1} </>,
							},
							{
								title: 'Mã tàu',
								fixedLeft: true,
								render: (data: IShip) => <>{data?.licensePalate || '---'}</>,
							},
							{
								title: 'Logo tàu',
								render: (data: IShip) => <>{data?.code || '---'}</>,
							},

							{
								title: 'Thời gian tạo',
								render: (data: IShip) => <Moment date={data?.created} format='HH:mm - DD/MM/YYYY'></Moment>,
							},
							{
								title: 'Thời gian cập nhật',
								render: (data: IShip) => <Moment date={data?.updatedTime} format='HH:mm - DD/MM/YYYY'></Moment>,
							},
							{
								title: 'Trạng thái',
								render: (data: IShip) => <TagStatus status={data?.status} />,
							},
							{
								title: 'Mô tả',
								render: (data: IShip) => (
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
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IShip) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											href={`/tau/chinh-sua?_id=${data?.uuid}`}
										/>

										<IconCustom
											lock
											icon={<HiOutlineLockClosed size='22' />}
											tooltip={data?.status === CONFIG_STATUS.HOAT_DONG ? 'Khóa' : ' Mở khóa'}
											color='#777E90'
											onClick={() => setDataStatus(data)}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listShip?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 50}
					dependencies={[_pageSize, _keyword, _status]}
				/>
			</div>
			<Dialog
				danger
				open={!!dataStatus}
				onClose={() => setDataStatus(null)}
				title={dataStatus?.status == CONFIG_STATUS.BI_KHOA ? 'Mở khóa tàu' : 'Khóa tàu'}
				note={
					dataStatus?.status == CONFIG_STATUS.BI_KHOA
						? 'Bạn có chắc chắn muốn mở khóa tàu này?'
						: 'Bạn có chắc chắn muốn khóa tàu này?'
				}
				onSubmit={funcChangeStatus.mutate}
			/>
		</div>
	);
}

export default MainPageShip;
