import React, {useState} from 'react';

import {ITableBillScale, PropsPageConfirmOutput} from './interfaces';
import styles from './PageConfirmOutput.module.scss';
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
import {useRouter} from 'next/router';
import wareServices from '~/services/wareServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Link from 'next/link';
import {convertCoin} from '~/common/funcs/convertCoin';
import Pagination from '~/components/common/Pagination';
import batchBillServices from '~/services/batchBillServices';
import IconCustom from '~/components/common/IconCustom';
import {Eye, RefreshLeftSquare, TickCircle} from 'iconsax-react';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import Popup from '~/components/common/Popup';
import PopupRejectBatchBill from '../../phieu-can/PopupRejectBatchBill';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';

function PageConfirmOutput({}: PropsPageConfirmOutput) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _customerUuid, _isBatch, _productTypeUuid, _state, _dateFrom, _dateTo} = router.query;

	const [uuidKTKConfirm, setUuidKTKConfirm] = useState<string[]>([]);
	const [uuidKTKReject, setUuidKTKReject] = useState<string[]>([]);

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

	const getListBatch = useQuery(
		[
			QUERY_KEY.table_ktk_duyet_san_luong,
			_page,
			_pageSize,
			_keyword,
			_customerUuid,
			_isBatch,
			_productTypeUuid,
			_dateFrom,
			_state,
			_dateTo,
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
						customerUuid: (_customerUuid as string) || '',
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						isCreateBatch: null,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: [
							STATUS_BILL.DANG_CAN,
							STATUS_BILL.TAM_DUNG,
							STATUS_BILL.DA_CAN_CHUA_KCS,
							STATUS_BILL.DA_KCS,
							STATUS_BILL.CHOT_KE_TOAN,
						],
						state: !!_state ? [Number(_state)] : [STATE_BILL.QLK_CHECKED, STATE_BILL.KTK_REJECTED],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						warehouseUuid: '',
						qualityUuid: '',
						transportType: null,
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
				if (data) {
					return data;
				}
			},
		}
	);

	const fucnKTKConfirmBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'KTK duyệt sản lượng thành công!',
				http: batchBillServices.KTKConfirmBatchbill({
					uuid: uuidKTKConfirm,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidKTKConfirm([]);
				queryClient.invalidateQueries([QUERY_KEY.table_ktk_duyet_san_luong]);
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={fucnKTKConfirmBatchBill.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					{listBatchBill?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								primary
								p_4_12
								onClick={() => {
									setUuidKTKConfirm(listBatchBill?.filter((v) => v.isChecked !== false)?.map((x: any) => x.uuid));
								}}
							>
								KTK duyệt sản lượng
							</Button>
						</div>
					)}

					{listBatchBill?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								danger
								p_4_12
								onClick={() => {
									setUuidKTKReject(listBatchBill?.filter((v) => v.isChecked !== false)?.map((x: any) => x.uuid));
								}}
							>
								Yêu cầu duyệt lại
							</Button>
						</div>
					)}

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
						name='Xác Nhận SL'
						query='_state'
						listFilter={[
							{
								id: STATE_BILL.QLK_CHECKED,
								name: 'QLK đã duyệt',
							},
							{
								id: STATE_BILL.KTK_REJECTED,
								name: 'KTK duyệt lại',
							},
						]}
					/>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div>
				</div>
			</div>
			<div className={clsx('mt')}>
				<div className={styles.parameter}>
					<div>
						TỔNG LƯỢNG HÀNG TƯƠI:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertCoin(getListBatch?.data?.amountMt) || 0} </span>(Tấn)
					</div>
					<div>
						TỔNG LƯỢNG HÀNG QUY KHÔ:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertCoin(getListBatch?.data?.amountBdmt) || 0} </span>(Tấn)
					</div>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listBatchBill || []}
					loading={getListBatch?.isFetching}
					noti={<Noti des='Hiện tại chưa có lô nào!' disableButton />}
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
									<p style={{fontWeight: 600}}>{data?.batchsUu?.shipOutUu?.licensePalate || '---'}</p>
								),
							},
							{
								title: 'Từ',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.fromUu?.name || data?.customerName}</p>
									</>
								),
							},
							{
								title: 'Loại gỗ',
								render: (data: ITableBillScale) => <>{data?.productTypeUu?.name || '---'}</>,
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
								title: 'Quy cách',
								render: (data: ITableBillScale) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'Đến',
								render: (data: ITableBillScale) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
									</>
								),
							},
							{
								title: 'KL tươi (tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weightTotal) || 0}</>,
							},
							{
								title: 'KL độ khô (tấn)',
								render: (data: ITableBillScale) => <>{convertWeight(data?.weightBdmt) || 0}</>,
							},
							{
								title: 'Độ khô (%)',
								render: (data: ITableBillScale) => <>{formatDrynessAvg(data?.drynessAvg) || 0}</>,
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
										{data?.status >= STATUS_BILL.DA_CAN_CHUA_KCS &&
										data.state <= STATE_BILL.KTK_REJECTED &&
										data.state > STATE_BILL.QLK_REJECTED ? (
											<IconCustom
												edit
												icon={<TickCircle size={22} fontWeight={600} />}
												tooltip='KTK duyệt'
												color='#2CAE39'
												onClick={() => setUuidKTKConfirm([data?.uuid])}
											/>
										) : null}

										{data?.status >= STATUS_BILL.DA_CAN_CHUA_KCS &&
										(data.state == STATE_BILL.QLK_CHECKED || data.state == STATE_BILL.KTK_REJECTED) ? (
											<IconCustom
												edit
												icon={<RefreshLeftSquare size={22} fontWeight={600} />}
												tooltip='Yêu cầu duyệt lại'
												color='#D95656'
												onClick={() => setUuidKTKReject([data?.uuid])}
											/>
										) : null}

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
						dependencies={[_pageSize, _keyword, _customerUuid, _isBatch, _productTypeUuid, _state, _dateFrom, _dateTo]}
					/>
				)}
			</div>

			{/* Kế toán kho duyệt */}
			<Dialog
				danger
				open={uuidKTKConfirm.length > 0}
				title='KTK duyệt sản lượng'
				note='Bạn có muốn thực hiện thao tác duyệt sản lượng cho phiếu cân này không?'
				onClose={() => setUuidKTKConfirm([])}
				onSubmit={fucnKTKConfirmBatchBill.mutate}
			/>

			{/* Quản lý kho từ chối */}
			<Popup open={uuidKTKReject.length > 0} onClose={() => setUuidKTKReject([])}>
				<PopupRejectBatchBill uuids={uuidKTKReject} onClose={() => setUuidKTKReject([])} />
			</Popup>
		</div>
	);
}

export default PageConfirmOutput;
