import React, {use, useState} from 'react';
import {PropsMainDetailScales} from './interfaces';
import styles from './MainDetailScales.module.scss';
import TabNavLink from '~/components/common/TabNavLink';
import {useRouter} from 'next/router';
import TableDetail from './components/TableDetail';
import Link from 'next/link';
import {IoArrowBackOutline, IoClose} from 'react-icons/io5';
import clsx from 'clsx';
import TableListTruck from './components/TableListTruck';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATE_BILL,
	STATUS_BILL,
	STATUS_WEIGHT_SESSION,
	TYPE_BATCH,
	TYPE_SCALES,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import batchBillServices from '~/services/batchBillServices';
import Button from '~/components/common/Button';
import {LuPencil} from 'react-icons/lu';
import {IDetailBatchBill} from '../../lenh-can/MainDetailBill/interfaces';
import {convertWeight} from '~/common/funcs/optionConvert';
import TableUpdateBillHistory from './components/TableUpdateBillHistory';
import StateActive from '~/components/common/StateActive';
import Moment from 'react-moment';
import weightSessionServices from '~/services/weightSessionServices';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import SliderImage from '~/components/common/SliderImage';
import FormUpdateShipBill from '../../lenh-can/FormUpdateShipBill';
import Dialog from '~/components/common/Dialog';
import FormAccessSpecExcel from './components/FormAccessSpecExcel';

function MainDetailScales({}: PropsMainDetailScales) {
	const router = useRouter();
	const {_type, _id} = router.query;

	const [open, setOpen] = useState<boolean>(false);
	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [openUpdateShip, setOpenUpdateShip] = useState<boolean>(false);

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

	const getlicensePlate = () => {
		if (detailBatchBill?.transportType == TYPE_TRANSPORT.DUONG_BO) {
			return `Đường bộ (${detailBatchBill?.weightSessionUu?.truckUu?.licensePlate || '---'})`;
		}
		if (detailBatchBill?.transportType == TYPE_TRANSPORT.DUONG_THUY) {
			if (detailBatchBill?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP) {
				return `Đường thủy (${detailBatchBill?.batchsUu?.shipUu?.licensePlate || '---'} - ${
					detailBatchBill?.batchsUu?.shipOutUu?.licensePlate || '---'
				})`;
			} else {
				return `Đường thủy (${detailBatchBill?.batchsUu?.shipUu?.licensePlate || '---'})`;
			}
		}
		return '---';
	};

	const exportExcel = useMutation({
		mutationFn: (isHaveSpec: number) => {
			return httpRequest({
				http: weightSessionServices.exportExcelWs({
					page: 1,
					pageSize: 200,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					scalesType: [],
					customerUuid: '',
					isBatch: null,
					productTypeUuid: '',
					status: [
						STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE,
						STATUS_WEIGHT_SESSION.CAN_LAN_2,
						STATUS_WEIGHT_SESSION.UPDATE_DRY_DONE,
						STATUS_WEIGHT_SESSION.CHOT_KE_TOAN,
						STATUS_WEIGHT_SESSION.KCS_XONG,
					],
					timeStart: null,
					timeEnd: null,
					shipUuid: '',
					scalesStationUuid: '',
					storageUuid: '',
					billUuid: _id as string,
					codeStart: null,
					codeEnd: null,
					specUuid: null,
					truckPlate: '',
					shift: null,
					isHaveSpec: isHaveSpec,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
				setOpenExportExcel(false);
			}
		},
	});

	const handleExportExcel = (isHaveSpec: number) => {
		return exportExcel.mutate(isHaveSpec);
	};

	return (
		<div className={styles.container}>
			<Loading loading={exportExcel.isLoading} />
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
						p_8_16
						green
						bold
						onClick={() => {
							setOpenExportExcel(true);
						}}
					>
						Xuất excel
					</Button>
					<Button rounded_2 w_fit primary p_8_16 bold onClick={() => setOpenUpdateShip(true)}>
						Cập nhật tàu trung chuyển
					</Button>
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
							<span style={{marginLeft: '6px', fontWeight: 600}}>{getlicensePlate()}</span>
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
								{detailBatchBill?.isBatch == TYPE_BATCH.KHONG_CAN && 'Không qua cân'}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Tàu trung chuyển: </span>
								<span style={{marginLeft: '6px', fontWeight: 600}}>
									{detailBatchBill?.shipTempUu?.licensePlate || '---'}
								</span>
							</div>
						</td>
						<td>
							<span>Lượng tươi theo mớn:</span>
							{detailBatchBill?.weightMon ? (
								<span style={{marginLeft: '6px', fontWeight: 600}}>
									{convertWeight(detailBatchBill?.weightMon!)}
									<span style={{marginLeft: '6px', fontWeight: 600}}>(Tấn)</span>
								</span>
							) : (
								'---'
							)}
						</td>
					</tr>
					<tr>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Trạm cân: </span>
								<span style={{marginLeft: '6px', fontWeight: 600}}>{detailBatchBill?.scalesStationUu?.name || '---'}</span>
							</div>
						</td>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Số hiệu tàu: </span>
								<span style={{marginLeft: '6px', fontWeight: 600}}>
									{detailBatchBill?.scalesType == TYPE_SCALES.CAN_XUAT ||
									detailBatchBill?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP ? (
										detailBatchBill?.isBatch == TYPE_BATCH.CAN_LO ? (
											<div className={styles.item_table}>
												<span>{detailBatchBill?.numShip || '---'}</span>
											</div>
										) : (
											<div className={styles.item_table}>
												<span>{'---'}</span>
											</div>
										)
									) : (
										'---'
									)}
								</span>
							</div>
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
							<span className={styles.state_action}>
								<span style={{marginRight: '6px'}}>Xác nhận SL: </span>
								{detailBatchBill?.scalesType != TYPE_SCALES.CAN_XUAT ? (
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
								) : (
									'---'
								)}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span className={styles.state_action}>
								<span style={{marginRight: '6px'}}>File ảnh: </span>
								{detailBatchBill?.weightMon ? (
									<span>
										<Button rounded_8 w_fit p_6_12 green bold onClick={() => setOpen(true)}>
											Chi tiết
										</Button>
									</span>
								) : (
									'---'
								)}
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

			<Popup open={open} onClose={() => setOpen(false)}>
				<div className={styles.main_form}>
					<SliderImage listImage={detailBatchBill?.path! || []} />
					<div className={styles.icon_close} onClick={() => setOpen(false)}>
						<IoClose size={24} color='#23262F' />
					</div>
				</div>
			</Popup>

			<Popup open={openUpdateShip} onClose={() => setOpenUpdateShip(false)}>
				<FormUpdateShipBill uuid={detailBatchBill?.uuid!} onClose={() => setOpenUpdateShip(false)} />
			</Popup>

			<Popup open={openExportExcel} onClose={() => setOpenExportExcel(false)}>
				<FormAccessSpecExcel
					onAccess={() => {
						handleExportExcel(1);
					}}
					onClose={() => {
						setOpenExportExcel(false);
					}}
					onDeny={() => {
						handleExportExcel(0);
					}}
				/>
			</Popup>
		</div>
	);
}

export default MainDetailScales;
