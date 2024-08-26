import Search from '~/components/common/Search';
import Image from 'next/image';
import {IRFID, PropsMainPageRFID} from './interfaces';
import styles from './MainPageRFID.module.scss';
import FilterCustom from '~/components/common/FilterCustom';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {HiOutlineLockClosed} from 'react-icons/hi';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {httpRequest} from '~/services';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import TagStatus from '~/components/common/TagStatus';
import Popup from '~/components/common/Popup';
import CreateRFID from '../CreateRFID';
import UpdateRFID from '../UpdateRFID';
import Tippy from '@tippyjs/react';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';
import rfidServices from '~/services/rfidServices';
function MainPageRFID({}: PropsMainPageRFID) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _status} = router.query;
	const [uuidDescription, setUuidDescription] = useState<string>('');
	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [dataStatus, setDataStatus] = useState<IRFID | null>(null);
	const [dataUpdate, setDataUpdate] = useState<IRFID | null>(null);

	const listRFID = useQuery([QUERY_KEY.table_RFID, _page, _pageSize, _keyword, _status], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: rfidServices.listRFID({
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
				msgSuccess: dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa RFID thành công!' : 'Mở khóa RFID thành công!',
				http: rfidServices.changeStatusRFID({
					uuid: dataStatus?.uuid!,
					status: dataStatus?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.table_RFID, _page, _pageSize, _keyword, _status]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={fucnChangeStatus.isLoading} />
			<div className={styles.filter}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo RFID' />
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
						Thêm RFID
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listRFID?.data?.items || []}
					loading={listRFID?.isLoading}
					noti={<Noti titleButton='Thêm RFID' onClick={() => setOpenCreate(true)} des='Hiện tại chưa có RFID nào, thêm ngay?' />}
				>
					<Table
						data={listRFID?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IRFID, index: number) => <>{index + 1}</>,
							},
							{
								title: 'CODE RFID',
								render: (data: IRFID) => <>{data?.code || '---'}</>,
							},
							{
								title: 'Xe kết nối',
								render: (data: IRFID) => <>{data?.truckUu?.licensePalate || '---'}</>,
							},
							{
								title: 'Ghi chú',
								render: (data: IRFID) => (
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
								title: 'Trạng thái',
								render: (data: IRFID) => <TagStatus status={data.status} />,
							},
							{
								title: 'Tác vụ',
								render: (data: IRFID) => (
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
											tooltip={data.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa RFID' : 'Dùng RFID'}
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
					total={listRFID?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword, _status]}
				/>
			</div>

			<Dialog
				danger
				open={!!dataStatus}
				onClose={() => setDataStatus(null)}
				title={dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa RFID' : 'Mở khóa RFID'}
				note={
					dataStatus?.status == CONFIG_STATUS.HOAT_DONG
						? 'Bạn có chắc chắn muốn khóa RFID này?'
						: 'Bạn có chắc chắn muốn mở khóa RFID này?'
				}
				onSubmit={fucnChangeStatus.mutate}
			/>

			<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
				<CreateRFID onClose={() => setOpenCreate(false)} />
			</Popup>

			<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
				<UpdateRFID dataUpdateRFID={dataUpdate} onClose={() => setDataUpdate(null)} />
			</Popup>
		</div>
	);
}

export default MainPageRFID;
