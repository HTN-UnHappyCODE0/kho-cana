import React, {useRef, useState} from 'react';

import {ISampleSession, PropsMainPageSampleSpec} from './interfaces';
import styles from './MainPageSampleSpec.module.scss';
import Search from '~/components/common/Search';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import Table from '~/components/common/Table';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_SAMPLE_SESSION,
	TYPE_DATE,
	TYPE_SAMPLE_SESSION,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import FilterCustom from '~/components/common/FilterCustom';
import Noti from '~/components/common/DataWrapper/components/Noti';
import sampleSessionServices from '~/services/sampleSessionServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import Moment from 'react-moment';
import customerServices from '~/services/customerServices';
import StateActive from '~/components/common/StateActive';
import wareServices from '~/services/wareServices';
import shipServices from '~/services/shipServices';
import {Eye, TickCircle} from 'iconsax-react';
import IconCustom from '~/components/common/IconCustom';
import PositionContainer from '~/components/common/PositionContainer';
import FormDetailSampleSpec from '../FormDetailSampleSpec';
import Button from '~/components/common/Button';
import {useReactToPrint} from 'react-to-print';
import TemplateSampleSpec from '~/components/pdf-template/TemplateSampleSpec';
import Dialog from '~/components/common/Dialog';

function MainPageSampleSpec({}: PropsMainPageSampleSpec) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const contentToPrint = useRef<HTMLDivElement>(null);

	const {_page, _pageSize, _keyword, _status, _specUuid, _shipUuid, _dateFrom, _dateTo, _customerUuid} = router.query;
	const [uuidDetail, setUuidDetail] = useState<string>('');

	const [uuidConfirm, setUuidConfirm] = useState<string[]>([]);

	const [getListSampleSession, setListSampleWession] = useState<any[]>([]);
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
					typeCus: null,
					provinceId: '',
					specUuid: '',
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

	const listSampleSession = useQuery(
		[QUERY_KEY.table_ds_can_mau, _page, _customerUuid, _pageSize, _shipUuid, _keyword, _dateTo, _dateFrom, _specUuid, _status],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: sampleSessionServices.getListSampleSession({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						customerUuid: (_customerUuid as string) || '',
						fromDate: _dateFrom ? (_dateFrom as string) : null,
						specUuid: !!_specUuid ? (_specUuid as string) : '',
						status: !!_status ? Number(_status) : null,
						toDate: _dateTo ? (_dateTo as string) : null,
						type: TYPE_SAMPLE_SESSION.QUY_CACH,
						shipUuid: !!_shipUuid ? (_shipUuid as string) : '',
					}),
				}),
			onSuccess(data) {
				if (data) {
					setListSampleWession(
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

	const funcConfirm = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				http: sampleSessionServices.confirmSample({
					uuid: uuidConfirm,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidConfirm([]);
				queryClient.invalidateQueries([QUERY_KEY.table_ds_can_mau]);
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const handlePrint = useReactToPrint({
		content: () => contentToPrint.current,
		documentTitle: 'Can_mau_test',
		onBeforePrint: () => console.log('before printing...'),
		onAfterPrint: () => console.log('after printing...'),
		removeAfterPrint: true,
	});

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					{getListSampleSession?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								primary
								p_4_12
								onClick={() => {
									setUuidConfirm(getListSampleSession?.filter((v) => v.isChecked !== false)?.map((x: any) => x.uuid));
								}}
							>
								Xác nhận
							</Button>
						</div>
					)}
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã cân mẫu' />
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
						name='Mã tàu'
						query='_shipUuid'
						listFilter={listShip?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.licensePalate,
						}))}
					/>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_status'
							listFilter={[
								{
									id: STATUS_SAMPLE_SESSION.DELETE,
									name: 'Đã xóa',
								},
								{
									id: STATUS_SAMPLE_SESSION.INIT,
									name: 'Khởi tạo',
								},
								{
									id: STATUS_SAMPLE_SESSION.USING,
									name: 'Đang cân',
								},
								{
									id: STATUS_SAMPLE_SESSION.FINISH,
									name: 'Hoàn thành',
								},
								{
									id: STATUS_SAMPLE_SESSION.ACCEPT,
									name: 'Đã xác nhận',
								},
							]}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Quy cách'
							query='_specUuid'
							listFilter={listSpecification?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.LAST_7_DAYS} />
					</div>
				</div>

				{/* <div className={styles.btn}>
					<Button rounded_2 w_fit p_8_16 green bold onClick={handlePrint}>
						In + xuất pdf
					</Button>
				</div> */}
			</div>

			{/* Template */}
			<div style={{display: 'none'}}>
				<TemplateSampleSpec ref={contentToPrint} />
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={getListSampleSession || []}
					loading={listSampleSession?.isFetching}
					noti={<Noti des='Hiện tại chưa có cân mẫu!' disableButton />}
				>
					<Table
						data={getListSampleSession || []}
						onSetData={setListSampleWession}
						column={[
							{
								title: 'STT',
								checkBox: true,
								render: (data: ISampleSession, index: number) => <>{index + 1} </>,
							},
							{
								title: 'Mẫu làm việc',
								render: (data: ISampleSession) => (
									<>
										<p>{data?.code || '---'}</p>
										<p style={{fontWeight: 600, color: '#2D74FF'}}>{data?.specUu?.name || '---'}</p>
									</>
								),
							},

							{
								title: 'Hình thức',
								render: (data: ISampleSession) => (
									<>
										<p>{data?.code?.[3] === 'O' ? 'Cân lô' : data?.code?.[3] === 'E' ? 'Cân lẻ' : ''}</p>
										<p style={{fontWeight: 600}}>{data?.billUu?.code || '---'}</p>
									</>
								),
							},
							{
								title: 'Đến ngày',
								render: (data: ISampleSession) => (
									<>{data?.toDate ? <Moment date={data?.toDate} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: 'Ngày phân tích',
								render: (data: ISampleSession) => (
									<>{data?.analysisDate ? <Moment date={data?.analysisDate} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: ISampleSession) => (
									<StateActive
										stateActive={data?.status}
										listState={[
											{
												state: STATUS_SAMPLE_SESSION.USING,
												text: 'Đang cân',
												textColor: '#9757D7',
												backgroundColor: 'rgba(151, 87, 215, 0.10)',
											},
											{
												state: STATUS_SAMPLE_SESSION.DELETE,
												text: 'Đã xóa',
												textColor: '#F95B5B',
												backgroundColor: 'rgba(249, 91, 91, 0.10)',
											},
											{
												state: STATUS_SAMPLE_SESSION.INIT,
												text: 'Khởi tạo',
												textColor: '#2D74FF',
												backgroundColor: 'rgba(45, 116, 255, 0.10)',
											},
											{
												state: STATUS_SAMPLE_SESSION.ACCEPT,
												text: 'Đã xác nhận',
												textColor: '#41CD4F',
												backgroundColor: 'rgba(65, 205, 79, 0.1)',
											},
											{
												state: STATUS_SAMPLE_SESSION.FINISH,
												text: 'Hoàn thành',
												textColor: '#0EA5E9',
												backgroundColor: 'rgba(14, 165, 233, 0.1)',
											},
										]}
									/>
								),
							},
							{
								title: 'Khách hàng',
								render: (data: ISampleSession) => (
									<>
										<p>{data?.customerUu?.name || '---'}</p>
										<p style={{fontWeight: 600}}>{data?.shipUu?.licensePalate || '---'}</p>
									</>
								),
							},
							{
								title: 'Tủ sấy',
								render: (data: ISampleSession) => (
									<>
										<p>{data?.cabinet || '---'}</p>
									</>
								),
							},
							{
								title: 'Số khay',
								render: (data: ISampleSession) => (
									<>
										<p>{data?.trayNumber || '---'}</p>
									</>
								),
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: ISampleSession) => (
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
										{data?.status == STATUS_SAMPLE_SESSION.FINISH ? (
											<IconCustom
												edit
												icon={<TickCircle size={22} fontWeight={600} />}
												tooltip='Xác nhận'
												color='#2CAE39'
												onClick={() => setUuidConfirm([data?.uuid])}
											/>
										) : null}
										<div>
											<IconCustom
												edit
												icon={<Eye size={22} fontWeight={600} />}
												tooltip='Chi tiết'
												color='#777E90'
												onClick={() => setUuidDetail(data?.uuid)}
											/>
										</div>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				{!listSampleSession.isFetching && (
					<Pagination
						currentPage={Number(_page) || 1}
						total={total}
						pageSize={Number(_pageSize) || 200}
						dependencies={[_pageSize, _keyword, _status, _specUuid, _shipUuid, _customerUuid, _dateTo, _dateFrom]}
					/>
				)}
			</div>

			<PositionContainer
				open={!!uuidDetail}
				onClose={() => {
					setUuidDetail('');
				}}
			>
				<FormDetailSampleSpec
					dataUuidDetail={uuidDetail}
					onClose={() => {
						setUuidDetail('');
					}}
				/>
			</PositionContainer>

			<Dialog
				danger
				open={uuidConfirm.length > 0}
				title='Xác nhận'
				note='Bạn có muốn thực hiện thao tác xác nhận này không?'
				onClose={() => setUuidConfirm([])}
				onSubmit={funcConfirm.mutate}
			/>
		</div>
	);
}

export default MainPageSampleSpec;
