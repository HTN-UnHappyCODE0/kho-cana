import React, {useEffect, useState} from 'react';

import {ISampleData, PropsFormUpdateWeigh} from './interfaces';
import styles from './FormUpdateWeigh.module.scss';
import Button from '~/components/common/Button';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
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
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import GridColumn from '~/components/layouts/GridColumn';
import sampleSessionServices from '~/services/sampleSessionServices';
import wareServices from '~/services/wareServices';
import shipServices from '~/services/shipServices';
import Select, {Option} from '~/components/common/Select';
import clsx from 'clsx';
import {convertWeight} from '~/common/funcs/optionConvert';
import weightSessionServices from '~/services/weightSessionServices';
import {toastWarn} from '~/common/funcs/toast';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';

function FormUpdateWeigh({onClose, dataUpdateWeigh}: PropsFormUpdateWeigh) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const {
		_keywordForm,
		_customerWeighUuidSample,
		_dateFromWeigh,
		_dateToWeigh,
		_time,
		_pageSample,
		_type,
		_pageSampleSize,
		_shipUuidSample,
		_specUuidSample,
		_statusSample,
	} = router.query;

	const [dataCheckWeigh, setDataCheckWeigh] = useState<string | null>();
	const [uuidSampleSession, setUuidSampleSession] = useState<string | null>();
	const [statusSampleData, setStatusSampleData] = useState<any>('1');
	const [dataRules, setDataRules] = useState<
		{
			uuid: string;
			amountSample: number;
		}[]
	>([]);
	const [totalSample, setTotalSample] = useState<number>(0);

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

	const listSampleData = useQuery([QUERY_KEY.table_du_lieu_mau, uuidSampleSession, statusSampleData], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: sampleSessionServices.getListSampleData({
					sampleSessionUuid: uuidSampleSession as string,
					status: Number(statusSampleData),
				}),
			}),
		select(data) {
			return data;
		},
		onSuccess(data) {
			setDataCheckWeigh(null);
		},
		enabled: !!uuidSampleSession && !!statusSampleData,
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
		[
			QUERY_KEY.table_ds_can_mau,
			_pageSample,
			_type,
			_pageSampleSize,
			_shipUuidSample,
			_keywordForm,
			_customerWeighUuidSample,
			_dateFromWeigh,
			_dateToWeigh,
			_time,
			_specUuidSample,
			_statusSample,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: sampleSessionServices.getListSampleSession({
						page: Number(_pageSample) || 1,
						pageSize: Number(_pageSampleSize) || 200,
						keyword: (_keywordForm as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						customerUuid: (_customerWeighUuidSample as string) || '',
						fromDate: _dateFromWeigh ? (_dateFromWeigh as string) : null,
						specUuid: !!_specUuidSample ? (_specUuidSample as string) : '',
						status: !!_statusSample ? Number(_statusSample) : null,
						toDate: _dateToWeigh ? (_dateToWeigh as string) : null,
						type: !!_type ? Number(_type) : null,
						shipUuid: !!_shipUuidSample ? (_shipUuidSample as string) : '',
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	const funcUpdateSpecWeightSession = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật quy cách cân mẫu thành công!',
				http: weightSessionServices.updateSpecWeightSession({
					wsUuids: dataUpdateWeigh?.map((v: any) => v?.uuid),
					lstValueSpec: dataRules?.map((v) => ({
						uuid: v?.uuid,
						amountSample: Number(v?.amountSample),
					})),
					totalSample: totalSample,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_quy_cach]);
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_do_kho]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	useEffect(() => {
		setUuidSampleSession(null);
	}, [
		_customerWeighUuidSample,
		_shipUuidSample,
		_specUuidSample,
		_statusSample,
		_type,
		_dateFromWeigh,
		_dateToWeigh,
		_time,
		_keywordForm,
	]);

	const handleSubmit = async () => {
		if (!dataCheckWeigh) {
			return toastWarn({msg: 'Vui lòng chọn cân mẫu!'});
		}
		funcUpdateSpecWeightSession.mutate();
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h4 className={styles.title}>Cập nhật quy cách theo cân mẫu</h4>
				<div className={styles.btn}>
					<Button rounded_8 w_fit p_8_16 light_outline bold onClick={onClose}>
						Hủy bỏ
					</Button>

					<Button rounded_8 w_fit p_8_16 bold onClick={handleSubmit}>
						Xác nhận
					</Button>
				</div>
			</div>
			<div className={styles.line}></div>
			<div className={styles.form}>
				<div className={styles.header_form}>
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search keyName='_keywordForm' placeholder='Tìm kiếm theo phiên làm việc' />
						</div>

						<FilterCustom
							isSearch
							name='Khách hàng'
							query='_customerWeighUuidSample'
							listFilter={listCustomer?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>

						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Loại'
								query='_type'
								listFilter={[
									{
										id: TYPE_SAMPLE_SESSION.QUY_CACH,
										name: 'Quy cách',
									},
									{
										id: TYPE_SAMPLE_SESSION.DO_KHO,
										name: 'Độ khô',
									},
								]}
							/>
						</div>

						<FilterCustom
							isSearch
							name='Mã tàu'
							query='_shipUuidSample'
							listFilter={listShip?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.licensePalate,
							}))}
						/>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Trạng thái'
								query='_statusSample'
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
										name: 'Xác nhận',
									},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Quy cách'
								query='_specUuidSample'
								listFilter={listSpecification?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
							/>
						</div>

						<div className={styles.filter}>
							<DateRangerCustom
								titleTime='Thời gian'
								typeDateDefault={TYPE_DATE.TODAY}
								keyDateForm='_dateFromWeigh'
								keyDateTo='_dateToWeigh'
								keyTypeDate='_time'
							/>
						</div>
					</div>
				</div>
				<div className={clsx('mt', styles.filter_option)}>
					<Select
						isSearch
						name='uuidSampleSession'
						placeholder='Chọn cân mẫu'
						value={uuidSampleSession}
						label={<span>Cân mẫu</span>}
					>
						{listSampleSession?.data?.items?.map((v: any) => (
							<Option key={v?.uuid} value={v?.uuid} title={v?.code} onClick={() => setUuidSampleSession(v?.uuid)} />
						))}
					</Select>
					<div>
						<Select
							isSearch
							name='statusSampleData'
							placeholder='Chọn trạng thái cân'
							value={statusSampleData}
							label={<span>Trạng thái</span>}
						>
							{[
								{
									id: '0',
									name: 'Đã hủy',
								},
								{
									id: '1',
									name: 'Đang cân',
								},
							].map((v) => (
								<Option key={v?.id} value={v?.id} title={v?.name} onClick={() => setStatusSampleData(v?.id)} />
							))}
						</Select>
					</div>
				</div>
				<DataWrapper
					data={listSampleData?.data?.items || []}
					loading={listSampleData.isFetching}
					noti={<Noti des='Hiện tại chưa có dữ liệu nào!' disableButton />}
				>
					<div className={styles.table_option}>
						{listSampleData?.data?.items?.map((v: ISampleData) => (
							<label key={v?.uuid} className={styles.option}>
								<input
									id={v?.uuid}
									className={styles.input_radio}
									type='radio'
									name='check_weigh'
									value={v?.uuid}
									onChange={() => (
										setDataCheckWeigh(v?.uuid),
										setDataRules(
											v?.sampleCriterial?.map((t: any) => ({
												uuid: t?.uuid,
												amountSample: t?.weight,
											}))
										),
										setTotalSample(v?.totalWeight)
									)}
								/>
								<label htmlFor={v?.uuid} className={styles.infor_check}>
									<GridColumn col_2>
										<div className={styles.item}>
											<p>Mẫu làm việc:</p>
											<p style={{color: '#2D74FF'}}>{v?.sampleSessionUu?.code}</p>
										</div>

										<div className={styles.item}>
											<p>Khách hàng:</p>
											<p>{v?.customerUu?.name || '---'}</p>
										</div>
										<div className={styles.item}>
											<p>Ghi chú:</p>
											<p>{v?.description || '---'}</p>
										</div>
									</GridColumn>
									<div className={styles.line_stroke}></div>
									<GridColumn col_2>
										<div className={styles.item}>
											<p>STT:</p>
											<p style={{color: '#2D74FF'}}>{v?.orderNumber}</p>
										</div>
										<div className={styles.item}>
											<p>Tổng khối lượng:</p>
											{v?.totalWeight ? (
												<>
													<span>{convertWeight(v?.totalWeight)}</span>
													<span style={{color: 'red'}}>(100%)</span>
												</>
											) : (
												'0'
											)}
										</div>
										{v?.sampleCriterial?.map((x, i) => (
											<div key={x?.uuid} className={styles.item}>
												<p>{x?.title || '---'}:</p>
												{x?.weight ? (
													<>
														<span>{convertWeight(x?.weight)}</span>
														<span style={{color: 'red'}}>({x?.percentage}%)</span>
													</>
												) : (
													'0'
												)}
											</div>
										))}
									</GridColumn>
								</label>
							</label>
						))}
					</div>
				</DataWrapper>
			</div>
		</div>
	);
}

export default FormUpdateWeigh;
