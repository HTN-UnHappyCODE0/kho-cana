import React, {useState} from 'react';

import {ITableBillScale, PropsMainPageScalesAll} from './interfaces';
import styles from './MainPageScalesAll.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATE_BILL,
	STATUS_BILL,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_SIFT,
} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import batchBillServices from '~/services/batchBillServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import IconCustom from '~/components/common/IconCustom';
import {Eye, Play, StopCircle} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import Link from 'next/link';
import {LuPencil} from 'react-icons/lu';
import shipServices from '~/services/shipServices';
import {convertWeight} from '~/common/funcs/optionConvert';

function MainPageScalesAll({}: PropsMainPageScalesAll) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _isBatch, _customerUuid, _productTypeUuid, _shipUuid, _status, _dateFrom, _dateTo, _state} =
		router.query;

	const [uuidPlay, setUuidPlay] = useState<string>('');
	const [uuidStop, setUuidStop] = useState<string>('');

	const [listBatchBill, setListBatchBill] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 20,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					partnerUUid: '',
					userUuid: '',
					status: null,
					typeCus: null,
					provinceId: '',
					specUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 20,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					type: [TYPE_PRODUCT.CONG_TY, TYPE_PRODUCT.DUNG_CHUNG],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listShip = useQuery([QUERY_KEY.dropdown_ma_tau], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: shipServices.listShip({
					page: 1,
					pageSize: 20,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
				}),
			}),

		select(data) {
			return data;
		},
	});

	const getListBatch = useQuery(
		[
			QUERY_KEY.table_phieu_can_tat_ca,
			_page,
			_pageSize,
			_keyword,
			_isBatch,
			_customerUuid,
			_productTypeUuid,
			_shipUuid,
			_status,
			_dateFrom,
			_dateTo,
			_state,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: batchBillServices.getListBill({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 20,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						scalesType: [],
						state: !!_state
							? [Number(_state)]
							: [
									STATE_BILL.NOT_CHECK,
									STATE_BILL.QLK_REJECTED,
									STATE_BILL.QLK_CHECKED,
									STATE_BILL.KTK_REJECTED,
									STATE_BILL.KTK_CHECKED,
									STATE_BILL.END,
							  ],
						customerUuid: (_customerUuid as string) || '',
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						isCreateBatch: null,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: !!_status
							? [Number(_status)]
							: [
									STATUS_BILL.DANG_CAN,
									STATUS_BILL.TAM_DUNG,
									STATUS_BILL.DA_CAN_CHUA_KCS,
									STATUS_BILL.DA_KCS,
									STATUS_BILL.CHOT_KE_TOAN,
							  ],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						warehouseUuid: '',
						qualityUuid: '',
						transportType: null,
						shipUuid: (_shipUuid as string) || '',
					}),
				}),
			onSuccess(data) {
				if (data) {
					setListBatchBill(
						data?.items?.map((v: any, index: number) => ({
							...v,
							index: index,
							isChecked: false,
						}))
					);
					setTotal(data?.pagination?.totalCount);
				}
			},
			select(data) {
				return data;
			},
		}
	);

	const fucnStartBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Bắt đầu lệnh cân thành công!',
				http: batchBillServices.startBatchbill({
					uuid: uuidPlay,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidPlay('');
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_tat_ca]);
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const fucnStopBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Kết thúc lệnh cân thành công!',
				http: batchBillServices.stopBatchbill({
					uuid: uuidStop,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidStop('');
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_tat_ca]);
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const getUrlUpdateBill = (data: ITableBillScale): string => {
		if (data.scalesType == TYPE_SCALES.CAN_NHAP) {
			return `/phieu-can/chinh-sua-phieu-nhap?_id=${data.uuid}`;
		}
		if (data.scalesType == TYPE_SCALES.CAN_XUAT) {
			return `/phieu-can/chinh-sua-phieu-xuat?_id=${data.uuid}`;
		}
		if (data.scalesType == TYPE_SCALES.CAN_DICH_VU) {
			return `/phieu-can/chinh-sua-phieu-dich-vu?_id=${data.uuid}`;
		}
		if (data.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO) {
			return `/phieu-can/chinh-sua-phieu-chuyen-kho?_id=${data.uuid}`;
		}
		if (data.scalesType == TYPE_SCALES.CAN_TRUC_TIEP) {
			return `/phieu-can/chinh-sua-phieu-xuat-thang?_id=${data.uuid}`;
		}
		return '/phieu-can/tat-ca';
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnStartBatchBill.isLoading || fucnStopBatchBill.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lô hàng' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Kiểu cân'
							query='_isBatch'
							listFilter={[
								{
									id: TYPE_BATCH.CAN_LO,
									name: 'Cân lô',
								},
								{
									id: TYPE_BATCH.CAN_LE,
									name: 'Cân lẻ',
								},
							]}
						/>
					</div>

					<FilterCustom
						isSearch
						name='Khách hàng'
						query='_customerUuid'
						listFilter={listCustomer?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>
					<FilterCustom
						isSearch
						name='Loại gỗ'
						query='_productTypeUuid'
						listFilter={listProductType?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>

					<FilterCustom
						isSearch
						name='Mã tàu'
						query='_shipUuid'
						listFilter={listShip?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.licensePalate,
						}))}
					/>

					<FilterCustom
						isSearch
						name='Xác nhận SL'
						query='_state'
						listFilter={[
							{
								id: STATE_BILL.NOT_CHECK,
								name: 'Chưa duyệt',
							},
							{
								id: STATE_BILL.QLK_REJECTED,
								name: 'QLK duyệt lại',
							},
							{
								id: STATE_BILL.QLK_CHECKED,
								name: 'QLK đã duyệt',
							},
							{
								id: STATE_BILL.KTK_REJECTED,
								name: 'KTK duyệt lại',
							},
							{
								id: STATE_BILL.KTK_CHECKED,
								name: 'KTK đã duyệt',
							},
							{
								id: STATE_BILL.END,
								name: 'Kết thúc',
							},
						]}
					/>
					<FilterCustom
						isSearch
						name='Trạng thái'
						query='_status'
						listFilter={[
							{
								id: STATUS_BILL.DANG_CAN,
								name: 'Đang cân',
							},
							{
								id: STATUS_BILL.TAM_DUNG,
								name: 'Tạm dừng',
							},
							{
								id: STATUS_BILL.DA_CAN_CHUA_KCS,
								name: 'Đã cân chưa KCS',
							},
							{
								id: STATUS_BILL.DA_KCS,
								name: 'Đã KCS',
							},
							{
								id: STATUS_BILL.CHOT_KE_TOAN,
								name: 'Chốt kế toán',
							},
						]}
					/>
					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listBatchBill || []}
					loading={getListBatch?.isFetching}
					noti={<Noti des='Hiện tại chưa có phiếu cân nào, thêm ngay?' disableButton />}
				>
					<Table
						data={listBatchBill || []}
						onSetData={setListBatchBill}
						column={[
							{
								title: 'STT',
								checkBox: true,
								render: (data: ITableBillScale, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: ITableBillScale) => (
									<Link href={`/phieu-can/${data.uuid}`} className={styles.link}>
										{data?.code}
									</Link>
								),
							},
							{
								title: 'Loại cân',
								render: (data: ITableBillScale) => (
									<p style={{fontWeight: 600}}>
										{data?.scalesType == TYPE_SCALES.CAN_NHAP && 'Cân nhập'}
										{data?.scalesType == TYPE_SCALES.CAN_XUAT && 'Cân xuất'}
										{data?.scalesType == TYPE_SCALES.CAN_DICH_VU && 'Cân dịch vụ'}
										{data?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO && 'Cân chuyển kho'}
										{data?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP && 'Cân xuất thẳng'}
									</p>
								),
							},
							{
								title: 'Mã tàu',
								render: (data: ITableBillScale) => (
									<p style={{fontWeight: 600}}>{data?.batchsUu?.shipUu?.licensePalate || '---'}</p>
								),
							},
							{
								title: 'Mã tàu xuất',
								render: (data: ITableBillScale) => (
									<>
										<p style={{fontWeight: 600}}>{data?.batchsUu?.shipOutUu?.licensePalate || '---'}</p>
									</>
								),
							},
							{
								title: 'Từ',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.fromUu?.name || data?.customerName}</p>
										{/* <p>({data?.fromUu?.parentUu?.name || '---'})</p> */}
									</>
								),
							},
							{
								title: 'Đến',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
										{/* <p>({data?.toUu?.parentUu?.name || '---'})</p> */}
									</>
								),
							},
							{
								title: 'KL hàng (tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weightTotal) || 0}</>,
							},
							{
								title: 'Loại gỗ',
								render: (data: ITableBillScale) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Quy cách',
								render: (data: ITableBillScale) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'Phân loại',
								render: (data: ITableBillScale) => (
									<>
										{data?.isSift == TYPE_SIFT.CAN_SANG && 'Cần sàng'}
										{data?.isSift == TYPE_SIFT.KHONG_CAN_SANG && 'Không cần sàng'}
									</>
								),
							},
							{
								title: 'Xác nhận SL',
								render: (data: ITableBillScale) => (
									<p style={{fontWeight: 600, color: ''}}>
										{data?.state == STATE_BILL.NOT_CHECK && <span style={{color: '#FF6838'}}>Chưa duyệt</span>}
										{data?.state == STATE_BILL.QLK_REJECTED && <span style={{color: '#6170E3'}}>QLK duyệt lại</span>}
										{data?.state == STATE_BILL.QLK_CHECKED && <span style={{color: '#6FD195'}}>QLK đã duyệt</span>}
										{data?.state == STATE_BILL.KTK_REJECTED && <span style={{color: '#FFAE4C'}}>KTK duyệt lại</span>}
										{data?.state == STATE_BILL.KTK_CHECKED && <span style={{color: '#3CC3DF'}}>KTK đã duyệt</span>}
										{data?.state == STATE_BILL.END && <span style={{color: '#D95656'}}>Kết thúc</span>}
									</p>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: ITableBillScale) => (
									<>
										{data?.status == STATUS_BILL.DANG_CAN && <span style={{color: '#9757D7'}}>Đang cân</span>}
										{data?.status == STATUS_BILL.TAM_DUNG && <span style={{color: '#353945'}}>Tạm dừng</span>}
										{data?.status == STATUS_BILL.DA_CAN_CHUA_KCS && (
											<span style={{color: '#D94212'}}>Đã cân chưa KCS</span>
										)}
										{data?.status == STATUS_BILL.DA_KCS && <span style={{color: '#3772FF'}}>Đã KCS</span>}
										{data?.status == STATUS_BILL.CHOT_KE_TOAN && <span style={{color: '#2CAE39'}}>Chốt kế toán</span>}
									</>
								),
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: ITableBillScale) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
										{/* Bắt đầu cân */}
										{data?.status == STATUS_BILL.CHUA_CAN || data?.status == STATUS_BILL.TAM_DUNG ? (
											<IconCustom
												edit
												icon={<Play size={22} fontWeight={600} />}
												tooltip='Bắt đầu cân'
												color='#777E90'
												onClick={() => setUuidPlay(data?.uuid)}
											/>
										) : null}

										{/* Kết thúc phiên cân */}
										{data?.status == STATUS_BILL.DANG_CAN || data?.status == STATUS_BILL.TAM_DUNG ? (
											<IconCustom
												edit
												icon={<StopCircle size={22} fontWeight={600} />}
												tooltip='Kết thúc cân'
												color='#D95656'
												onClick={() => setUuidStop(data?.uuid)}
											/>
										) : null}

										{/* Chỉnh sửa phiếu */}
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											href={getUrlUpdateBill(data)}
										/>

										{/* Xem chi tiết */}
										<IconCustom
											edit
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={`/phieu-can/${data.uuid}`}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				{!getListBatch.isFetching && (
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 20}
						total={total}
						dependencies={[
							_pageSize,
							_keyword,
							_isBatch,
							_customerUuid,
							_productTypeUuid,
							_shipUuid,
							_status,
							_dateFrom,
							_dateTo,
							_state,
						]}
					/>
				)}
			</div>

			{/* Bắt đầu cân */}
			<Dialog
				open={!!uuidPlay}
				title='Bắt đầu cân'
				note='Bạn có muốn thực hiện thao tác cân cho phiếu cân này không?'
				onClose={() => setUuidPlay('')}
				onSubmit={fucnStartBatchBill.mutate}
			/>

			{/* Kết thúc cân */}
			<Dialog
				danger
				open={!!uuidStop}
				title='Kết thúc cân'
				note='Bạn có muốn thực hiện thao tác kết thúc cho phiếu cân này không?'
				onClose={() => setUuidStop('')}
				onSubmit={fucnStopBatchBill.mutate}
			/>
		</div>
	);
}

export default MainPageScalesAll;
