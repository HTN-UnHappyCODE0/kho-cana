import React, {Fragment, useState} from 'react';
import {IDetailBatchBill, PropsMainDetailBill} from './interfaces';
import styles from './MainDetailBill.module.scss';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import Table from '~/components/common/Table';
import Button from '~/components/common/Button';
import {convertCoin} from '~/common/funcs/convertCoin';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import TippyHeadless from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	OWNEW_TYPE_TRUCK,
	QUERY_KEY,
	STATUS_BILL,
	TYPE_BATCH,
	TYPE_SCALES,
	TYPE_SIFT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Moment from 'react-moment';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Pagination from '~/components/common/Pagination';
import {HiOutlineLockClosed} from 'react-icons/hi';
import {LuPencil} from 'react-icons/lu';
import Popup from '~/components/common/Popup';
import PopupDeleteBill from '../PopupDeleteBill';
import batchBillServices from '~/services/batchBillServices';
import truckServices from '~/services/truckServices';

const MainDetailBill = ({}: PropsMainDetailBill) => {
	const router = useRouter();

	const {_id, _page, _pageSize} = router.query;

	const [uuidTruck, setUuidTruck] = useState<string>('');
	const [openCancel, setOpenCancel] = useState<boolean>(false);

	const {data: detailBatchBill} = useQuery<IDetailBatchBill>([QUERY_KEY.chi_tiet_lenh_can, _id], {
		queryFn: () =>
			httpRequest({
				http: batchBillServices.detailBatchbill({
					uuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	const listTruck = useQuery([QUERY_KEY.table_xe_hang, _page, _pageSize, _id], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: truckServices.listTruck({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: CONFIG_STATUS.HOAT_DONG,
					billUuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	const getUrlUpdateBatchBill = (): string => {
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_NHAP) {
			return `/lenh-can/chinh-sua-lenh-nhap?_id=${detailBatchBill?.uuid}`;
		}
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_XUAT) {
			return `/lenh-can/chinh-sua-lenh-xuat?_id=${detailBatchBill?.uuid}`;
		}
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_DICH_VU) {
			return `/lenh-can/chinh-sua-lenh-dich-vu?_id=${detailBatchBill?.uuid}`;
		}
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO) {
			return `/lenh-can/chinh-sua-lenh-chuyen-kho?_id=${detailBatchBill?.uuid}`;
		}
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP) {
			return `/lenh-can/chinh-sua-lenh-xuat-thang?_id=${detailBatchBill?.uuid}`;
		}
		return '/lenh-can/tat-ca';
	};

	return (
		<Fragment>
			<div className={styles.header}>
				<Link
					href='#'
					onClick={(e) => {
						e.preventDefault();
						window.history.back();
					}}
					className={styles.header_title}
				>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Chi tiết lệnh cân</p>
				</Link>

				<div className={styles.list_btn}>
					{detailBatchBill?.status == STATUS_BILL.CHUA_CAN && (
						<Button
							rounded_2
							w_fit
							light_outline
							p_8_16
							bold
							icon={<HiOutlineLockClosed color='#23262F' fontSize={16} fontWeight={600} />}
							onClick={() => setOpenCancel(true)}
						>
							Hủy phiếu
						</Button>
					)}

					{detailBatchBill?.status! < STATUS_BILL.DA_CAN_CHUA_KCS && detailBatchBill?.status != STATUS_BILL.DA_HUY ? (
						<Button
							rounded_2
							w_fit
							light_outline
							p_8_16
							bold
							icon={<LuPencil color='#23262F' fontSize={16} fontWeight={600} />}
							href={getUrlUpdateBatchBill()}
						>
							Chỉnh sửa
						</Button>
					) : null}
				</div>
			</div>
			<div className={clsx('mt')}>
				<div className={styles.header_table}>
					<div className={styles.content_table}>
						<div className={styles.item_table}>
							<p>Loại cân:</p>
							<span>
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_NHAP && 'Cân nhập'}
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_XUAT && 'Cân xuất'}
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_DICH_VU && 'Cân dịch vụ'}
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO && 'Cân chuyển kho'}
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP && 'Cân xuất thẳng'}
							</span>
						</div>
						<div className={styles.item_table}>
							<p>Mã lô hàng:</p>
							<span>{detailBatchBill?.code}</span>
						</div>
						<div className={styles.item_table}>
							<p>Kiểu cân:</p>
							<span>
								{detailBatchBill?.isBatch == TYPE_BATCH.CAN_LE && 'Cân lẻ'}
								{detailBatchBill?.isBatch == TYPE_BATCH.CAN_LO && 'Cân lô'}
							</span>
						</div>

						{/* PHIẾU NHẬP  */}
						{detailBatchBill?.scalesType == TYPE_SCALES.CAN_NHAP ? (
							<div className={styles.item_table}>
								<p>Nhà cung cấp: </p>
								<span>{detailBatchBill?.fromUu?.name}</span>
							</div>
						) : null}

						{/* PHIẾU XUẤT  */}
						{detailBatchBill?.scalesType == TYPE_SCALES.CAN_XUAT ? (
							<div className={styles.item_table}>
								<p>Khách hàng:</p>
								<span>{detailBatchBill?.toUu?.name}</span>
							</div>
						) : null}

						{/* PHIẾU DỊCH VỤ  */}
						{detailBatchBill?.scalesType == TYPE_SCALES.CAN_DICH_VU ? (
							<div className={styles.item_table}>
								<p>Khách hàng:</p>
								<span>{detailBatchBill?.fromUu?.name || detailBatchBill?.customerName || '---'}</span>
							</div>
						) : null}

						<div className={styles.item_table}>
							<p>Loại gỗ:</p>
							<span>{detailBatchBill?.productTypeUu?.name || '---'}</span>
						</div>

						{detailBatchBill?.scalesType != TYPE_SCALES.CAN_DICH_VU ? (
							<div className={styles.item_table}>
								<p>Chất lượng hàng:</p>
								<span>
									{detailBatchBill?.specificationsUu?.name}{' '}
									{detailBatchBill?.isSift != null ? (
										<span style={{color: '#777E90'}}>
											- {detailBatchBill?.isSift == TYPE_SIFT.CAN_SANG && 'Cần sàng'}
											{detailBatchBill?.isSift == TYPE_SIFT.KHONG_CAN_SANG && 'Không cần sàng'}
										</span>
									) : null}
								</span>
							</div>
						) : null}

						{/* PHIẾU NHẬP  */}
						{detailBatchBill?.scalesType == TYPE_SCALES.CAN_NHAP ? (
							<div className={styles.item_table}>
								<p>Kho hàng:</p>
								<span>
									{detailBatchBill?.toUu?.name}{' '}
									<span style={{color: '#777E90'}}>({detailBatchBill.toUu?.parentUu?.name || '---'})</span>
								</span>
							</div>
						) : null}

						{/* PHIẾU XUẤT  */}
						{detailBatchBill?.scalesType == TYPE_SCALES.CAN_XUAT ? (
							<div className={styles.item_table}>
								<p>Kho hàng:</p>
								<span>
									{detailBatchBill?.fromUu?.name}{' '}
									<span style={{color: '#777E90'}}>({detailBatchBill.fromUu?.parentUu?.name || '---'})</span>
								</span>
							</div>
						) : null}

						{/* PHIẾU CHUYỂN KHO */}
						{detailBatchBill?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO ? (
							<>
								<div className={styles.item_table}>
									<p>Kho hàng chính:</p>
									<span>
										{detailBatchBill.fromUu?.name}{' '}
										<span style={{color: '#777E90'}}>({detailBatchBill.fromUu?.parentUu?.name || '---'})</span>
									</span>
								</div>
								<div className={styles.item_table}>
									<p>Kho hàng đích:</p>
									<span>
										{detailBatchBill.toUu?.name}{' '}
										<span style={{color: '#777E90'}}>({detailBatchBill.toUu?.parentUu?.name || '---'})</span>
									</span>
								</div>
							</>
						) : null}

						{/* CÂN XUẤT THẲNG */}
						{detailBatchBill?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP ? (
							<>
								<div className={styles.item_table}>
									<p>Nhà cung cấp:</p>
									<span>
										{detailBatchBill.fromUu?.name}{' '}
										<span style={{color: '#777E90'}}>({detailBatchBill.fromUu?.parentUu?.name || '---'})</span>
									</span>
								</div>
								<div className={styles.item_table}>
									<p>Khách hàng xuất:</p>
									<span>
										{detailBatchBill.toUu?.name}{' '}
										<span style={{color: '#777E90'}}>({detailBatchBill.toUu?.parentUu?.name || '---'})</span>
									</span>
								</div>
							</>
						) : null}

						<div className={styles.item_table}>
							<p>Khối lượng dự kiến:</p>
							<span>{convertCoin(detailBatchBill?.batchsUu?.weightIntent!)} (tấn)</span>
						</div>
						<div className={styles.item_table}>
							<p>Ngày dự kiến :</p>
							<span>
								<Moment date={detailBatchBill?.batchsUu?.timeIntend} format='DD/MM/YYYY' />
							</span>
						</div>
						<div className={styles.item_table}>
							<p>Xe chở hàng:</p>
							<span style={{color: '#2D74FF'}}>{detailBatchBill?.lstTruck?.length} xe</span>
						</div>
					</div>
					<div className={styles.content_table}>
						<div className={styles.item_table}>
							<p>Trạng thái phiếu:</p>
							<span>
								{detailBatchBill?.status == STATUS_BILL.DA_HUY && 'Đã hủy'}
								{detailBatchBill?.status == STATUS_BILL.CHUA_CAN && 'Chưa cân'}
								{detailBatchBill?.status == STATUS_BILL.DANG_CAN && 'Đang cân'}
								{detailBatchBill?.status == STATUS_BILL.TAM_DUNG && 'Tạm dừng'}
								{detailBatchBill?.status == STATUS_BILL.DA_CAN_CHUA_KCS && 'Đã cân chưa KCS'}
								{detailBatchBill?.status == STATUS_BILL.DA_KCS && 'Đã KCS'}
								{detailBatchBill?.status == STATUS_BILL.CHOT_KE_TOAN && 'Chốt kế toán'}
							</span>
						</div>
						<div className={styles.item_table}>
							<p>Người tạo lệnh cân:</p>
							<span>{detailBatchBill?.accountUu?.username || '---'}</span>
						</div>
						<div className={styles.item_table}>
							<p>Thời gian tạo lệnh cân:</p>
							<span>
								<Moment date={detailBatchBill?.created} format='HH:mm, DD/MM/YYYY' />
							</span>
						</div>

						{/* PHIẾU HỦY */}
						{detailBatchBill?.status == STATUS_BILL.DA_HUY && (
							<>
								<div className={styles.item_table}>
									<p>Người hủy:</p>
									<span>{detailBatchBill?.accountUpdateUu?.username || '---'}</span>
								</div>
								<div className={styles.item_table}>
									<p>Thời gian hủy:</p>
									<span>
										<Moment date={detailBatchBill?.updatedTime} format='HH:mm, DD/MM/YYYY' />
									</span>
								</div>
								<div className={styles.item_table}>
									<p>Lý do hủy:</p>
									<span>{detailBatchBill?.description?.split('|')?.[1]}</span>
								</div>
							</>
						)}

						{detailBatchBill?.status != STATUS_BILL.DA_HUY && (
							<>
								<div className={styles.item_table}>
									<p>Người cập nhật:</p>
									<span>{detailBatchBill?.accountUpdateUu?.username || '---'}</span>
								</div>
								<div className={styles.item_table}>
									<p>Thời gian cập nhật:</p>
									<span>
										{!!detailBatchBill?.accountUpdateUu && detailBatchBill?.updatedTime ? (
											<Moment date={detailBatchBill?.updatedTime} format='HH:mm, DD/MM/YYYY' />
										) : (
											'---'
										)}
									</span>
								</div>
							</>
						)}

						<div className={styles.item_table}>
							<p>Mô tả:</p>
							<span>{detailBatchBill?.description?.split('|')?.[0] || '---'}</span>
						</div>
					</div>
				</div>
			</div>
			<div className={clsx('mt')}>
				<DataWrapper
					data={listTruck?.data?.items || []}
					loading={listTruck?.isLoading}
					noti={<Noti title='Xe hàng trống' des='Hiện tại chưa có xe hàng nào!' disableButton />}
				>
					<Table
						data={listTruck?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1} </>,
							},
							{
								title: 'Mã xe',
								fixedLeft: true,
								render: (data: any) => <>{data?.code || '---'}</>,
							},
							{
								title: 'Loại xe',
								render: (data: any) => <>{data?.trucktype || '---'}</>,
							},
							{
								title: 'Biển số',
								render: (data: any) => <>{data?.licensePalate || '---'}</>,
							},
							{
								title: 'RFID',
								render: (data: any) => (
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
														{data?.rfid?.map((v: any, i: number) => (
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
								title: 'Phân loại xe',
								render: (data: any) => (
									<>
										{data?.ownerType == OWNEW_TYPE_TRUCK.XE_CONG_TY && <span>Xe KV cảng xuất khẩu</span>}
										{data?.ownerType == OWNEW_TYPE_TRUCK.XE_KHACH_HANG && <span>Xe khách hàng</span>}
									</>
								),
							},
							{
								title: 'Khối lượng nhỏ nhất (tấn)',
								render: (data: any) => <>{convertCoin(data?.minWeight) || '---'}</>,
							},
							{
								title: 'Khối lượng lớn nhất (tấn)',
								render: (data: any) => <>{convertCoin(data?.maxWeight) || '---'}</>,
							},
							{
								title: 'Người quản lý',
								render: (data: any) => <>{data?.managerUu?.fullName || '---'} </>,
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listTruck?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _id]}
				/>
			</div>

			<Popup open={openCancel} onClose={() => setOpenCancel(false)}>
				<PopupDeleteBill uuid={detailBatchBill?.uuid!} onClose={() => setOpenCancel(false)} />
			</Popup>
		</Fragment>
	);
};

export default MainDetailBill;
