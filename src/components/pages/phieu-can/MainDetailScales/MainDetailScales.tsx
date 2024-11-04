import React from 'react';
import {PropsMainDetailScales} from './interfaces';
import styles from './MainDetailScales.module.scss';
import TabNavLink from '~/components/common/TabNavLink';
import {useRouter} from 'next/router';
import TableDetail from './components/TableDetail';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import TableListTruck from './components/TableListTruck';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATE_BILL, STATUS_BILL, TYPE_BATCH, TYPE_SCALES, TYPE_SIFT, TYPE_TRANSPORT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import batchBillServices from '~/services/batchBillServices';
import Button from '~/components/common/Button';
import {LuPencil} from 'react-icons/lu';
import {convertCoin} from '~/common/funcs/convertCoin';
import {IDetailBatchBill} from '../../lenh-can/MainDetailBill/interfaces';
import {convertWeight} from '~/common/funcs/optionConvert';
import TableUpdateBillHistory from './components/TableUpdateBillHistory';
import StateActive from '~/components/common/StateActive';
import Moment from 'react-moment';

function MainDetailScales({}: PropsMainDetailScales) {
	const router = useRouter();
	const {_type, _id} = router.query;

	const {data: detailBatchBill} = useQuery<IDetailBatchBill>([QUERY_KEY.chi_tiet_phieu_can, _id], {
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

	const getUrlUpdateBatchBill = (): string => {
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_NHAP) {
			return `/phieu-can/chinh-sua-phieu-nhap?_id=${detailBatchBill?.uuid}`;
		}
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_XUAT) {
			return `/phieu-can/chinh-sua-phieu-xuat?_id=${detailBatchBill?.uuid}`;
		}
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_DICH_VU) {
			return `/phieu-can/chinh-sua-phieu-dich-vu?_id=${detailBatchBill?.uuid}`;
		}
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO) {
			return `/phieu-can/chinh-sua-phieu-chuyen-kho?_id=${detailBatchBill?.uuid}`;
		}
		if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP) {
			return `/phieu-can/chinh-sua-phieu-xuat-thang?_id=${detailBatchBill?.uuid}`;
		}
		return '/phieu-can/tat-ca';
	};

	const getlicensePalate = () => {
		if (detailBatchBill?.transportType == TYPE_TRANSPORT.DUONG_BO) {
			return `Đường bộ (${detailBatchBill?.weightSessionUu?.truckUu?.licensePalate || '---'})`;
		}
		if (detailBatchBill?.transportType == TYPE_TRANSPORT.DUONG_THUY) {
			if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP) {
				return `Đường thủy (${detailBatchBill?.batchsUu?.shipUu?.licensePalate || '---'} - ${
					detailBatchBill?.batchsUu?.shipOutUu?.licensePalate || '---'
				})`;
			} else {
				return `Đường thủy (${detailBatchBill?.batchsUu?.shipUu?.licensePalate || '---'})`;
			}
		}
		return '---';
	};

	return (
		<div className={styles.container}>
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
					<p>Chi tiết phiếu cân #{detailBatchBill?.code}</p>
				</Link>
				<div className={styles.list_btn}>
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
				</div>
			</div>
			<div className={clsx('mt')}>
				<table className={styles.container_table}>
					<colgroup>
						<col style={{width: '50%'}} />
						<col style={{width: '50%'}} />
					</colgroup>
					<tr>
						<td>
							<span>Từ: </span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{detailBatchBill?.fromUu?.name || detailBatchBill?.customerName || '---'} - (
								{detailBatchBill?.fromUu?.parentUu?.name || '---'})
							</span>
						</td>
						<td>
							<span>Đến: </span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{detailBatchBill?.toUu?.name || '---'} - ({detailBatchBill?.toUu?.parentUu?.name || '---'})
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Loại hàng:</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>{detailBatchBill?.productTypeUu?.name || '---'}</span>
						</td>
						<td>
							<span>Quy cách:</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>{detailBatchBill?.specificationsUu?.name || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Loại cân: </span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_NHAP && 'Cân nhập'}
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_XUAT && 'Cân xuất'}
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_DICH_VU && 'Cân dịch vụ'}
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO && 'Cân chuyển kho'}
								{detailBatchBill?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP && 'Cân xuất thẳng'}
							</span>
						</td>
						<td>
							<span>Phân loại:</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{detailBatchBill?.isSift == TYPE_SIFT.CAN_SANG && 'Cần sàng'}
								{detailBatchBill?.isSift == TYPE_SIFT.KHONG_CAN_SANG && 'Không cần sàng'}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Vận chuyển:</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{/* {detailBatchBill?.transportType == TYPE_TRANSPORT.DUONG_BO
									? `Đường bộ (${detailBatchBill?.weightSessionUu?.truckUu?.licensePalate || '---'})`
									: detailBatchBill?.transportType == TYPE_TRANSPORT.DUONG_THUY
									? `Đường thủy (${detailBatchBill?.batchsUu?.shipUu?.licensePalate || '---'} - ${
											detailBatchBill?.batchsUu?.shipOutUu?.licensePalate || '---'
									  })`
									: '---'} */}
								{getlicensePalate()}
							</span>
						</td>
						<td>
							<span>Tổng khối lượng:</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>{convertWeight(detailBatchBill?.weightTotal!)} (Tấn)</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Thời gian bắt đầu:</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{detailBatchBill?.timeStart ? (
									<Moment date={detailBatchBill?.timeStart} format='HH:mm - DD/MM/YYYY' />
								) : (
									'---'
								)}
							</span>
						</td>
						<td>
							<span>Thời gian kết thúc:</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{detailBatchBill?.timeEnd ? <Moment date={detailBatchBill?.timeEnd} format='HH:mm - DD/MM/YYYY' /> : '---'}
							</span>
						</td>
					</tr>

					<tr>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Cảng bốc dỡ: </span>
								<span style={{marginLeft: '6px', fontWeight: 600}}>{detailBatchBill?.port || '---'}</span>
							</div>
						</td>

						<td>
							<span>Kiểu cân:</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{detailBatchBill?.isBatch == TYPE_BATCH.CAN_LO && 'Cân lô'}
								{detailBatchBill?.isBatch == TYPE_BATCH.CAN_LE && 'Cân lẻ'}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span className={styles.state_action}>
								<span style={{marginRight: '6px'}}>Trạng thái: </span>
								<StateActive
									stateActive={detailBatchBill?.status!}
									listState={[
										{
											state: STATUS_BILL.DANG_CAN,
											text: 'Đang cân',
											textColor: '#9757D7',
											backgroundColor: 'rgba(151, 87, 215, 0.10)',
										},
										{
											state: STATUS_BILL.TAM_DUNG,
											text: 'Tạm dừng',
											textColor: '#F95B5B',
											backgroundColor: 'rgba(249, 91, 91, 0.10)',
										},
										{
											state: STATUS_BILL.DA_CAN_CHUA_KCS,
											text: 'Đã cân chưa KCS',
											textColor: '#2D74FF',
											backgroundColor: 'rgba(45, 116, 255, 0.10)',
										},
										{
											state: STATUS_BILL.DA_KCS,
											text: 'Đã KCS',
											textColor: '#41CD4F',
											backgroundColor: 'rgba(65, 205, 79, 0.1)',
										},
										{
											state: STATUS_BILL.CHOT_KE_TOAN,
											text: 'Chốt kế toán',
											textColor: '#0EA5E9',
											backgroundColor: 'rgba(14, 165, 233, 0.1)',
										},
									]}
								/>
							</span>
						</td>
						<td rowSpan={3} className={styles.description}>
							<span>{detailBatchBill?.state == STATE_BILL.QLK_REJECTED ? 'Lý do' : 'Mô tả'} :</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>{detailBatchBill?.description || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Trạm cân: </span>
								<span style={{marginLeft: '6px', fontWeight: 600}}>{detailBatchBill?.scalesStationUu?.name || '---'}</span>
							</div>
						</td>
					</tr>

					<tr>
						<td>
							{/* <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Xác nhận SL: </span>
								<span style={{marginLeft: '6px', fontWeight: 600}}>
									{detailBatchBill?.state == STATE_BILL.NOT_CHECK && 'Chưa duyệt'}
									{detailBatchBill?.state == STATE_BILL.QLK_REJECTED && 'QLK duyệt lại'}
									{detailBatchBill?.state == STATE_BILL.QLK_CHECKED && 'QLK đã duyệt'}
									{detailBatchBill?.state == STATE_BILL.KTK_REJECTED && 'KTK duyệt lại'}
									{detailBatchBill?.state == STATE_BILL.KTK_CHECKED && 'KTK đã duyệt'}
									{detailBatchBill?.state == STATE_BILL.END && 'Kết thúc'}
								</span>
							</div> */}
							<span className={styles.state_action}>
								<span style={{marginRight: '6px'}}>Xác nhận SL: </span>
								<StateActive
									stateActive={detailBatchBill?.state!}
									listState={[
										{
											state: STATE_BILL.NOT_CHECK,
											text: 'Chưa duyệt',
											textColor: '#fff',
											backgroundColor: '#FF5C5C',
										},
										{
											state: STATE_BILL.QLK_REJECTED,
											text: 'QLK duyệt lại',
											textColor: '#fff',
											backgroundColor: '#FB923C',
										},
										{
											state: STATE_BILL.QLK_CHECKED,
											text: 'QLK đã duyệt',
											textColor: '#fff',
											backgroundColor: '#0EA5E9',
										},
										{
											state: STATE_BILL.KTK_REJECTED,
											text: 'KTK duyệt lại',
											textColor: '#fff',
											backgroundColor: '#FF6838',
										},
										{
											state: STATE_BILL.KTK_CHECKED,
											text: 'KTK đã duyệt',
											textColor: '#fff',
											backgroundColor: '#2A85FF',
										},
										{
											state: STATE_BILL.END,
											text: 'Kết thúc',
											textColor: '#fff',
											backgroundColor: '#9757D7',
										},
									]}
								/>
							</span>
						</td>
					</tr>
				</table>
			</div>
			<div className={clsx('mt')}>
				<TabNavLink
					outline
					query='_type'
					listHref={[
						{
							pathname: router.pathname,
							query: null,
							title: 'Chi tiết đơn hàng',
						},
						{
							pathname: router.pathname,
							query: 'xe-hang',
							title: 'Nhóm theo xe',
						},
						{
							pathname: router.pathname,
							query: 'lich-su',
							title: 'Lịch sử thay đổi phiếu',
						},
					]}
				/>
			</div>

			<div className='mt'>
				{!_type && <TableDetail />}
				{_type == 'xe-hang' && <TableListTruck />}
				{_type == 'lich-su' && <TableUpdateBillHistory />}
			</div>
		</div>
	);
}

export default MainDetailScales;
