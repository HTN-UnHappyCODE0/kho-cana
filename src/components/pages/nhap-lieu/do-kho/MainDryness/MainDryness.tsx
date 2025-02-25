import React, {useEffect, useRef, useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';

import {PropsMainDryness} from './interfaces';
import styles from './MainDryness.module.scss';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_WEIGHT_SESSION,
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
import weightSessionServices from '~/services/weightSessionServices';
import {IWeightSession} from '../../quy-cach/MainSpecification/interfaces';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import BoxUpdateSpec from '../BoxUpdateSpec';
import {AiOutlineFileAdd} from 'react-icons/ai';
import Button from '~/components/common/Button';
import {Edit2, TickCircle} from 'iconsax-react';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import {IoMdAdd} from 'react-icons/io';
import Popup from '~/components/common/Popup';
import FormUpdateDryness from '../FormUpdateDryness';
import Link from 'next/link';
import {convertWeight} from '~/common/funcs/optionConvert';
import FormUpdateSpecWS from '../../quy-cach/FormUpdateSpecWS';
import Moment from 'react-moment';
import Dialog from '~/components/common/Dialog';
import storageServices from '~/services/storageServices';
import scalesStationServices from '~/services/scalesStationServices';
import PositionContainer from '~/components/common/PositionContainer';
import FormUpdateWeighDryness from '../FormUpdateWeighDryness';
import FormUpdateWeigh from '../../quy-cach/FormUpdateWeigh';
import SelectFilterOption from '~/components/pages/trang-chu/SelectFilterOption';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import companyServices from '~/services/companyServices';

function MainDryness({}: PropsMainDryness) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const {
		_page,
		_pageSize,
		_keyword,
		_isBatch,
		_isShift,
		_storageUuid,
		_status,
		_productTypeUuid,
		_specUuid,
		_dateFrom,
		_dateTo,
		_scalesStationUuid,
	} = router.query;

	const [openUpdateMultipleDryness, setOpenUpdateMultipleDryness] = useState<boolean>(false);
	const [dataUpdateSpec, setDataUpdateSpec] = useState<IWeightSession | null>(null);
	const [dataWeightSessionSubmit, setDataWeightSessionSubmit] = useState<any[]>([]);
	const [dataWeightSessionSpec, setDataWeightSessionSpec] = useState<any[]>([]);
	const [dataWeight, setDataWeight] = useState<any[]>([]);
	const [status, setStatus] = useState<string>(String(STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE));
	const [isHaveDryness, setIsHaveDryness] = useState<string>('0');
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [listCompanyUuid, setListCompanyUuid] = useState<any[]>([]);

	const [weightSessions, setWeightSessions] = useState<any[]>([]);

	const [openDryness, setOpenDryness] = useState<boolean>(false);
	const [openSpec, setOpenSpec] = useState<boolean>(false);

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

	// useEffect(() => {
	// 	router.replace(
	// 		{
	// 			pathname: router.pathname,
	// 			query: {
	// 				...router.query,
	// 				_status: STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE,
	// 			},
	// 		},
	// 		undefined,
	// 		{shallow: true, scroll: false}
	// 	);
	// }, []);

	const queryWeightsession = useQuery(
		[
			QUERY_KEY.table_nhap_lieu_do_kho,
			_page,
			_pageSize,
			_keyword,
			_isBatch,
			customerUuid,
			_productTypeUuid,
			_specUuid,
			_dateFrom,
			_dateTo,
			_isShift,
			status,
			_storageUuid,
			_scalesStationUuid,
			isHaveDryness,
			listCompanyUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
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
							STATUS_WEIGHT_SESSION.UPDATE_DRY_DONE,
							STATUS_WEIGHT_SESSION.KCS_XONG,
							STATUS_WEIGHT_SESSION.CHOT_KE_TOAN,
						],
						truckUuid: '',
						listTruckUuid: [],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: '',
						listCustomerUuid: customerUuid,
						productTypeUuid: _productTypeUuid ? (_productTypeUuid as string) : '',
						shift: !!_isShift ? Number(_isShift) : null,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						storageUuid: (_storageUuid as string) || '',
						isHaveSpec: null,
						isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
						TypeProduct: TYPE_PRODUCT.CONG_TY,
						listCompanyUuid: listCompanyUuid,
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
				}
			},
			select(data) {
				return data;
			},
		}
	);

	const funcUpdateDrynessWeightSession = useMutation({
		mutationFn: (body: {uuid: string; dryness: number}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật độ khô thành công!',
				http: weightSessionServices.updateDrynessWeightSession({
					wsUuids: [body.uuid],
					dryness: body.dryness,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_do_kho]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const funcMultipleDrynessWeightSession = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác nhận độ khô thành công!',
				http: weightSessionServices.updateMultipleDrynessWeightSession({
					lstInfo: weightSessions
						?.filter((v: IWeightSession) => v?.dryness)
						?.map((x: IWeightSession) => ({
							wsUuids: x?.uuid,
							dryness: Number(x?.dryness),
						})),
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenUpdateMultipleDryness(false);
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_do_kho]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const funcUpdateKCSWeightSession = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Gửi kế toán thành công!',
				http: weightSessionServices.updateKCSWeightSession({
					wsUuids: dataWeightSessionSubmit?.map((v: any) => v?.uuid),
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

	const handleDrynessChange = (uuid: string, value: number) => {
		setWeightSessions((prevSessions) =>
			prevSessions.map((session) => (session.uuid === uuid ? {...session, dryness: value} : session))
		);
	};

	const handleKeyEnter = (uuid: string, value: number, event: any, index: number) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();

			const newIndex = event.key === 'ArrowUp' ? index - 1 : index + 1;

			if (inputRefs.current[newIndex]?.focus) {
				inputRefs.current[newIndex]?.focus();
			}
		}

		if (event.key === 'Enter' || event.keyCode === 13) {
			event.preventDefault();

			const newIndex = index + 1;

			if (inputRefs.current[newIndex]?.focus) {
				inputRefs.current[newIndex]?.focus();
			}

			// if (value < 0 || value > 100) {
			// 	return toastWarn({msg: 'Giá trị độ khô không hợp lệ!'});
			// }

			// return funcUpdateDrynessWeightSession.mutate({
			// 	uuid: uuid,
			// 	dryness: value,
			// });
		}
	};

	const handleUpdateAll = () => {
		const arr = weightSessions?.filter((v) => v.isChecked !== false);

		if (!arr?.every((obj: any) => obj?.specificationsUu?.uuid === arr[0]?.specificationsUu?.uuid)) {
			return toastWarn({msg: 'Chỉ chọn được các lô có cùng quy cách!'});
		} else {
			setDataWeightSessionSpec(arr);
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
						amountMtWeb: acc.data.amountMtWeb + item.weightReal,
						amountBDmtWeb: acc.data.amountBDmtWeb + item.weightBdmt,
					},
				};
			},
			{data: {amountMtWeb: 0, amountBDmtWeb: 0}}
		);

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateKCSWeightSession.isLoading || funcMultipleDrynessWeightSession.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div style={{height: 40}}>
						<Button
							className={styles.btn}
							rounded_2
							maxHeight
							edit
							p_4_12
							icon={<TickCircle size={18} />}
							onClick={() => {
								setOpenUpdateMultipleDryness(true);
							}}
						>
							Xác nhận độ khô
						</Button>
					</div>
					{weightSessions?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								primary
								p_4_12
								icon={<IoMdAdd size={18} />}
								onClick={() => {
									setDataWeightSessionSubmit(weightSessions?.filter((v) => v.isChecked !== false));
								}}
							>
								Thêm nhiều độ khô
							</Button>
						</div>
					)}
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
									setOpenSpec(true);
								}}
							>
								Cập nhật quy cách theo cân mẫu
							</Button>
						</div>
					)}
					{weightSessions?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								neutral
								p_4_12
								icon={<AiOutlineFileAdd size={20} />}
								onClick={() => {
									setDataWeight(weightSessions?.filter((v) => v.isChecked !== false));
									setOpenDryness(true);
								}}
							>
								Cập nhật độ khô theo cân mẫu
							</Button>
						</div>
					)}

					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo số phiếu và mã lô hàng' />
					</div>
					<div className={styles.filter}>
						<SelectFilterMany
							selectedIds={listCompanyUuid}
							setSelectedIds={setListCompanyUuid}
							listData={listCompany?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							name='Kv cảng xuất khẩu'
						/>
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

					<SelectFilterState
						isShowAll={true}
						uuid={isHaveDryness}
						setUuid={setIsHaveDryness}
						listData={[
							{
								uuid: String(0),
								name: 'Chưa có',
							},
							{
								uuid: String(1),
								name: 'Đã có',
							},
						]}
						placeholder='Độ khô'
					/>
					{/* <FilterCustom
							isSearch
							name='Độ khô'
							query='_status'
							listFilter={[
								{
									id: STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE,
									name: 'Chưa có',
								},
								{
									id: STATUS_WEIGHT_SESSION.UPDATE_DRY_DONE,
									name: 'Đã có',
								},
							]}
						/> */}

					<SelectFilterMany
						selectedIds={customerUuid}
						setSelectedIds={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Khách hàng'
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
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertWeight(getTotal?.data?.amountMtWeb) || 0} </span>(Tấn)
					</div>
					<div>
						TỔNG LƯỢNG KL QUY KHÔ ĐÃ CHỌN:
						<span style={{color: '#2D74FF', marginLeft: 4}}>{convertWeight(getTotal?.data?.amountBDmtWeb) || 0}</span> (Tấn)
					</div>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={weightSessions || []}
					loading={queryWeightsession.isLoading}
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
										{data?.fromUu?.name || '---'}
										<p style={{fontWeight: 500, color: '#3772FF'}}>{data?.batchUu?.name || '---'}</p>
									</>
								),
							},
							{
								title: 'Độ khô',
								render: (data: IWeightSession, index: number) => (
									<div className={styles.valueDryness}>
										<input
											ref={(el) => (inputRefs.current[index] = el)}
											tabIndex={index + 1}
											className={styles.input}
											type='number'
											step='0.01'
											value={data?.dryness || ''}
											onChange={(e) => handleDrynessChange(data.uuid, parseFloat(e.target.value))}
											onKeyDown={(e) => handleKeyEnter(data.uuid, Number(data?.dryness), e, index)}
										/>
										<div className={styles.iconEdit}>
											<Edit2 size={16} />
										</div>
									</div>
								),
							},
							{
								title: 'KL quy khô (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weightBdmt) || '---'}</>,
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
								render: (data: IWeightSession) => (
									<TippyHeadless
										zIndex={100}
										maxWidth={'100%'}
										interactive
										visible={dataUpdateSpec?.uuid == data?.uuid}
										placement='bottom-start'
										render={(attrs) => (
											<BoxUpdateSpec dataUpdateSpec={dataUpdateSpec} onClose={() => setDataUpdateSpec(null)} />
										)}
									>
										<Tippy content='CN quy cách'>
											<p
												className={clsx(styles.specification, {
													[styles.active]: dataUpdateSpec?.uuid == data?.uuid,
												})}
												onClick={() => setDataUpdateSpec(data)}
											>
												{data?.specificationsUu?.name || '---'}
											</p>
										</Tippy>
									</TippyHeadless>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={queryWeightsession?.data?.pagination?.totalCount}
					dependencies={[
						_pageSize,
						_keyword,
						_isBatch,
						customerUuid,
						_productTypeUuid,
						_specUuid,
						_dateFrom,
						_dateTo,
						_isShift,
						status,
						_storageUuid,
						_scalesStationUuid,
						listCompanyUuid,
					]}
				/>
			</div>

			<Popup
				open={dataWeightSessionSubmit.length > 0}
				onClose={() => {
					setDataWeightSessionSubmit([]);
				}}
			>
				<FormUpdateDryness
					dataUpdateDryness={dataWeightSessionSubmit}
					onClose={() => {
						setDataWeightSessionSubmit([]);
					}}
				/>
			</Popup>

			<Popup open={dataWeightSessionSpec.length > 0} onClose={() => setDataWeightSessionSpec([])}>
				<FormUpdateSpecWS dataUpdateSpecWS={dataWeightSessionSpec} onClose={() => setDataWeightSessionSpec([])} />
			</Popup>

			<PositionContainer
				open={dataWeight.length > 0 && openDryness}
				onClose={() => {
					setDataWeight([]);
					setOpenDryness(false);
					const {_keywordForm, _pageSample, _pageSampleSize, ...rest} = router.query;

					router.replace({
						pathname: router.pathname,
						query: {
							...rest,
						},
					});
				}}
			>
				<FormUpdateWeighDryness
					dataUpdateWeigh={dataWeight}
					onClose={() => {
						setDataWeight([]);
						setOpenDryness(false);
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

			<PositionContainer
				open={dataWeight.length > 0 && openSpec}
				onClose={() => {
					setDataWeight([]);
					setOpenSpec(false);
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
						setOpenSpec(false);
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

			<Dialog
				danger
				open={openUpdateMultipleDryness}
				onClose={() => setOpenUpdateMultipleDryness(false)}
				title='Xác nhận độ khô'
				note='Bạn có chắc chắn muốn xác nhận hàng loạt độ khộ không?'
				onSubmit={funcMultipleDrynessWeightSession.mutate}
			/>
		</div>
	);
}

export default MainDryness;
