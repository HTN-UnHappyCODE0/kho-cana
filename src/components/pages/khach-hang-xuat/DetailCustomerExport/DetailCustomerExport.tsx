import React, {useState} from 'react';

import {IDetailCustomer, PropsDetailCustomerExport} from './interfaces';
import styles from './DetailCustomerExport.module.scss';
import PopupAddPrice from '../PopupAddPrice/PopupAddPrice';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_CUSTOMER,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import clsx from 'clsx';
import TagStatus from '~/components/common/TagStatus';
import {getTextAddress} from '~/common/funcs/optionConvert';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import TagStatusSpecCustomer from '../TagStatusSpecCustomer';
import Pagination from '~/components/common/Pagination';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import priceTagServices from '~/services/priceTagServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import Link from 'next/link';
import Popup from '~/components/common/Popup';

function DetailCustomerExport({}: PropsDetailCustomerExport) {
	const router = useRouter();
	const {_id, _page, _pageSize} = router.query;

	const [openCreate, setOpenCreate] = useState<boolean>(false);

	const {data: detailCustomer} = useQuery<IDetailCustomer>([QUERY_KEY.chi_tiet_khach_hang, _id], {
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

	const listPriceTagCustomer = useQuery([QUERY_KEY.table_hang_hoa_cua_khach_hang, _id, _page, _pageSize], {
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
					<p>Chi tiết khách hàng xuất {detailCustomer?.code}</p>
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
							<span>Mã khách hàng xuất: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.code || '---'}</span>
						</td>
						<td>
							<span>Tên khách hàng xuất: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.name || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Phân loại hàng:</span>
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
					<h1 className={styles.list_title}>Danh sách hàng hóa</h1>
					{detailCustomer?.status != STATUS_CUSTOMER.DA_XOA && (
						<div>
							<Button
								p_8_16
								icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
								rounded_2
								onClick={() => setOpenCreate(true)}
							>
								Thêm loại hàng
							</Button>
						</div>
					)}
				</div>
			</div>
			<div className={clsx('mt')}>
				<div className={styles.table}>
					<DataWrapper
						data={listPriceTagCustomer?.data?.items || []}
						loading={listPriceTagCustomer?.isLoading}
						noti={<Noti disableButton des='Hiện tại chưa có hàng hóa nào!' />}
					>
						<Table
							data={listPriceTagCustomer?.data?.items || []}
							column={[
								{
									title: 'STT',
									render: (data: any, index: number) => <>{index + 1}</>,
								},
								{
									title: 'Loại hàng',
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
									title: 'Vận chuyển',
									render: (data: any) => (
										<>
											{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
											{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
										</>
									),
								},
								// {
								// 	title: 'Giá tiền (VND)',
								// 	render: (data: any) => (
								// 		<p style={{fontWeight: '600', color: '#3772FF'}}>{convertCoin(data?.pricetagUu?.amount)}</p>
								// 	),
								// },
								{
									title: 'Cung cấp',
									render: (data: any) => <TagStatusSpecCustomer status={data.state} />,
								},
								// {
								// 	title: 'Trạng thái',
								// 	render: (data: any) => <TagStatus status={data.status} />,
								// },
							]}
						/>
					</DataWrapper>
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 50}
						total={listPriceTagCustomer?.data?.pagination?.totalCount}
						dependencies={[_id, _pageSize]}
					/>

					<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
						<PopupAddPrice
							customerName={detailCustomer?.name!}
							typePartner={detailCustomer?.partnerUu?.type}
							onClose={() => setOpenCreate(false)}
						/>
					</Popup>
				</div>
			</div>
		</div>
	);
}

export default DetailCustomerExport;
