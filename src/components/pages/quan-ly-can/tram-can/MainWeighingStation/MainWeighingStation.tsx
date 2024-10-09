import React, {useState} from 'react';
import icons from '~/constants/images/icons';
import Image from 'next/image';
import {IScalesStation, PropsMainWeighingStation} from './interfaces';
import styles from './MainWeighingStation.module.scss';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import Dialog from '~/components/common/Dialog';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import FilterCustom from '~/components/common/FilterCustom';
import Loading from '~/components/common/Loading';
import TagStatus from '~/components/common/TagStatus';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import {PATH} from '~/constants/config';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';
import companyServices from '~/services/companyServices';
import scalesStationServices from '~/services/scalesStationServices';
function MainWeighingStation({}: PropsMainWeighingStation) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _status, _companyUuid} = router.query;
	const [uuidDescription, setUuidDescription] = useState<string>('');
	const [dataStatus, setDataStatus] = useState<IScalesStation | null>(null);

	const listCompany = useQuery([QUERY_KEY.dropdown_cong_ty], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: companyServices.listCompany({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listScalesStation = useQuery([QUERY_KEY.table_tram_can, _page, _pageSize, _keyword, _status, _companyUuid], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: scalesStationServices.listScalesStation({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 50,
					keyword: (_keyword as string) || '',
					companyUuid: (_companyUuid as string) || '',
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
				msgSuccess: dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa trạm cân thành công!' : 'Mở khóa trạm cân thành công!',
				http: scalesStationServices.changeStatus({
					uuid: dataStatus?.uuid!,
					status: dataStatus?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.table_tram_can, _page, _pageSize, _keyword, _status]);
			}
		},
	});
	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatus.isLoading} />
			<div className={styles.filter}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên trạm cân' />
					</div>
					<div style={{minWidth: '240px'}}>
						<FilterCustom
							isSearch
							name='KV cảng xuất khẩu'
							query='_companyUuid'
							listFilter={listCompany?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
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

				<div className={styles.btn}>
					<Button p_8_16 rounded_2 href={PATH.ThemTramCan} icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}>
						Thêm trạm cân
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listScalesStation?.data?.items || []}
					loading={listScalesStation?.isLoading}
					noti={
						<Noti
							titleButton='Thêm trạm cân'
							onClick={() => router.push(PATH.ThemTramCan)}
							des='Hiện tại chưa có trạm cân nào, thêm ngay?'
						/>
					}
				>
					<Table
						data={listScalesStation?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IScalesStation, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã trạm cân',
								render: (data: IScalesStation) => <p style={{fontWeight: 600}}>{data?.code}</p>,
							},
							{
								title: 'Tên trạm cân',
								fixedLeft: true,
								render: (data: IScalesStation) => (
									<Link href={`/quan-ly-can/tram-can/${data?.uuid}`} className={styles.link}>
										{data?.name}
									</Link>
								),
							},
							{
								title: 'Số điện thoại',
								render: (data: IScalesStation) => <>{data?.phoneNumber}</>,
							},
							{
								title: 'Cầu cân',
								render: (data: IScalesStation) => <>{data?.scalesMachine?.length || 0}</>,
							},
							{
								title: 'KV cảng xuất khẩu',
								render: (data: IScalesStation) => <>{data?.companyUu?.name}</>,
							},
							{
								title: 'Ghi chú',
								render: (data: IScalesStation) => (
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
								render: (data: IScalesStation) => <TagStatus status={data.status} />,
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IScalesStation) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											href={`/quan-ly-can/tram-can/chinh-sua?_id=${data.uuid}`}
										/>

										<IconCustom
											lock
											icon={
												data.status == CONFIG_STATUS.HOAT_DONG ? (
													<HiOutlineLockClosed size='22' />
												) : (
													<HiOutlineLockOpen size='22' />
												)
											}
											tooltip={data.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa trạm cân' : 'Mở khóa trạm cân'}
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
					pageSize={Number(_pageSize) || 50}
					total={listScalesStation?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _status, _companyUuid]}
				/>
			</div>
			<Dialog
				danger
				open={!!dataStatus}
				onClose={() => setDataStatus(null)}
				title={dataStatus?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa trạm cân' : 'Mở khóa trạm cân'}
				note={
					dataStatus?.status == CONFIG_STATUS.HOAT_DONG
						? 'Bạn có chắc chắn muốn khóa trạm cân này?'
						: 'Bạn có chắc chắn muốn mở khóa trạm cân này?'
				}
				onSubmit={funcChangeStatus.mutate}
			/>
		</div>
	);
}

export default MainWeighingStation;
