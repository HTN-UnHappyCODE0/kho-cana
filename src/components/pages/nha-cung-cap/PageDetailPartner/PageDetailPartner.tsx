import React, {useState} from 'react';

import {IDetailCustomer, PropsPageDetailPartner} from './interfaces';
import styles from './PageDetailPartner.module.scss';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import TagStatus from '~/components/common/TagStatus';
import {getTextAddress} from '~/common/funcs/optionConvert';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import priceTagServices from '~/services/priceTagServices';
import TagStatusSpecCustomer from '../TagStatusSpecCustomer';
import Pagination from '~/components/common/Pagination';
import Popup from '~/components/common/Popup';
import Noti from '~/components/common/DataWrapper/components/Noti';
import PopupAddPrice from '../PopupAddPrice/PopupAddPrice';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import PopupUpdatePrice from '../PopupUpdatePrice';

function PageDetailPartner({}: PropsPageDetailPartner) {
	const router = useRouter();

	const {_id, _page, _pageSize} = router.query;

	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [uuidUpdate, setUuidUpdate] = useState<string>('');

	const {data: detailCustomer} = useQuery<IDetailCustomer>([QUERY_KEY.chi_tiet_nha_cung_cap, _id], {
		queryFn: () =>
			httpRequest({
				http: customerServices.getDetail({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			return data;
		},
		enabled: !!_id,
	});

	const listPriceTagCustomer = useQuery([QUERY_KEY.table_hang_hoa_cua_nha_cung_cap, _id, _page, _pageSize], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: priceTagServices.listPriceTag({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: CONFIG_STATUS.HOAT_DONG,
					customerUuid: _id as string,
					specUuid: '',
					productTypeUuid: '',
					priceTagUuid: '',
					state: null,
					transportType: null,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Link
					href={'#'}
					onClick={(e) => {
						e.preventDefault();
						window.history.back();
					}}
					className={styles.header_title}
				>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Chi tiết NCC {detailCustomer?.code}</p>
				</Link>
			</div>

			<div className={clsx('mt')}>
				<table className={styles.container_table}>
					<colgroup>
						<col style={{width: '50%'}} />
						<col style={{width: '50%'}} />
					</colgroup>
					<tr>
						<td>
							<span>Mã NCC: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.code || '---'}</span>
						</td>
						<td>
							<span>Tên NCC: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.name || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Phân loại gỗ:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>
								{detailCustomer?.isSift == TYPE_SIFT.CAN_SANG
									? 'Cần sàng'
									: detailCustomer?.isSift == TYPE_SIFT.KHONG_CAN_SANG
									? 'Không cần sàng'
									: '---'}
							</span>
						</td>
						<td>
							<span>Người liên hệ:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.director || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Email: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.email || '---'}</span>
						</td>
						<td>
							<span>Số điện thoại:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.phoneNumber || '---'}</span>
						</td>
					</tr>

					<tr>
						<td>
							<span>Loại vận chuyển:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>
								{detailCustomer?.transportType == TYPE_TRANSPORT.DUONG_BO
									? 'Đường bộ'
									: detailCustomer?.transportType == TYPE_TRANSPORT.DUONG_THUY
									? 'Đường thủy'
									: '---'}
							</span>
						</td>
						<td rowSpan={3} className={styles.description}>
							<span>Mô tả:</span>
							<span style={{marginLeft: '6px'}}>{detailCustomer?.description || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Trạng thái: </span>
								<span style={{marginLeft: '6px'}}>
									<TagStatus status={detailCustomer?.status!} />
								</span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<span>Địa chỉ:</span>
							<span style={{marginLeft: '6px'}}>
								{getTextAddress(detailCustomer?.detailAddress, detailCustomer?.address)}
							</span>
						</td>
					</tr>
				</table>
			</div>

			<div className={clsx('mt')}>
				<div className={styles.main_table}>
					<h1 className={styles.list_title}>Danh sách loại gỗ</h1>
					<div>
						<Button
							p_8_16
							icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
							rounded_2
							onClick={() => setOpenCreate(true)}
						>
							Thêm loại gỗ
						</Button>
					</div>
				</div>
			</div>
			<div className={clsx('mt')}>
				<div className={styles.table}>
					<DataWrapper
						data={listPriceTagCustomer?.data?.items || []}
						loading={listPriceTagCustomer?.isLoading}
						noti={<Noti disableButton des='Hiện tại chưa có loại gỗ nào!' />}
					>
						<Table
							data={listPriceTagCustomer?.data?.items || []}
							column={[
								{
									title: 'STT',
									render: (data: any, index: number) => <>{index + 1}</>,
								},
								{
									title: 'Loại gỗ',
									render: (data: any) => <>{data?.productTypeUu?.name}</>,
								},
								{
									title: 'Quốc gia',
									render: (data: any) => <>{data?.qualityUu?.name}</>,
								},
								{
									title: 'Quy cách',
									render: (data: any) => <>{data?.specUu?.name}</>,
								},
								{
									title: 'Bãi',
									render: (data: any) => <>{data?.storageUu?.name || '---'}</>,
								},
								{
									title: 'Vận chuyển',
									render: (data: any) => (
										<>
											{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
											{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
										</>
									),
								},
								{
									title: 'Cung cấp',
									render: (data: any) => <TagStatusSpecCustomer status={data.state} />,
								},
								{
									title: 'Tác vụ',
									fixedRight: true,
									render: (data: any) => (
										<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
											<IconCustom
												edit
												icon={<LuPencil fontSize={20} fontWeight={600} />}
												tooltip='Cập nhật bãi'
												color='#777E90'
												onClick={() => setUuidUpdate(data?.uuid)}
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
						total={listPriceTagCustomer?.data?.pagination?.totalCount}
						dependencies={[_id, _pageSize]}
					/>
				</div>
			</div>

			<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
				<PopupAddPrice
					typeCustomer={detailCustomer?.typeCus!}
					customerName={detailCustomer?.name!}
					onClose={() => setOpenCreate(false)}
				/>
			</Popup>
			<Popup open={!!uuidUpdate} onClose={() => setUuidUpdate('')}>
				<PopupUpdatePrice customerSpecUuid={uuidUpdate} onClose={() => setUuidUpdate('')} />
			</Popup>
		</div>
	);
}

export default PageDetailPartner;
