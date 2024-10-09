import React, {useState} from 'react';
import Image from 'next/image';
import {IDataBill, PropsMainPageBillAll} from './interfaces';
import styles from './MainPageBillAll.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_BILL,
	STATUS_CUSTOMER,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import Moment from 'react-moment';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {AddSquare, Eye, Play, Trash} from 'iconsax-react';
import TippyHeadless from '@tippyjs/react/headless';
import Link from 'next/link';
import Popup from '~/components/common/Popup';
import PopupDeleteBill from '../PopupDeleteBill';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import batchBillServices from '~/services/batchBillServices';
import shipServices from '~/services/shipServices';
import {convertCoin} from '~/common/funcs/convertCoin';

function MainPageBillAll({}: PropsMainPageBillAll) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [uuidPlay, setUuidPlay] = useState<string>('');

	const {_page, _pageSize, _keyword, _customerUuid, _productTypeUuid, _shipUuid, _status, _dateFrom, _dateTo} = router.query;

	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [billUuid, setBilldUuid] = useState<string | null>(null);

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
					status: STATUS_CUSTOMER.HOP_TAC,
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
	const listShip = useQuery([QUERY_KEY.dropdown_ma_tau], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: shipServices.listShip({
					page: 1,
					pageSize: 50,
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

	const listBatch = useQuery(
		[
			QUERY_KEY.table_lenh_can_tat_ca,
			_page,
			_pageSize,
			_keyword,
			_customerUuid,
			_productTypeUuid,
			_shipUuid,
			_status,
			_dateFrom,
			_dateTo,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: batchBillServices.getListBill({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 50,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						scalesType: [],
						customerUuid: (_customerUuid as string) || '',
						isBatch: TYPE_BATCH.CAN_LO,
						isCreateBatch: 1,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: !!_status ? (_status as string)?.split(',')?.map((v: string) => Number(v)) : [],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						warehouseUuid: '',
						qualityUuid: '',
						transportType: null,
						shipUuid: (_shipUuid as string) || '',
						typeCheckDay: 0,
						ScalesStationUuid: '',
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	const funcStartBatchBill = useMutation({
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
				queryClient.invalidateQueries([QUERY_KEY.table_lenh_can_tat_ca]);
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const getUrlUpdateBatchBill = (data: IDataBill): string => {
		if (data.scalesType == TYPE_SCALES.CAN_NHAP) {
			return `/lenh-can/chinh-sua-lenh-nhap?_id=${data.uuid}`;
		}
		if (data.scalesType == TYPE_SCALES.CAN_XUAT) {
			return `/lenh-can/chinh-sua-lenh-xuat?_id=${data.uuid}`;
		}
		if (data.scalesType == TYPE_SCALES.CAN_DICH_VU) {
			return `/lenh-can/chinh-sua-lenh-dich-vu?_id=${data.uuid}`;
		}
		if (data.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO) {
			return `/lenh-can/chinh-sua-lenh-chuyen-kho?_id=${data.uuid}`;
		}
		if (data.scalesType == TYPE_SCALES.CAN_TRUC_TIEP) {
			return `/lenh-can/chinh-sua-lenh-xuat-thang?_id=${data.uuid}`;
		}
		return '/lenh-can/tat-ca';
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcStartBatchBill.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lô hàng' />
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
						name='Trạng thái'
						query='_status'
						listFilter={[
							{
								id: STATUS_BILL.DA_HUY,
								name: 'Đã hủy bỏ',
							},
							{
								id: STATUS_BILL.CHUA_CAN,
								name: 'Chưa xử lý',
							},
							{
								id: `${STATUS_BILL.DANG_CAN}, ${STATUS_BILL.TAM_DUNG}`,
								name: 'Đang xử lý',
							},
							{
								id: `${STATUS_BILL.DA_CAN_CHUA_KCS}, ${STATUS_BILL.DA_KCS}, ${STATUS_BILL.CHOT_KE_TOAN}`,
								name: 'Đã hoàn thành',
							},
						]}
					/>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div>
				</div>

				<TippyHeadless
					maxWidth={'100%'}
					interactive
					visible={openCreate}
					onClickOutside={() => setOpenCreate(false)}
					placement='bottom-end'
					render={(attrs: any) => (
						<div className={styles.main_option}>
							<Link onClick={() => setOpenCreate(false)} href={'/lenh-can/them-lenh-nhap'} className={styles.item}>
								<div className={styles.icon}>
									<AddSquare size={20} />
								</div>
								<p>Cân nhập</p>
							</Link>
							<Link onClick={() => setOpenCreate(false)} href={'/lenh-can/them-lenh-xuat'} className={styles.item}>
								<div className={styles.icon}>
									<AddSquare size={20} />
								</div>
								<p>Cân xuất</p>
							</Link>
							<Link onClick={() => setOpenCreate(false)} href={'/lenh-can/them-lenh-dich-vu'} className={styles.item}>
								<div className={styles.icon}>
									<AddSquare size={20} />
								</div>
								<p>Cân dịch vụ</p>
							</Link>
							<Link href={'/lenh-can/them-lenh-chuyen-kho'} onClick={() => setOpenCreate(false)} className={styles.item}>
								<div className={styles.icon}>
									<AddSquare size={20} />
								</div>
								<p>Cân chuyển kho</p>
							</Link>
							<Link href={'/lenh-can/them-lenh-xuat-thang'} onClick={() => setOpenCreate(false)} className={styles.item}>
								<div className={styles.icon}>
									<AddSquare size={20} />
								</div>
								<p>Cân xuất thẳng</p>
							</Link>
						</div>
					)}
				>
					<div>
						<Button
							p_8_16
							icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
							rounded_2
							onClick={() => setOpenCreate(!openCreate)}
						>
							Tạo lệnh cân
						</Button>
					</div>
				</TippyHeadless>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listBatch?.data?.items || []}
					loading={listBatch?.isLoading}
					noti={<Noti des='Hiện tại chưa có lệnh cân nào, thêm ngay?' disableButton />}
				>
					<Table
						data={listBatch?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IDataBill, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô hàng',
								fixedLeft: true,
								render: (data: IDataBill) => (
									<Link href={`/lenh-can/${data.uuid}`} className={styles.link}>
										{data?.code}
									</Link>
								),
							},
							{
								title: 'Loại cân',
								render: (data: IDataBill) => (
									<p style={{fontWeight: 600}}>
										{data?.scalesType == TYPE_SCALES.CAN_NHAP && 'Cân nhập'}
										{data?.scalesType == TYPE_SCALES.CAN_XUAT && 'Cân xuất'}
										{data?.scalesType == TYPE_SCALES.CAN_DICH_VU && 'Cân dịch vụ'}
										{data?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO && 'Cân chuyển kho'}
										{data?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP && 'Cân xuất thẳng'}
									</p>
								),
							},
							// {
							// 	title: 'Mã tàu',
							// 	render: (data: IDataBill) => (
							// 		<p style={{fontWeight: 600}}>{data?.batchsUu?.shipUu?.licensePalate || '---'}</p>
							// 	),
							// },
							// {
							// 	title: 'Mã tàu xuất',
							// 	render: (data: IDataBill) => (
							// 		<>
							// 			<p style={{fontWeight: 600}}>{data?.batchsUu?.shipOutUu?.licensePalate || '---'}</p>
							// 		</>
							// 	),
							// },
							{
								title: 'Từ',
								render: (data: IDataBill) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.fromUu?.name || data?.customerName}</p>
										{/* <p>({data?.fromUu?.parentUu?.name || '---'})</p> */}
										<p style={{fontWeight: 400, color: '#3772FF'}}>{data?.batchsUu?.shipUu?.licensePalate || '---'}</p>
									</>
								),
							},
							{
								title: 'Đến',
								render: (data: IDataBill) => (
									<>
										<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
										<p style={{fontWeight: 400, color: '#3772FF'}}>
											{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
										</p>
										{/* <p>({data?.toUu?.parentUu?.name || '---'})</p> */}
									</>
								),
							},
							{
								title: 'Loại hàng',
								render: (data: IDataBill) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'KL dự kiến (tấn)',
								render: (data: IDataBill) => <>{convertCoin(data?.batchsUu?.weightIntent) || '---'}</>,
							},

							{
								title: 'Quy cách',
								render: (data: IDataBill) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'Trạm cân',
								render: (data: IDataBill) => <>{data?.scalesStationUu?.name || '---'}</>,
							},
							{
								title: 'Ngày dự kiến',
								render: (data: IDataBill) => (
									<>
										{data?.batchsUu?.timeIntend ? (
											<Moment date={data?.batchsUu?.timeIntend} format='DD/MM/YYYY' />
										) : (
											'---'
										)}
									</>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: IDataBill) => (
									<>
										{data?.status == STATUS_BILL.DA_HUY && <span style={{color: '#D94212'}}>Đã hủy bỏ</span>}
										{data?.status == STATUS_BILL.CHUA_CAN && <span style={{color: '#3772FF'}}>Chưa xử lý</span>}
										{(data?.status == STATUS_BILL.DANG_CAN || data?.status == STATUS_BILL.TAM_DUNG) && (
											<span style={{color: '#9757D7'}}>Đang xử lý</span>
										)}
										{data?.status >= STATUS_BILL.DA_CAN_CHUA_KCS && (
											<span style={{color: '#2CAE39'}}>Đã hoàn thành</span>
										)}
									</>
								),
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IDataBill) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										{data?.status == STATUS_BILL.CHUA_CAN || data?.status == STATUS_BILL.TAM_DUNG ? (
											<IconCustom
												edit
												icon={<Play size={22} fontWeight={600} />}
												tooltip='Bắt đầu cân'
												color='#777E90'
												onClick={() => setUuidPlay(data?.uuid)}
											/>
										) : null}
										{data?.status < STATUS_BILL.DA_CAN_CHUA_KCS && data?.status != STATUS_BILL.DA_HUY ? (
											<IconCustom
												edit
												icon={<LuPencil fontSize={20} fontWeight={600} />}
												tooltip='Chỉnh sửa'
												color='#777E90'
												href={getUrlUpdateBatchBill(data)}
											/>
										) : null}
										{data?.status == STATUS_BILL.CHUA_CAN && (
											<IconCustom
												lock
												icon={<Trash size='22' />}
												tooltip={'Hủy phiếu'}
												color='#777E90'
												onClick={() => setBilldUuid(data.uuid)}
											/>
										)}

										<IconCustom
											edit
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={`/lenh-can/${data.uuid}`}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 50}
					total={listBatch?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, , _customerUuid, _productTypeUuid, _shipUuid, _status, _dateFrom, _dateTo]}
				/>
			</div>

			<Dialog
				open={!!uuidPlay}
				title='Bắt đầu cân'
				note='Bạn có muốn thực hiện thao tác cân cho phiếu cân này không?'
				onClose={() => setUuidPlay('')}
				onSubmit={funcStartBatchBill.mutate}
			/>

			{/* POPUP */}
			<Popup open={!!billUuid} onClose={() => setBilldUuid(null)}>
				<PopupDeleteBill uuid={billUuid} onClose={() => setBilldUuid(null)} />
			</Popup>
		</div>
	);
}

export default MainPageBillAll;
