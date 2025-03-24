import React, {useRef, useState} from 'react';

import {IDetailCustomer, IlistCustomerSpec, PropsPageDetailPartner} from './interfaces';
import styles from './PageDetailPartner.module.scss';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_BILL,
	TYPE_ACTION_AUDIT,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import TagStatus from '~/components/common/TagStatus';
import {convertWeight, getTextAddress} from '~/common/funcs/optionConvert';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import TagStatusSpecCustomer from '../TagStatusSpecCustomer';
import Popup from '~/components/common/Popup';
import Noti from '~/components/common/DataWrapper/components/Noti';
import PopupAddPrice from '../PopupAddPrice/PopupAddPrice';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import PopupUpdatePrice from '../PopupUpdatePrice';
import TabNavLink from '~/components/common/TabNavLink';
import batchBillServices from '~/services/batchBillServices';
import {ITableBillScale} from '../../cang-boc-do/PageUpdatePort/interfaces';
import Moment from 'react-moment';
import TemplateSampleSpec from '~/components/pdf-template/TemplateSampleSpec';
import {useReactToPrint} from 'react-to-print';
import {toastWarn} from '~/common/funcs/toast';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import wareServices from '~/services/wareServices';
import FilterCustom from '~/components/common/FilterCustom';
import companyServices from '~/services/companyServices';

function PageDetailPartner({}: PropsPageDetailPartner) {
	const router = useRouter();
	const contentToPrint = useRef<HTMLDivElement>(null);

	const {_id, _type, _productTypeUuid, _dateFrom, _dateTo} = router.query;

	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [uuidUpdate, setUuidUpdate] = useState<string>('');
	const [listBatchBill, setListBatchBill] = useState<any[]>([]);
	const [uuidCompany, setUuidCompany] = useState<string>('');

	const listCompany = useQuery([QUERY_KEY.dropdown_cong_ty], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: companyServices.listCompany({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

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
					type: [TYPE_PRODUCT.CONG_TY],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const {isLoading} = useQuery([QUERY_KEY.table_lich_su_nhap_hang_ncc, _id, _productTypeUuid, _dateFrom, _dateTo], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: batchBillServices.getListBill({
					page: 1,
					pageSize: 200,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.IS_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
					listCustomerUuid: _id ? [_id as string] : [],
					customerUuid: '',
					isBatch: null,
					isCreateBatch: null,
					productTypeUuid: (_productTypeUuid as string) || '',
					specificationsUuid: '',
					status: [STATUS_BILL.DA_CAN_CHUA_KCS, STATUS_BILL.DA_KCS, STATUS_BILL.CHOT_KE_TOAN],
					state: [],
					timeStart: _dateFrom ? (_dateFrom as string) : null,
					timeEnd: _dateTo ? (_dateTo as string) : null,
					warehouseUuid: '',
					qualityUuid: '',
					transportType: null,
					typeCheckDay: 1,
					scalesStationUuid: '',
					storageUuid: '',
					isHaveDryness: TYPE_ACTION_AUDIT.HAVE_DRY,
					truckUuid: [],
					companyUuid: '',
					listCompanyUuid: [],
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
			}
		},
		select(data) {
			if (data) {
				return data;
			}
		},
		enabled: !!_id,
	});

	const handlePrint = useReactToPrint({
		content: () => contentToPrint.current,
		documentTitle: 'Xuat_chung_tu_do_kho',
		onBeforePrint: () => console.log('before printing...'),
		onAfterPrint: () => console.log('after printing...'),
		removeAfterPrint: true,
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
						<td>
							<span>KV cảng xuất khẩu:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.companyUu?.name || '---'}</span>
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
						<td rowSpan={2} className={styles.description}>
							<span>Mô tả:</span>
							<span style={{marginLeft: '6px'}}>{detailCustomer?.description || '---'}</span>
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
				<TabNavLink
					listHref={[
						{
							title: 'Danh sách loại hàng',
							pathname: router.pathname,
							query: null,
						},
						{
							title: 'Lịch sử nhập hàng',
							pathname: router.pathname,
							query: 'history-import',
						},
					]}
					query='_type'
				/>
			</div>

			<div className={clsx('mt')}>
				{!_type && (
					<>
						<div className={styles.main_table}>
							<h1 className={styles.list_title}>Danh sách loại hàng</h1>
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
						</div>
						<div className={clsx('mt')}>
							<div className={styles.table}>
								<DataWrapper
									data={detailCustomer?.customerSpec || []}
									noti={<Noti disableButton des='Hiện tại chưa có hàng hóa nào!' />}
								>
									<Table
										data={detailCustomer?.customerSpec || []}
										column={[
											{
												title: 'STT',
												render: (data: IlistCustomerSpec, index: number) => <>{index + 1}</>,
											},
											{
												title: 'Loại hàng',
												fixedLeft: true,
												render: (data: IlistCustomerSpec) => <>{data?.productTypeUu?.name}</>,
											},
											{
												title: 'Quốc gia',
												render: (data: IlistCustomerSpec) => <>{data?.qualityUu?.name}</>,
											},
											{
												title: 'Quy cách',
												render: (data: IlistCustomerSpec) => <>{data?.specUu?.name}</>,
											},
											{
												title: 'Bãi',
												render: (data: IlistCustomerSpec) => <>{data?.storageUu?.name || '---'}</>,
											},
											{
												title: 'Vận chuyển',
												render: (data: IlistCustomerSpec) => (
													<>
														{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
														{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
													</>
												),
											},

											{
												title: 'Cung cấp',
												render: (data: IlistCustomerSpec) => <TagStatusSpecCustomer status={data.state} />,
											},
											{
												title: 'Tác vụ',
												fixedRight: true,
												render: (data: IlistCustomerSpec) => (
													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'flex-end',
															gap: '4px',
														}}
													>
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
							</div>
						</div>
					</>
				)}

				{/* Template */}
				<div style={{display: 'none'}}>
					<TemplateSampleSpec
						ref={contentToPrint}
						customerName={detailCustomer?.name!}
						countSample={listBatchBill
							?.filter((v: any) => v?.isChecked == true)
							?.reduce((acc, item) => acc + item?.countSample, 0)}
						listBill={listBatchBill
							?.filter((v: any) => v?.isChecked == true)
							?.map((x) => ({
								uuid: x?.uuid,
								code: x?.code,
								productName: x?.productTypeUu?.name,
								date: x?.timeEnd,
								licensePalate:
									x?.isBatch == TYPE_BATCH.CAN_LO
										? x?.batchsUu?.shipUu?.licensePalate
										: x?.isBatch == TYPE_BATCH.CAN_LE
										? x?.weightSessionUu?.truckUu?.licensePalate
										: x?.isBatch == TYPE_BATCH.KHONG_CAN
										? '---'
										: '---',
								weightTotal: x?.weightTotal,
								drynessAvg: x?.drynessAvg,
								weightBdmt: x?.weightBdmt,
							}))}
						TypeQuality={listBatchBill
							?.filter((v: any) => v?.isChecked == true)
							?.every((v: any) => v?.qualityUu?.name?.toLowerCase().includes('trung quốc'))}
						// TypeQuality={listBatchBill
						// 	?.filter((v: any) => v?.isChecked == true)
						// 	?.some((v: any) => v?.qualityUu?.name?.toLowerCase().includes('trung quốc'))}
					/>
				</div>

				{_type == 'history-import' && (
					<>
						<div className={styles.main_table}>
							<h1 className={styles.list_title}>Lịch sử nhập hàng</h1>

							{listBatchBill?.some((x) => x.isChecked !== false) && (
								<div>
									<Button
										p_8_16
										rounded_2
										onClick={() => {
											const arr = listBatchBill?.filter((v: any) => v?.isChecked == true);

											if (!arr?.every((v) => v?.productTypeUu?.uuid === arr[0]?.productTypeUu?.uuid)) {
												return toastWarn({msg: 'Chỉ chọn được các lô có cùng loại hàng!'});
											} else {
												handlePrint();
											}
										}}
									>
										Xuất chứng từ
									</Button>
								</div>
							)}
						</div>

						<div className={clsx('mt', styles.filter)}>
							<FilterCustom
								isSearch
								name='Loại hàng'
								query='_productTypeUuid'
								listFilter={listProductType?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
							/>

							<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.LAST_7_DAYS} />
						</div>
						<div className={clsx('mt')}>
							<div className={styles.table}>
								<DataWrapper
									data={listBatchBill || []}
									loading={isLoading}
									noti={<Noti disableButton des='Hiện tại chưa có phiếu cân nào!' />}
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
												title: 'Ngày nhập',
												render: (data: ITableBillScale) => (
													<p style={{fontWeight: 500, color: '#3772FF'}}>
														<Moment date={data?.timeEnd} format='DD/MM/YYYY' />
													</p>
												),
											},
											{
												title: 'Mã lô/Số phiếu',
												render: (data: ITableBillScale) => (
													<p style={{fontWeight: 500, color: '#3772FF'}}>{data?.code || '---'}</p>
												),
											},
											{
												title: 'Loại hàng',
												render: (data: ITableBillScale) => <>{data?.productTypeUu?.name || '---'}</>,
											},
											{
												title: 'Quốc gia',
												render: (data: ITableBillScale) => <>{data?.qualityUu?.name || '---'}</>,
											},
											{
												title: 'Biển số xe',
												render: (data: ITableBillScale) => (
													<>
														<p style={{fontWeight: 600, color: '#3772FF'}}>
															{data?.isBatch == TYPE_BATCH.CAN_LO
																? data?.batchsUu?.shipUu?.licensePalate
																: data?.isBatch == TYPE_BATCH.CAN_LE
																? data?.weightSessionUu?.truckUu?.licensePalate
																: data?.isBatch == TYPE_BATCH.KHONG_CAN
																? '---'
																: '---'}
														</p>
													</>
												),
											},
											{
												title: 'KL tươi (Tấn)',
												render: (data: ITableBillScale) => <>{convertWeight(data?.weightTotal) || 0}</>,
											},
											{
												title: 'Độ khô (%)',
												render: (data: ITableBillScale) => <>{data?.drynessAvg?.toFixed(2) || 0}</>,
											},
											{
												title: 'KL khô (Tấn)',
												render: (data: ITableBillScale) => <>{convertWeight(data?.weightBdmt) || 0}</>,
											},
										]}
									/>
								</DataWrapper>
							</div>
						</div>
					</>
				)}
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
