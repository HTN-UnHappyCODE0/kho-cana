import React, {useState} from 'react';
import icons from '~/constants/images/icons';
import Image from 'next/image';
import {ISpecifications, PropsMainSpecifications} from './interfaces';
import styles from './MainSpecifications.module.scss';
import {useRouter} from 'next/router';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import TippyHeadless from '@tippyjs/react/headless';
import Dialog from '~/components/common/Dialog';
import {PATH} from '~/constants/config';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_RULER} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import FilterCustom from '~/components/common/FilterCustom';
import Loading from '~/components/common/Loading';
import {HiOutlineLockClosed} from 'react-icons/hi';
import TagStatus from '~/components/common/TagStatus';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';

function MainSpecifications({}: PropsMainSpecifications) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _status} = router.query;
	const [uuidDescription, setUuidDescription] = useState<string>('');
	const [uuidSpecifications, setUuidSpecifications] = useState<string>('');
	const [dataStatus, setDataStatus] = useState<ISpecifications | null>(null);

	const listSpecifications = useQuery([QUERY_KEY.table_quy_cach, _page, _pageSize, _keyword, _status], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: wareServices.listSpecification({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: !!_status ? Number(_status) : null,
					qualityUuid: '',
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
				msgSuccess: dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa quy cách thành công!' : 'Mở khóa quy cách thành công!',
				http: wareServices.changeStatusSpecifications({
					uuid: dataStatus?.uuid!,
					status: dataStatus?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.table_quy_cach, _page, _pageSize, _keyword, _status]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={fucnChangeStatus.isLoading} />
			<div className={styles.filter}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên quy cách ' />
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
						href={PATH.ThemQuyCach}
					>
						Thêm quy cách
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listSpecifications?.data?.items || []}
					loading={listSpecifications?.isLoading}
					noti={<Noti titleButton='Thêm quy cách' onClick={() => {}} des='Hiện tại chưa có quy cách nào, thêm ngay?' />}
				>
					<Table
						data={listSpecifications?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: ISpecifications, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Quy cách',
								render: (data: ISpecifications) => <>{data?.name || '---'}</>,
							},
							{
								title: 'Quốc gia',
								render: (data: ISpecifications) => <>{data?.qualityUu?.name || '---'}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: ISpecifications) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Tiêu chí',
								render: (data: ISpecifications) => (
									<div className={styles.ruler}>
										<TippyHeadless
											maxWidth={'100%'}
											interactive
											onClickOutside={() => setUuidSpecifications('')}
											visible={uuidSpecifications == data?.uuid}
											placement='bottom'
											render={(attrs) => (
												<div className={styles.main_ruler}>
													<div className={styles.content}>
														{data?.criteriaUu?.map((v, i) => (
															<div key={i} className={styles.item}>
																<div className={styles.dot}></div>
																<p>{v?.title}</p>
																<p>{v?.ruler == TYPE_RULER.NHO_HON ? '<' : '>'}</p>
																<p>{v?.value}</p>
															</div>
														))}
													</div>
												</div>
											)}
										>
											<Tippy content='Xem tiêu chí'>
												<p
													onClick={() => setUuidSpecifications(uuidSpecifications ? '' : data.uuid)}
													className={clsx(styles.value, {[styles.active]: uuidSpecifications == data.uuid})}
												>
													{data?.countRuler || 0}
												</p>
											</Tippy>
										</TippyHeadless>
									</div>
								),
							},
							{
								title: 'Mô tả',
								render: (data: ISpecifications) => (
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
								title: 'Thời gian tạo',
								render: (data: ISpecifications) => <Moment date={data?.created} format='HH:mm - DD/MM/YYYY'></Moment>,
							},
							{
								title: 'Trạng thái',
								render: (data: ISpecifications) => <TagStatus status={data.status} />,
							},
							{
								title: 'Tác vụ',
								render: (data: ISpecifications) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											href={`/hang-hoa/quy-cach/chinh-sua?_id=${data.uuid}`}
										/>
										<IconCustom
											lock
											icon={<HiOutlineLockClosed size='22' />}
											tooltip={data.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa quy cách' : 'Dùng quy cách'}
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
					pageSize={Number(_pageSize) || 20}
					total={listSpecifications?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _status]}
				/>
			</div>

			<Dialog
				danger
				open={!!dataStatus}
				onClose={() => setDataStatus(null)}
				title={dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa quy cách' : 'Mở khóa quy cách'}
				note={
					dataStatus?.status == CONFIG_STATUS.HOAT_DONG
						? 'Bạn có chắc chắn muốn khóa quy cách này?'
						: 'Bạn có chắc chắn muốn mở khóa quy cách này?'
				}
				onSubmit={fucnChangeStatus.mutate}
			/>
		</div>
	);
}

export default MainSpecifications;
