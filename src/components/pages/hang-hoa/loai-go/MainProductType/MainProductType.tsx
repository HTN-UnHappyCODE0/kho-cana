import React, {useState} from 'react';
import icons from '~/constants/images/icons';
import Image from 'next/image';
import {IProductType, PropsMainProductType} from './interfaces';
import styles from './MainProductType.module.scss';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import Popup from '~/components/common/Popup';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import Dialog from '~/components/common/Dialog';
import FormCreateProductType from '../FormCreateProductType';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_PRODUCT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import FilterCustom from '~/components/common/FilterCustom';
import TagStatus from '~/components/common/TagStatus';
import {HiOutlineLockClosed} from 'react-icons/hi';
import Loading from '~/components/common/Loading';
import FormUpdateProductType from '../FormUpdateProductType';
import TippyHeadless from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';

function MainProductType({}: PropsMainProductType) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _status, _type} = router.query;

	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [uuidDescription, setUuidDescription] = useState<string>('');
	const [dataStatus, setDataStatus] = useState<IProductType | null>(null);
	const [dataUpdate, setDataUpdate] = useState<IProductType | null>(null);

	const listProductType = useQuery([QUERY_KEY.table_loai_go, _page, _pageSize, _keyword, _type, _status], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: wareServices.listProductType({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: !!_status ? Number(_status) : null,
					type: !!_type ? [Number(_type)] : [],
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
				msgSuccess: dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa loại gỗ thành công!' : 'Mở khóa loại gỗ thành công!',
				http: wareServices.changeStatusProductType({
					uuid: dataStatus?.uuid!,
					status: dataStatus?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.table_loai_go, _page, _pageSize, _keyword, _status]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={fucnChangeStatus.isLoading} />
			<div className={styles.filter}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã loại gỗ và tên loại gỗ ' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Loại hàng'
							query='_type'
							listFilter={[
								{
									id: TYPE_PRODUCT.CONG_TY,
									name: 'Công ty',
								},
								{
									id: TYPE_PRODUCT.DICH_VU,
									name: 'Dịch vụ',
								},
								{
									id: TYPE_PRODUCT.DUNG_CHUNG,
									name: 'Dùng chung',
								},
							]}
						/>
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
						Thêm loại gỗ
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listProductType?.data?.items || []}
					loading={listProductType?.isLoading}
					noti={
						<Noti
							titleButton='Thêm loại gỗ'
							onClick={() => setOpenCreate(true)}
							des='Hiện tại chưa có loại gỗ nào, thêm ngay?'
						/>
					}
				>
					<Table
						data={listProductType?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IProductType, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã loại gỗ',
								render: (data: IProductType) => <>{data?.code || '---'}</>,
							},
							{
								title: 'Loại gỗ',
								render: (data: IProductType) => <>{data?.name || '---'}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: IProductType) => (
									<>
										{data?.type == TYPE_PRODUCT.CONG_TY && 'Công ty'}
										{data?.type == TYPE_PRODUCT.DICH_VU && 'Dịch vụ'}
										{data?.type == TYPE_PRODUCT.DUNG_CHUNG && 'Công ty + Dịch vụ'}
									</>
								),
							},

							{
								title: 'Thời gian tạo',
								render: (data: IProductType) => <Moment date={data?.created} format='HH:mm - DD/MM/YYYY'></Moment>,
							},
							{
								title: 'Trạng thái',
								render: (data: IProductType) => <TagStatus status={data.status} />,
							},
							{
								title: 'Mô tả',
								render: (data: IProductType) => (
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
								render: (data: IProductType) => (
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
											tooltip={data.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa loại gỗ' : 'Dùng loại gỗ'}
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
					total={listProductType?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword, _status]}
				/>
			</div>

			<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
				<FormCreateProductType onClose={() => setOpenCreate(false)} />
			</Popup>

			<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
				<FormUpdateProductType dataUpdateProductType={dataUpdate} onClose={() => setDataUpdate(null)} />
			</Popup>

			<Dialog
				danger
				open={!!dataStatus}
				onClose={() => setDataStatus(null)}
				title={dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa loại gỗ' : 'Mở khóa loại gỗ'}
				note={
					dataStatus?.status == CONFIG_STATUS.HOAT_DONG
						? 'Bạn có chắc chắn muốn khóa loại gỗ này?'
						: 'Bạn có chắc chắn muốn mở khóa loại gỗ này?'
				}
				onSubmit={fucnChangeStatus.mutate}
			/>
		</div>
	);
}

export default MainProductType;
