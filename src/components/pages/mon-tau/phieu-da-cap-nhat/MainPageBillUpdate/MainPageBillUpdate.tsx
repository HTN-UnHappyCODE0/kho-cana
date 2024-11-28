import React, {useEffect, useRef, useState} from 'react';

import {PropsMainPageBillUpdate} from './interfaces';
import styles from './MainPageBillUpdate.module.scss';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_BILL,
	TYPE_ACTION_AUDIT,
	TYPE_BATCH,
	TYPE_CUSTOMER,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import customerServices from '~/services/customerServices';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import {useRouter} from 'next/router';

import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';

import {AiOutlineFileAdd} from 'react-icons/ai';
import Button from '~/components/common/Button';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import {LuFileSymlink} from 'react-icons/lu';
import Dialog from '~/components/common/Dialog';

import Link from 'next/link';
import {convertWeight} from '~/common/funcs/optionConvert';
import Moment from 'react-moment';
import storageServices from '~/services/storageServices';
import scalesStationServices from '~/services/scalesStationServices';
import clsx from 'clsx';
import {convertCoin} from '~/common/funcs/convertCoin';
import batchBillServices from '~/services/batchBillServices';
import StateActive from '~/components/common/StateActive';
import {DocumentText, Edit, Edit2, Eye, TickCircle} from 'iconsax-react';
import Popup from '~/components/common/Popup';
import FormUpdateDraftShip from '../../cap-nhat-mon-tau/FormUpdateDraftShip';
import IconCustom from '~/components/common/IconCustom';

function MainPageBillUpdate({}: PropsMainPageBillUpdate) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const {
		_page,
		_pageSize,
		_keyword,
		_isBatch,
		_isShift,
		_customerUuid,
		_status,
		_productTypeUuid,
		_specUuid,
		_dateFrom,
		_dateTo,
		_storageUuid,
		_scalesStationUuid,
		_state,
	} = router.query;

	const [dataWeightSessionSubmit, setDataWeightSessionSubmit] = useState<any>();

	const [loading, setLoading] = useState<boolean>(false);
	const [weightSessions, setWeightSessions] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					partnerUUid: '',
					userUuid: '',
					status: null,
					typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
					provinceId: '',
					specUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 50,
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

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const getListBatch = useQuery(
		[
			QUERY_KEY.table_cap_nhat_mon_tau,
			_page,
			_pageSize,
			_keyword,
			_customerUuid,
			_isBatch,
			_productTypeUuid,
			_state,
			_dateFrom,
			_dateTo,
			_scalesStationUuid,
			_storageUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: batchBillServices.getListBill({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.IS_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
						customerUuid: (_customerUuid as string) || '',
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						isCreateBatch: null,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: [STATUS_BILL.DA_CAN_CHUA_KCS],
						state: !!_state ? [Number(_state)] : [],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						warehouseUuid: '',
						qualityUuid: '',
						transportType: null,
						typeCheckDay: 0,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						storageUuid: (_storageUuid as string) || '',
						isHaveDryness: TYPE_ACTION_AUDIT.HAVE_DRY,
					}),
				}),
			onSuccess(data) {
				if (data) {
					setWeightSessions(
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

	const listStorage = useQuery([QUERY_KEY.table_bai], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					warehouseUuid: '',
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			if (data) {
				return data;
			}
		},
	});

	const listScalesStation = useQuery([QUERY_KEY.table_tram_can], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: scalesStationServices.listScalesStation({
					page: 1,
					pageSize: 50,
					keyword: '',
					companyUuid: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcUpdateKCSWeightSession = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Gửi kế toán thành công!',
				http: batchBillServices.kcsDoneBill({
					uuid: dataWeightSessionSubmit?.map((v: any) => v?.uuid),
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_do_kho]);
				setDataWeightSessionSubmit([]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	useEffect(() => {
		if (weightSessions.length > 0) {
			inputRefs.current = Array(weightSessions.length)
				.fill(null)
				.map((_, i) => inputRefs.current[i] || null);
		}
	}, [weightSessions]);

	// const handleSubmitSentData = async () => {
	// 	if (dataWeightSessionSubmit.some((v) => v.drynessAvg == null)) {
	// 		return toastWarn({msg: 'Nhập độ khô trước khi gửi kể toán!'});
	// 	}

	// 	return funcUpdateKCSWeightSession.mutate();
	// };

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateKCSWeightSession.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					{weightSessions?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								primary
								p_4_12
								icon={<LuFileSymlink size={18} />}
								onClick={() => {
									setDataWeightSessionSubmit(weightSessions?.filter((v) => v.isChecked !== false));
								}}
							>
								CN mớn tàu
							</Button>
						</div>
					)}

					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo số phiếu và mã lô hàng' />
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
								{
									id: TYPE_BATCH.KHONG_CAN,
									name: 'Không qua cân',
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
						name='Loại hàng'
						query='_productTypeUuid'
						listFilter={listProductType?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>
					{/* <FilterCustom
						isSearch
						name='Quy cách'
						query='_specUuid'
						listFilter={listSpecification?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/> */}

					<FilterCustom
						isSearch
						name='Trạm cân'
						query='_scalesStationUuid'
						listFilter={listScalesStation?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>
					<FilterCustom
						isSearch
						name='Bãi'
						query='_storageUuid'
						listFilter={listStorage?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.YESTERDAY} />
					</div>
				</div>
			</div>
			{/* <div className={clsx('mt')}>
				<div className={styles.parameter}>
					<div>
						TỔNG LƯỢNG HÀNG TƯƠI:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertCoin(getListBatch?.data?.amountMt) || 0} </span>
						(Tấn)
					</div>
					<div>
						TỔNG LƯỢNG HÀNG QUY KHÔ:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertCoin(getListBatch?.data?.amountBdmt) || 0} </span>
						(Tấn)
					</div>
				</div>
			</div> */}

			<div className={styles.table}>
				<DataWrapper
					data={weightSessions || []}
					loading={loading}
					noti={<Noti des='Hiện tại chưa có danh sách nhập liệu nào!' disableButton />}
				>
					<Table
						data={weightSessions || []}
						onSetData={setWeightSessions}
						column={[
							{
								title: 'STT',
								// checkBox: true,
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô/Số phiếu',
								fixedLeft: true,
								render: (data: any) => (
									<>
										{data?.isBatch == TYPE_BATCH.KHONG_CAN ? (
											<Link href={`/nhap-xuat-ngoai/${data.uuid}`} className={styles.link}>
												{data?.code}
											</Link>
										) : (
											<Link href={`/phieu-can/${data.uuid}`} className={styles.link}>
												{data?.code}
											</Link>
										)}
										<p style={{fontWeight: 500, color: '#3772FF'}}>{data?.weightSessionUu?.code || '---'}</p>
									</>
								),
							},
							{
								title: 'Loại cân/ Thời gian kết thúc',
								render: (data: any) => (
									<>
										<p style={{fontWeight: 600}}>
											{data?.scalesType == TYPE_SCALES.CAN_NHAP && 'Cân nhập'}
											{data?.scalesType == TYPE_SCALES.CAN_XUAT && 'Cân xuất'}
											{data?.scalesType == TYPE_SCALES.CAN_DICH_VU && 'Cân dịch vụ'}
											{data?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO && 'Cân chuyển kho'}
											{data?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP && 'Cân xuất thẳng'}
										</p>
										<p style={{fontWeight: 500, color: '#3772FF'}}>
											<Moment date={data?.timeEnd} format='HH:mm - DD/MM/YYYY' />
										</p>
									</>
								),
							},
							{
								title: 'Từ (Tàu/Xe)',
								render: (data: any) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.fromUu?.name || data?.customerName}</p>
										{data?.isBatch == TYPE_BATCH.CAN_LO && (
											<p style={{fontWeight: 600, color: '#3772FF'}}>
												{data?.batchsUu?.shipUu?.licensePalate || '---'}
											</p>
										)}
										{data?.isBatch == TYPE_BATCH.CAN_LE && (
											<p style={{fontWeight: 600, color: '#3772FF'}}>
												{data?.weightSessionUu?.truckUu?.licensePalate || '---'}
											</p>
										)}
									</>
								),
							},
							{
								title: 'Loại hàng',
								render: (data: any) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Kho trung chuyển',
								render: (data: any) => <>{'---'}</>,
							},
							{
								title: 'KL hàng cũ (Tấn)',
								render: (data: any) => <>{0}</>,
							},
							{
								title: 'KL tươi (Tấn)',
								render: (data: any) => <>{convertWeight(data?.weightTotal) || 0}</>,
							},
							{
								title: 'Độ khô (%)',
								render: (data: any) => <>{data?.drynessAvg?.toFixed(2) || 0}</>,
							},
							{
								title: 'KL quy khô (Tấn)',
								render: (data: any) => <>{convertWeight(data?.weightBdmt) || 0}</>,
							},
							{
								title: 'Quy cách',
								render: (data: any) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'Lượng tươi theo mớn (Tấn)',
								render: (data: any) => <>{0}</>,
							},
							{
								title: 'Tổng lượng khô (Tấn)',
								render: (data: any) => <>{convertWeight(data?.weigth2)}</>,
							},

							{
								title: 'Đến',
								render: (data: any) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
										<p style={{fontWeight: 600, color: '#3772FF'}}>
											{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
										</p>
									</>
								),
							},
							// {
							// 	title: 'Phân loại',
							// 	render: (data: any) => (
							// 		<>
							// 			{data?.isSift == TYPE_SIFT.CAN_SANG && 'Cần sàng'}
							// 			{data?.isSift == TYPE_SIFT.KHONG_CAN_SANG && 'Không cần sàng'}
							// 		</>
							// 	),
							// },
							{
								title: 'Độ khô',
								render: (data: any) => <>{data?.documentId || '---'}</>,
							},
							{
								title: 'File đính kèm',
								render: (data: any) => <>{'---'}</>,
							},

							// {
							// 	title: 'Xác nhận SL',
							// 	render: (data: any) => (
							// 		<StateActive
							// 			stateActive={data?.state}
							// 			listState={[
							// 				{
							// 					state: STATE_BILL.NOT_CHECK,
							// 					text: 'Chưa duyệt',
							// 					textColor: '#fff',
							// 					backgroundColor: '#FF5C5C',
							// 				},
							// 				{
							// 					state: STATE_BILL.QLK_REJECTED,
							// 					text: 'QLK duyệt lại',
							// 					textColor: '#fff',
							// 					backgroundColor: '#FB923C',
							// 				},
							// 				{
							// 					state: STATE_BILL.QLK_CHECKED,
							// 					text: 'QLK đã duyệt',
							// 					textColor: '#fff',
							// 					backgroundColor: '#0EA5E9',
							// 				},
							// 				{
							// 					state: STATE_BILL.KTK_REJECTED,
							// 					text: 'KTK duyệt lại',
							// 					textColor: '#fff',
							// 					backgroundColor: '#FF6838',
							// 				},
							// 				{
							// 					state: STATE_BILL.KTK_CHECKED,
							// 					text: 'KTK đã duyệt',
							// 					textColor: '#fff',
							// 					backgroundColor: '#2A85FF',
							// 				},
							// 				{
							// 					state: STATE_BILL.END,
							// 					text: 'Kết thúc',
							// 					textColor: '#fff',
							// 					backgroundColor: '#9757D7',
							// 				},
							// 			]}
							// 		/>
							// 	),
							// },
							// {
							// 	title: 'Trạng thái',
							// 	render: (data: any) => (
							// 		<StateActive
							// 			stateActive={data?.status}
							// 			listState={[
							// 				{
							// 					state: STATUS_BILL.DANG_CAN,
							// 					text: 'Đang cân',
							// 					textColor: '#9757D7',
							// 					backgroundColor: 'rgba(151, 87, 215, 0.10)',
							// 				},
							// 				{
							// 					state: STATUS_BILL.TAM_DUNG,
							// 					text: 'Tạm dừng',
							// 					textColor: '#F95B5B',
							// 					backgroundColor: 'rgba(249, 91, 91, 0.10)',
							// 				},
							// 				{
							// 					state: STATUS_BILL.DA_CAN_CHUA_KCS,
							// 					text: 'Đã cân chưa KCS',
							// 					textColor: '#2D74FF',
							// 					backgroundColor: 'rgba(45, 116, 255, 0.10)',
							// 				},
							// 				{
							// 					state: STATUS_BILL.DA_KCS,
							// 					text: 'Đã KCS',
							// 					textColor: '#41CD4F',
							// 					backgroundColor: 'rgba(65, 205, 79, 0.1)',
							// 				},
							// 				{
							// 					state: STATUS_BILL.CHOT_KE_TOAN,
							// 					text: 'Chốt kế toán',
							// 					textColor: '#0EA5E9',
							// 					backgroundColor: 'rgba(14, 165, 233, 0.1)',
							// 				},
							// 			]}
							// 		/>
							// 	),
							// },

							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: any) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<Edit size={22} fontWeight={600} />}
											tooltip='Cập nhật cảng'
											color='#777E90'
											// onClick={() => setListBatchBillSubmit([data])}
										/>
										<IconCustom
											icon={<Eye size={22} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={`/phieu-can/${data.uuid}`}
										/>
										<IconCustom
											icon={<DocumentText size={22} fontWeight={600} />}
											tooltip='Xem lịch sử'
											color='#777E90'
											href={`/mon-tau/lich-su?_billUuid=${data?.uuid}}`}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				{!loading && (
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 200}
						total={total}
						dependencies={[
							_pageSize,
							_keyword,
							_isBatch,
							_customerUuid,
							_productTypeUuid,
							_specUuid,
							_dateFrom,
							_dateTo,
							_isShift,
							_status,
							_storageUuid,
							_scalesStationUuid,
							_state,
						]}
					/>
				)}
			</div>

			{/* <Dialog
				open={openSentData}
				onClose={() => {
					setOpenSentData(false);
					setDataWeightSessionSubmit([]);
				}}
				title='Xác nhận số liệu và gửi đi!'
				note={`Đang chọn ${dataWeightSessionSubmit?.length} phiếu đã có độ khô! Bạn có chắc chắn muốn gửi đi ?`}
				onSubmit={handleSubmitSentData}
			/> */}

			<Popup open={!!dataWeightSessionSubmit} onClose={() => setDataWeightSessionSubmit(null)}>
				<FormUpdateDraftShip dataUpdate={dataWeightSessionSubmit} onClose={() => setDataWeightSessionSubmit(null)} />
			</Popup>
		</div>
	);
}

export default MainPageBillUpdate;
