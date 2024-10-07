import React, {Fragment, useState} from 'react';

import {PropsMainDetailWeighingStation} from './interfaces';
import styles from './MainDetailWeighingStation.module.scss';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import {LuPencil} from 'react-icons/lu';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import clsx from 'clsx';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import {getTextAddress} from '~/common/funcs/optionConvert';
import TagStatus from '~/components/common/TagStatus';
import Pagination from '~/components/common/Pagination';
import IconCustom from '~/components/common/IconCustom';
import {Trash} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import AddScalesMachine from '../AddScalesMachine';
import {IScalesMachine} from '../../cau-can/MainScaleTable/interfaces';
import scalesStationServices from '~/services/scalesStationServices';
import scalesMachineServices from '~/services/scalesMachineServices';

function MainDetailWeighingStation({}: PropsMainDetailWeighingStation) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _id} = router.query;

	const [dataDelete, setDataDelete] = useState<IScalesMachine | null>(null);
	const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false);
	const [openAddScalesMachine, setOpenAddScalesMachine] = useState<boolean>(false);

	const {data: scalesStation} = useQuery([QUERY_KEY.chi_tiet_tram_can, _id], {
		queryFn: () =>
			httpRequest({
				http: scalesStationServices.getDetail({
					uuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	const listScalesMachine = useQuery([QUERY_KEY.table_ban_can, _page, _pageSize, _id], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: scalesMachineServices.listScalesMachine({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.IS_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: null,
					scalesStationUuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcDeleteScalesStation = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa cầu cân thành công!',
				http: scalesMachineServices.changeScalesStation({
					uuid: dataDelete?.uuid!,
					scalesStationUuid: null,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataDelete(null);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_tram_can, _id]);
				queryClient.invalidateQueries([QUERY_KEY.table_ban_can, _page, _pageSize, _id]);
			}
		},
	});

	const funcChangeStatus = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: scalesStation?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa trạm cân thành công!' : 'Mở khóa trạm cân thành công!',
				http: scalesStationServices.changeStatus({
					uuid: _id as string,
					status: scalesStation?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenChangeStatus(false);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_tram_can, _id]);
			}
		},
	});

	return (
		<Fragment>
			<Loading loading={funcDeleteScalesStation.isLoading || funcChangeStatus.isLoading} />
			<div className={styles.header}>
				<Link href={PATH.TramCan} className={styles.header_title}>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Chi tiết trạm cân</p>
				</Link>

				<div className={styles.list_btn}>
					<Button
						rounded_2
						w_fit
						light_outline
						p_8_16
						bold
						href={`/quan-ly-can/tram-can/chinh-sua?_id=${scalesStation?.uuid}`}
						icon={<LuPencil color='#23262F' fontSize={16} fontWeight={600} />}
					>
						Chỉnh sửa
					</Button>
					<Button
						rounded_2
						w_fit
						light_outline
						p_8_16
						bold
						icon={
							scalesStation?.status == CONFIG_STATUS.HOAT_DONG ? (
								<HiOutlineLockClosed color='#23262F' fontSize={16} fontWeight={600} />
							) : (
								<HiOutlineLockOpen color='#23262F' fontSize={16} fontWeight={600} />
							)
						}
						onClick={() => setOpenChangeStatus(true)}
					>
						{scalesStation?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa' : 'Mở khóa'}
					</Button>
				</div>
			</div>

			<div className={clsx('mt')}>
				<table className={styles.container}>
					<colgroup>
						<col style={{width: '50%'}} />
						<col style={{width: '50%'}} />
					</colgroup>
					<tr>
						<td>
							<span>Tên trạm cân: </span>
							<span style={{fontWeight: 600, marginLeft: '6px'}}>{scalesStation?.name}</span>
						</td>
						<td>
							<span>Mã cầu cân:</span>
							<span style={{fontWeight: 600, marginLeft: '6px'}}>{scalesStation?.code}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Thuộc KV cảng xuất khẩu:</span>
							<span style={{fontWeight: 600, marginLeft: '6px'}}>{scalesStation?.companyUu?.name}</span>
						</td>

						<td>
							<span>Địa chỉ chi tiết:</span>
							<span style={{fontWeight: 600, marginLeft: '6px'}}>
								{getTextAddress(scalesStation?.detailAddress, scalesStation?.address)}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Số điện thoại: </span>
							<span style={{fontWeight: 600, marginLeft: '6px'}}>{scalesStation?.phoneNumber}</span>
						</td>
						<td rowSpan={3} className={styles.description}>
							<span>Ghi chú: </span>
							<span style={{fontWeight: 600, marginLeft: '6px'}}>{scalesStation?.description}</span>
						</td>
					</tr>
					<tr>
						<td style={{display: 'flex', alignItems: 'center', border: 'none'}}>
							<span>Trạng thái: </span>
							<span style={{fontWeight: 600, marginLeft: '6px'}}>
								<TagStatus status={scalesStation?.status} />
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Số lượng cầu cân:</span>
							<span style={{fontWeight: 600, marginLeft: '6px', color: '#3772FF'}}>
								{scalesStation?.scalesMachine?.length}
							</span>
						</td>
					</tr>
				</table>
			</div>
			<div className={clsx('mt')}>
				<div className={styles.main_table}>
					<h1 className={styles.list_title}>Danh sách cầu cân </h1>
					<div>
						<Button
							p_8_16
							icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
							rounded_2
							onClick={() => setOpenAddScalesMachine(true)}
						>
							Thêm cầu cân
						</Button>
					</div>
				</div>
			</div>

			<div className={clsx('mt')}>
				<div className={styles.table}>
					<DataWrapper
						data={listScalesMachine?.data?.items || []}
						loading={listScalesMachine?.isLoading}
						noti={<Noti disableButton titleButton='Thêm cầu cân' des='Hiện tại chưa có cầu cân nào, thêm ngay?' />}
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
									render: (data: IScalesMachine) => <>{data?.name}</>,
								},
								{
									title: 'Ghi chú',
									render: (data: IScalesMachine) => <>{data?.description || '---'}</>,
								},
								{
									title: 'Trạng thái',
									render: (data: IScalesMachine) => <TagStatus status={data.status} />,
								},
								{
									title: 'Tác vụ',
									render: (data: IScalesMachine) => (
										<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
											<IconCustom
												delete
												icon={<Trash fontSize={20} fontWeight={600} />}
												tooltip='Xóa cầu cân'
												color='#777E90'
												onClick={() => setDataDelete(data)}
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
						pageSize={Number(_pageSize) || 50}
						dependencies={[_pageSize, _id]}
					/>
				</div>
			</div>

			<Dialog
				danger
				open={!!dataDelete}
				onClose={() => setDataDelete(null)}
				title={'Xóa cầu cân'}
				note={'Bạn có chắc chắn muốn xóa cầu cân khỏi trạm cân này không??'}
				onSubmit={funcDeleteScalesStation.mutate}
			/>

			<Dialog
				danger
				open={openChangeStatus}
				onClose={() => setOpenChangeStatus(false)}
				title={scalesStation?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa trạm cân' : 'Mở khóa trạm cân'}
				note={
					scalesStation?.status == CONFIG_STATUS.HOAT_DONG
						? 'Bạn có chắc chắn muốn khóa trạm cân này?'
						: 'Bạn có chắc chắn muốn mở khóa trạm cân này?'
				}
				onSubmit={funcChangeStatus.mutate}
			/>

			<Popup open={openAddScalesMachine} onClose={() => setOpenAddScalesMachine(false)}>
				<AddScalesMachine
					nameScalesStation={scalesStation?.name}
					uuidScalesStation={scalesStation?.uuid}
					listScalesMachineUuid={scalesStation?.scalesMachine?.map((v: any) => v?.uuid)}
					onClose={() => setOpenAddScalesMachine(false)}
				/>
			</Popup>
		</Fragment>
	);
}

export default MainDetailWeighingStation;
