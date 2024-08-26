import React, {useState} from 'react';
import icons from '~/constants/images/icons';
import Image from 'next/image';
import {IScalesMachine, PropsMainScaleTable} from './interfaces';
import styles from './MainScaleTable.module.scss';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import Popup from '~/components/common/Popup';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import Dialog from '~/components/common/Dialog';
import CreateScaleTable from '../CreateScaleTable';
import UpdateScaleTable from '../UpdateScaleTable';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import FilterCustom from '~/components/common/FilterCustom';
import Loading from '~/components/common/Loading';
import TagStatus from '~/components/common/TagStatus';
import {HiOutlineLockClosed} from 'react-icons/hi';
import Tippy from '@tippyjs/react';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';
import scalesMachineServices from '~/services/scalesMachineServices';
function MainScaleTable({}: PropsMainScaleTable) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _status} = router.query;
	const [uuidDescription, setUuidDescription] = useState<string>('');
	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [dataStatus, setDataStatus] = useState<IScalesMachine | null>(null);
	const [dataUpdate, setDataUpdate] = useState<IScalesMachine | null>(null);

	const listScalesMachine = useQuery([QUERY_KEY.table_ban_can, _page, _pageSize, _keyword, _status], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: scalesMachineServices.listScalesMachine({
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

	const fucnChangeStatus = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa cầu cân thành công!' : 'Mở khóa cầu cân thành công!',
				http: scalesMachineServices.changeStatus({
					uuid: dataStatus?.uuid!,
					status: dataStatus?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.table_ban_can, _page, _pageSize, _keyword, _status]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={fucnChangeStatus.isLoading} />
			<div className={styles.filter}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên cầu cân' />
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
						w_fit
						rounded_2
						icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
						onClick={() => setOpenCreate(true)}
					>
						Thêm cầu cân
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listScalesMachine?.data?.items || []}
					loading={listScalesMachine?.isLoading}
					noti={
						<Noti
							titleButton='Thêm cầu cân'
							onClick={() => setOpenCreate(true)}
							des='Hiện tại chưa có cầu cân nào, thêm ngay?'
						/>
					}
				>
					<Table
						data={listScalesMachine?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IScalesMachine, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Tên cầu cân',
								fixedLeft: true,
								render: (data: IScalesMachine) => <>{data?.name}</>,
							},
							{
								title: 'Thuộc trạm cân',
								render: (data: IScalesMachine) => <>{data?.scalesStationUu?.name || '---'}</>,
							},
							{
								title: 'Ghi chú',
								render: (data: IScalesMachine) => (
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
										<Tippy content='Xem chi tiết ghi chú'>
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
								title: 'Trạng thái',
								render: (data: IScalesMachine) => <TagStatus status={data.status} />,
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IScalesMachine) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											onClick={() => setDataUpdate(data)}
										/>

										<IconCustom
											lock
											icon={<HiOutlineLockClosed size='22' />}
											tooltip={data.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa cầu cân' : 'Dùng cầu cân'}
											color='#777E90'
											onClick={() => {
												setDataStatus(data);
											}}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listScalesMachine?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword, _status]}
				/>
			</div>

			<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
				<CreateScaleTable onClose={() => setOpenCreate(false)} />
			</Popup>
			<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
				<UpdateScaleTable dataUpdate={dataUpdate} onClose={() => setDataUpdate(null)} />
			</Popup>

			<Dialog
				danger
				open={!!dataStatus}
				onClose={() => setDataStatus(null)}
				title={dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa cầu cân' : 'Mở khóa cầu cân'}
				note={
					dataStatus?.status == CONFIG_STATUS.HOAT_DONG
						? 'Bạn có chắc chắn muốn khóa cầu cân này?'
						: 'Bạn có chắc chắn muốn mở khóa cầu cân này?'
				}
				onSubmit={fucnChangeStatus.mutate}
			/>
		</div>
	);
}

export default MainScaleTable;
