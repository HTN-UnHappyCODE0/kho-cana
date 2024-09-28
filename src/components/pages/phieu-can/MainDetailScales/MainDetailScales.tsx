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
import {QUERY_KEY, STATE_BILL, STATUS_BILL, TYPE_SCALES, TYPE_SIFT, TYPE_TRANSPORT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import batchBillServices from '~/services/batchBillServices';
import Button from '~/components/common/Button';
import {LuPencil} from 'react-icons/lu';
import {convertCoin} from '~/common/funcs/convertCoin';
import {IDetailBatchBill} from '../../lenh-can/MainDetailBill/interfaces';
import {convertWeight} from '~/common/funcs/optionConvert';

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
							<span>Loại gỗ:</span>
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
								{detailBatchBill?.transportType == TYPE_TRANSPORT.DUONG_BO
									? 'Đường bộ'
									: detailBatchBill?.transportType == TYPE_TRANSPORT.DUONG_THUY
									? 'Đường thủy'
									: '---'}
							</span>
						</td>
						<td>
							<span>Tổng khối lượng:</span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{convertWeight(detailBatchBill?.weightTotal!) || 0} (tấn)
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Trạng thái: </span>
							<span style={{marginLeft: '6px', fontWeight: 600}}>
								{detailBatchBill?.status == STATUS_BILL.DANG_CAN && (
									<span style={{color: '#9757D7', fontWeight: 600}}>Đang cân</span>
								)}
								{detailBatchBill?.status == STATUS_BILL.TAM_DUNG && (
									<span style={{color: '#353945', fontWeight: 600}}>Tạm dừng</span>
								)}
								{detailBatchBill?.status == STATUS_BILL.DA_CAN_CHUA_KCS && (
									<span style={{color: '#D94212', fontWeight: 600}}>Đã cân chưa KCS</span>
								)}
								{detailBatchBill?.status == STATUS_BILL.DA_KCS && (
									<span style={{color: '#3772FF', fontWeight: 600}}>Đã KCS</span>
								)}
								{detailBatchBill?.status == STATUS_BILL.CHOT_KE_TOAN && (
									<span style={{color: '#2CAE39', fontWeight: 600}}>Chốt kế toán</span>
								)}
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
								<span>Xác nhận SL: </span>
								<span style={{marginLeft: '6px', fontWeight: 600}}>
									{detailBatchBill?.state == STATE_BILL.NOT_CHECK && 'Chưa duyệt'}
									{detailBatchBill?.state == STATE_BILL.QLK_REJECTED && 'QLK duyệt lại'}
									{detailBatchBill?.state == STATE_BILL.QLK_CHECKED && 'QLK đã duyệt'}
									{detailBatchBill?.state == STATE_BILL.KTK_REJECTED && 'KTK duyệt lại'}
									{detailBatchBill?.state == STATE_BILL.KTK_CHECKED && 'KTK đã duyệt'}
									{detailBatchBill?.state == STATE_BILL.END && 'Kết thúc'}
								</span>
							</div>
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
					]}
				/>
			</div>

			<div className='mt'>
				{!_type && <TableDetail />}
				{_type == 'xe-hang' && <TableListTruck />}
			</div>
		</div>
	);
}

export default MainDetailScales;
