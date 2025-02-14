import React, {useEffect, useState} from 'react';

import {IWeightSession, PropsMainSpecification} from './interfaces';
import styles from './MainSpecification.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_WEIGHT_SESSION,
	TYPE_ACTION_AUDIT,
	TYPE_BATCH,
	TYPE_CUSTOMER,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {useRouter} from 'next/router';
import weightSessionServices from '~/services/weightSessionServices';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import Button from '~/components/common/Button';
import {AiOutlineFileAdd} from 'react-icons/ai';
import Popup from '~/components/common/Popup';
import FormUpdateSpecWS from '../FormUpdateSpecWS';
import {toastWarn} from '~/common/funcs/toast';
import Link from 'next/link';
import {convertWeight} from '~/common/funcs/optionConvert';
import Moment from 'react-moment';
import scalesStationServices from '~/services/scalesStationServices';
import storageServices from '~/services/storageServices';
import PositionContainer from '~/components/common/PositionContainer';
import FormUpdateWeigh from '../FormUpdateWeigh';
import clsx from 'clsx';

function MainSpecification({}: PropsMainSpecification) {
	const router = useRouter();

	const {
		_page,
		_pageSize,
		_keyword,
		_isBatch,
		_customerUuid,
		_storageUuid,
		_scalesStationUuid,
		_productTypeUuid,
		_specUuid,
		_dateFrom,
		_dateTo,
		_isShift,
		_status,
		_isHaveSpec,
	} = router.query;

	const [weightSessionSubmits, setWeightSessionSubmits] = useState<any[]>([]);
	const [dataWeight, setDataWeight] = useState<any[]>([]);
	const [weightSessions, setWeightSessions] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);

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

	useEffect(() => {
		router.replace(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					_isHaveSpec: TYPE_ACTION_AUDIT.NO_DRY,
				},
			},
			undefined,
			{shallow: true, scroll: false}
		);
	}, []);

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

	useQuery(
		[
			QUERY_KEY.table_nhap_lieu_quy_cach,
			_page,
			_pageSize,
			_keyword,
			_isBatch,
			_customerUuid,
			_productTypeUuid,
			_specUuid,
			_dateFrom,
			_dateTo,
			_isShift,
			_storageUuid,
			_scalesStationUuid,
			_status,
			_isHaveSpec,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					setLoading: setLoading,
					http: weightSessionServices.listWeightsession({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.IS_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						billUuid: '',
						codeEnd: null,
						codeStart: null,
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
						specUuid: !!_specUuid ? (_specUuid as string) : null,
						status: [
							STATUS_WEIGHT_SESSION.CAN_LAN_2,
							STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE,
							STATUS_WEIGHT_SESSION.UPDATE_DRY_DONE,
							STATUS_WEIGHT_SESSION.KCS_XONG,
							STATUS_WEIGHT_SESSION.CHOT_KE_TOAN,
						],
						isHaveSpec: !!_isHaveSpec ? Number(_isHaveSpec) : null,
						truckUuid: [],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: _customerUuid ? (_customerUuid as string) : '',
						productTypeUuid: _productTypeUuid ? (_productTypeUuid as string) : '',
						shift: !!_isShift ? Number(_isBatch) : null,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						storageUuid: (_storageUuid as string) || '',
						isHaveDryness: null,
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
		}
	);

	const handleUpdateAll = () => {
		const arr = weightSessions?.filter((v) => v.isChecked !== false);

		if (!arr?.every((obj: any) => obj?.specificationsUu?.uuid === arr[0]?.specificationsUu?.uuid)) {
			return toastWarn({msg: 'Chỉ chọn được các lô có cùng quy cách!'});
		} else {
			setWeightSessionSubmits(arr);
		}
	};

	// tính tổng lượng hàng đã chọn
	const getTotal = weightSessions
		?.filter((v) => v.isChecked !== false)
		.reduce(
			(acc, item) => {
				return {
					...acc,
					data: {
						amountMt: acc.data.amountMt + item.weightReal,
					},
				};
			},
			{data: {amountMt: 0}}
		);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					{weightSessions?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								green
								p_4_12
								icon={<AiOutlineFileAdd size={20} />}
								onClick={handleUpdateAll}
							>
								Cập nhật quy cách
							</Button>
						</div>
					)}
					{weightSessions?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								p_4_12
								orange
								icon={<AiOutlineFileAdd size={20} />}
								onClick={() => {
									setDataWeight(weightSessions?.filter((v) => v.isChecked !== false));
								}}
							>
								Cập nhật theo cân mẫu
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
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_isHaveSpec'
							listFilter={[
								{
									id: TYPE_ACTION_AUDIT.NO_DRY,
									name: 'Chưa cập nhật',
								},
								{
									id: TYPE_ACTION_AUDIT.HAVE_DRY,
									name: 'Đã cập nhật',
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
					<FilterCustom
						isSearch
						name='Quy cách'
						query='_specUuid'
						listFilter={listSpecification?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>
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
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div>
				</div>
			</div>
			<div className={clsx('mt')}>
				<div className={styles.parameter}>
					<div>
						TỔNG LƯỢNG KL HÀNG ĐÃ CHỌN:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertWeight(getTotal?.data?.amountMt) || 0} </span>(Tấn)
					</div>
				</div>
			</div>

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
								checkBox: true,
								render: (data: IWeightSession, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: IWeightSession) => (
									<>
										{data?.billUu?.isBatch == TYPE_BATCH.KHONG_CAN ? (
											<Link href={`/nhap-xuat-ngoai/${data?.billUu?.uuid}`} className={styles.link}>
												{data?.billUu?.code}
											</Link>
										) : (
											<Link href={`/phieu-can/${data?.billUu?.uuid}`} className={styles.link}>
												{data?.billUu?.code}
											</Link>
										)}
										<p style={{fontWeight: 500, color: '#3772FF'}}>
											<Moment date={data?.weight2?.timeScales} format='HH:mm - DD/MM/YYYY' />
										</p>
									</>
								),
							},
							{
								title: 'Số phiếu',
								render: (data: IWeightSession) => <>{data?.code}</>,
							},
							{
								title: 'Số xe',
								render: (data: IWeightSession) => <>{data?.truckUu?.licensePalate || '---'}</>,
							},
							{
								title: 'KL hàng (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weightReal)}</>,
							},
							{
								title: 'Khách hàng',
								render: (data: IWeightSession) => (
									<>
										{data?.fromUu?.name || '---'}{' '}
										<p style={{fontWeight: 500, color: '#3772FF'}}>{data?.batchUu?.name || '---'}</p>
									</>
								),
							},
							{
								title: 'KL quy khô (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weightBdmt)}</>,
							},

							{
								title: 'Kho hàng',
								render: (data: IWeightSession) => <>{data?.toUu?.name || '---'}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: IWeightSession) => <>{data?.producTypeUu?.name || '---'}</>,
							},

							{
								title: 'Quy cách',
								render: (data: IWeightSession) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							// {
							// 	title: 'Tiêu chí',
							// 	render: (data: IWeightSession) => (
							// 		<div className={styles.ruler}>
							// 			<TippyHeadless
							// 				maxWidth={'100%'}
							// 				interactive
							// 				onClickOutside={() => setUuidWeightSession('')}
							// 				visible={uuidWeightSession == data?.uuid}
							// 				placement='bottom'
							// 				render={(attrs) => (
							// 					<div className={styles.main_ruler}>
							// 						<div className={styles.content}>
							// 							{data?.specStyleUu?.ruleItems?.map((v, i) => (
							// 								<div key={i} className={styles.item}>
							// 									<div className={styles.dot}></div>
							// 									<p>{v?.titleType}</p>
							// 								</div>
							// 							))}
							// 						</div>
							// 					</div>
							// 				)}
							// 			>
							// 				<Tippy content='Xem tiêu chí'>
							// 					<p
							// 						onClick={() => {
							// 							if (data?.specStyleUu?.countRuler == 0) {
							// 								return null;
							// 							} else {
							// 								setUuidWeightSession(uuidWeightSession ? '' : data.uuid);
							// 							}
							// 						}}
							// 						className={clsx(styles.value, {[styles.active]: uuidWeightSession == data.uuid})}
							// 					>
							// 						{data?.specStyleUu?.countRuler || 0}
							// 					</p>
							// 				</Tippy>
							// 			</TippyHeadless>
							// 		</div>
							// 	),
							// },
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IWeightSession) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
										<div>
											<Button
												className={styles.btn}
												rounded_2
												maxHeight
												green
												p_4_12
												icon={<AiOutlineFileAdd size={20} />}
												onClick={() => setWeightSessionSubmits([data])}
											>
												CN quy cách
											</Button>
										</div>
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
							_storageUuid,
							_scalesStationUuid,
							_status,
							_isHaveSpec,
						]}
					/>
				)}
			</div>

			<Popup open={weightSessionSubmits.length > 0} onClose={() => setWeightSessionSubmits([])}>
				<FormUpdateSpecWS dataUpdateSpecWS={weightSessionSubmits} onClose={() => setWeightSessionSubmits([])} />
			</Popup>

			<PositionContainer
				open={dataWeight.length > 0}
				onClose={() => {
					setDataWeight([]);
					const {_keywordForm, _pageSample, _pageSampleSize, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormUpdateWeigh
					dataUpdateWeigh={dataWeight}
					onClose={() => {
						setDataWeight([]);
						const {_keywordForm, _pageSample, _pageSampleSize, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				/>
			</PositionContainer>
		</div>
	);
}

export default MainSpecification;
