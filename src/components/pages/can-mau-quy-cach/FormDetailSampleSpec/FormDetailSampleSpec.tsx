import React, {useEffect, useState} from 'react';

import {PropsFormDetailSampleSpec} from './interfaces';
import styles from './FormDetailSampleSpec.module.scss';
import {QUERY_KEY} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import GridColumn from '~/components/layouts/GridColumn';
import sampleSessionServices from '~/services/sampleSessionServices';
import Select, {Option} from '~/components/common/Select';
import clsx from 'clsx';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {ISampleData} from '../../nhap-lieu/quy-cach/FormUpdateWeigh/interfaces';
import {IoClose} from 'react-icons/io5';
import {convertCoin} from '~/common/funcs/convertCoin';

function FormDetailSampleSpec({onClose, dataUuidDetail}: PropsFormDetailSampleSpec) {
	const [statusSampleData, setStatusSampleData] = useState<any>('1');
	const [sampleData, setSampleData] = useState<any[]>([]);

	const listSampleData = useQuery([QUERY_KEY.table_du_lieu_mau, dataUuidDetail, statusSampleData], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: sampleSessionServices.getListSampleData({
					sampleSessionUuid: dataUuidDetail,
					status: Number(statusSampleData),
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!dataUuidDetail && !!statusSampleData,
	});

	useEffect(() => {
		if (listSampleData?.data?.items) {
			const root = listSampleData?.data?.items?.filter((v: ISampleData) => v?.isRoot == true);
			const notRoot = listSampleData?.data?.items?.filter((v: ISampleData) => v?.isRoot != true);
			const data = [...root, ...notRoot];
			setSampleData(data);
		}
	}, [listSampleData]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h4 className={styles.title}>Quy cách theo cân mẫu</h4>
				<div className={styles.btn}>
					<div className={styles.close} onClick={onClose}>
						<IoClose />
					</div>
				</div>
			</div>
			<div className={styles.line}></div>
			<div className={styles.form}>
				<div className={clsx('mt', styles.filter_option)}>
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
					data={sampleData || []}
					loading={listSampleData.isFetching}
					noti={<Noti des='Hiện tại chưa có dữ liệu nào!' disableButton />}
				>
					<div className={styles.table_option}>
						{sampleData?.map((v: ISampleData) => (
							<label key={v?.uuid} className={styles.option}>
								<label
									htmlFor={v?.uuid}
									className={clsx(styles.infor_check, {
										[styles.root_false]: v?.isRoot != true,
										[styles.root_true]: v?.isRoot == true,
									})}
								>
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
											<span>{convertCoin(v?.sampleCriterial?.reduce((total, x) => total + x.weight, 0))} gr</span>
											<span style={{color: 'red'}}>(100%)</span>
										</div>
										{v?.sampleCriterial?.map((x, i) => (
											<div key={x?.uuid} className={styles.item}>
												<span>{x?.criteriaName || '---'} (gr):</span>

												<>
													<span>{convertCoin(x?.weight)}</span>
													<span style={{color: 'red'}}>({x?.percentage}%)</span>
												</>
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

export default FormDetailSampleSpec;
