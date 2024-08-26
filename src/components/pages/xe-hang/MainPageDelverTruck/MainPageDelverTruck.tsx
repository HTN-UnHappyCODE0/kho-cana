import React, {useState} from 'react';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {ITruck, PropsMainPageDelverTruck} from './interfaces';
import styles from './MainPageDelverTruck.module.scss';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import Table from '~/components/common/Table';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import Image from 'next/image';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, OWNEW_TYPE_TRUCK, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import FilterCustom from '~/components/common/FilterCustom';
import Loading from '~/components/common/Loading';
import TagStatus from '~/components/common/TagStatus';
import {HiOutlineLockClosed} from 'react-icons/hi';
import clsx from 'clsx';
import {convertCoin} from '~/common/funcs/convertCoin';
import TippyHeadless from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';
import truckServices from '~/services/truckServices';

function MainPageDelverTruck({}: PropsMainPageDelverTruck) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _status} = router.query;

	const [dataStatus, setDataStatus] = useState<ITruck | null>(null);
	const [uuidTruck, setUuidTruck] = useState<string>('');

	const listTruck = useQuery([QUERY_KEY.table_xe_hang, _page, _pageSize, _keyword, _status], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: truckServices.listTruck({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: !!_status ? Number(_status) : null,
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
				http: truckServices.changeStatus({
					uuid: dataStatus?.uuid!,
					status: dataStatus?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.table_xe_hang, _page, _pageSize, _keyword, _status]);
			}
		},
	});
	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatus.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã xe hàng' />
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
						onClick={() => router.push('/xe-hang/them-moi')}
						icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
					>
						Thêm xe hàng
					</Button>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={listTruck?.data?.items || []}
					loading={listTruck?.isLoading}
					noti={
						<Noti
							titleButton='Thêm xe hàng'
							onClick={() => router.push('/xe-hang/them-moi')}
							des='Hiện tại chưa có xe hàng nào, thêm ngay?'
						/>
					}
				>
					<Table
						data={listTruck?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: ITruck, index: number) => <>{index + 1} </>,
							},
							{
								title: 'Mã xe',
								render: (data: ITruck) => <>{data?.code || '---'}</>,
							},
							{
								title: 'Loại xe',
								render: (data: ITruck) => <>{data?.trucktype || '---'}</>,
							},
							{
								title: 'Biển số',
								render: (data: ITruck) => <>{data?.licensePalate || '---'}</>,
							},
							{
								title: 'RFID',
								render: (data: ITruck) => (
									<div className={styles.ruler}>
										<TippyHeadless
											maxWidth={'100%'}
											interactive
											onClickOutside={() => setUuidTruck('')}
											visible={uuidTruck == data?.uuid}
											placement='bottom'
											render={(attrs) => (
												<div className={styles.main_ruler}>
													<div className={styles.content}>
														{data?.rfid?.map((v, i) => (
															<div key={i} className={styles.item}>
																<div className={styles.dot}></div>
																<p>{v?.code}</p>
															</div>
														))}
													</div>
												</div>
											)}
										>
											<Tippy content='Xem RFID'>
												<p
													onClick={() => {
														if (data?.rfid?.length == 0) {
															return;
														} else {
															setUuidTruck(uuidTruck ? '' : data.uuid);
														}
													}}
													className={clsx(styles.value, {[styles.active]: uuidTruck == data.uuid})}
												>
													{data?.rfid.length || 0}
												</p>
											</Tippy>
										</TippyHeadless>
									</div>
								),
							},
							{
								title: 'Khối lượng nhỏ nhất',
								render: (data: ITruck) => <>{convertCoin(data?.minWeight) || '---'}</>,
							},
							{
								title: 'Khối lượng lớn nhất',
								render: (data: ITruck) => <>{convertCoin(data?.maxWeight) || '---'}</>,
							},
							{
								title: 'Phân loại xe',
								render: (data: ITruck) => (
									<>
										{data?.ownerType == OWNEW_TYPE_TRUCK.XE_CONG_TY && <span>Xe công ty</span>}
										{data?.ownerType == OWNEW_TYPE_TRUCK.XE_KHACH_HANG && <span>Xe khách hàng</span>}
									</>
								),
							},
							{
								title: 'Người quản lý',
								render: (data: ITruck) => <>{data?.managerUu?.fullName || '---'} </>,
							},
							{
								title: 'Trạng thái',
								render: (data: ITruck) => <TagStatus status={data?.status} />,
							},
							{
								title: 'Tác vụ',
								render: (data: ITruck) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											href={`/xe-hang/chinh-sua?_id=${data?.uuid}`}
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
					total={listTruck?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword, _status]}
				/>
			</div>
			<Dialog
				danger
				open={!!dataStatus}
				onClose={() => setDataStatus(null)}
				title={dataStatus?.status == CONFIG_STATUS.BI_KHOA ? 'Mở khóa xe hàng' : 'Khóa xe hàng'}
				note={
					dataStatus?.status == CONFIG_STATUS.BI_KHOA
						? 'Bạn có chắc chắn muốn mở khóa xe hàng này?'
						: 'Bạn có chắc chắn muốn khóa xe hàng này?'
				}
				onSubmit={funcChangeStatus.mutate}
			/>
		</div>
	);
}

export default MainPageDelverTruck;
