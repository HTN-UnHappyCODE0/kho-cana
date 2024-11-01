import React, {useEffect, useRef, useState} from 'react';

import {PropsMainSendAccountant} from './interfaces';
import styles from './MainSendAccountant.module.scss';
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
import {IWeightSession} from '../../nhap-lieu/quy-cach/MainSpecification/interfaces';

function MainSendAccountant({}: PropsMainSendAccountant) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const {_page, _pageSize, _keyword, _isBatch, _isShift, _customerUuid, _status, _productTypeUuid, _specUuid, _dateFrom, _dateTo} =
		router.query;

	const [dataWeightSessionSubmit, setDataWeightSessionSubmit] = useState<any[]>([]);
	const [openSentData, setOpenSentData] = useState<boolean>(false);

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

	useEffect(() => {
		router.push({
			pathname: '/gui-ke-toan',
			query: {
				...router.query,
				_status: STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE,
			},
		});
	}, []);

	const queryWeightsession = useQuery(
		[
			QUERY_KEY.table_nhap_lieu_do_kho,
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
			_status,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: weightSessionServices.listWeightsession({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 50,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						billUuid: '',
						codeEnd: null,
						codeStart: null,
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
						specUuid: !!_specUuid ? (_specUuid as string) : null,
						status: !!_status
							? [Number(_status)]
							: [STATUS_WEIGHT_SESSION.UPDATE_SPEC_DONE, STATUS_WEIGHT_SESSION.UPDATE_DRY_DONE],
						storageUuid: '',
						truckUuid: '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						customerUuid: _customerUuid ? (_customerUuid as string) : '',
						productTypeUuid: _productTypeUuid ? (_productTypeUuid as string) : '',
						shift: !!_isShift ? Number(_isShift) : null,
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
				setOpenSentData(false);
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

	const handleSubmitSentData = async () => {
		if (dataWeightSessionSubmit.some((v) => v.dryness == null)) {
			return toastWarn({msg: 'Nhập độ khô trước khi gửi kể toán!'});
		}

		return funcUpdateKCSWeightSession.mutate();
	};

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
									setOpenSentData(true);
									setDataWeightSessionSubmit(weightSessions?.filter((v) => v.isChecked !== false));
								}}
							>
								Gửi kế toán
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
							]}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
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

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={weightSessions || []}
					loading={queryWeightsession.isFetching}
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
									<Link href={`/phieu-can/${data?.billUu?.uuid}`} className={styles.link}>
										{data?.billUu?.code}
									</Link>
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
								title: 'Độ khô',
								render: (data: IWeightSession, index: number) => <>{data?.dryness || '---'}</>,
							},
							{
								title: 'Khách hàng',
								render: (data: IWeightSession) => <>{data?.fromUu?.name || '---'}</>,
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
								title: 'KL hàng (Tấn)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weightReal)}</>,
							},
							{
								title: 'Quy cách',
								render: (data: IWeightSession) => <p>{data?.specificationsUu?.name || '---'}</p>,
							},

							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IWeightSession) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<div>
											<Button
												className={styles.btn}
												rounded_2
												maxHeight
												primary
												p_4_12
												icon={<AiOutlineFileAdd size={20} />}
												disable={data?.dryness == null}
												onClick={() => {
													setOpenSentData(true);
													setDataWeightSessionSubmit([data]);
												}}
											>
												Gửi kế toán
											</Button>
										</div>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				{!queryWeightsession.isFetching && (
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 50}
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
						]}
					/>
				)}
			</div>

			<Dialog
				open={openSentData}
				onClose={() => {
					setOpenSentData(false);
					setDataWeightSessionSubmit([]);
				}}
				title='Xác nhận số liệu và gửi đi!'
				note={`Đang chọn ${dataWeightSessionSubmit?.length} phiếu đã có độ khô! Bạn có chắc chắn muốn gửi đi ?`}
				onSubmit={handleSubmitSentData}
			/>
		</div>
	);
}

export default MainSendAccountant;
