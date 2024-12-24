import React, {useState} from 'react';

import {PropsFormDetailSampleDryness} from './interfaces';
import styles from './FormDetailSampleDryness.module.scss';
import {QUERY_KEY} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import sampleSessionServices from '~/services/sampleSessionServices';
import Select, {Option} from '~/components/common/Select';
import clsx from 'clsx';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {IoClose} from 'react-icons/io5';
import ItemTable from '../ItemTable';
import {ISampleData} from '../../nhap-lieu/quy-cach/FormUpdateWeigh/interfaces';
import GridColumn from '~/components/layouts/GridColumn';
import {convertCoin} from '~/common/funcs/convertCoin';
import StateActive from '~/components/common/StateActive';
import {IoIosArrowDown} from 'react-icons/io';
import {ArrowRight2} from 'iconsax-react';
function FormDetailSampleDryness({onClose, dataUuidDetail}: PropsFormDetailSampleDryness) {
	const [statusSampleData, setStatusSampleData] = useState<any>('1');
	const [openArrow, setOpenArrow] = useState<boolean>(true);

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

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h4 className={styles.title}>Độ khô theo cân mẫu</h4>
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
									name: 'Sử dụng',
								},
							].map((v) => (
								<Option key={v?.id} value={v?.id} title={v?.name} onClick={() => setStatusSampleData(v?.id)} />
							))}
						</Select>
					</div>
				</div>
				<div className={clsx('mt', styles.table_srcoll)}>
					<DataWrapper
						data={listSampleData?.data?.items || []}
						loading={listSampleData.isFetching}
						noti={<Noti des='Hiện tại chưa có dữ liệu nào!' disableButton />}
					>
						<div className={styles.table_option}>
							{listSampleData?.data?.items?.map((v: ISampleData, index: number) => (
								<ItemTable key={v?.uuid} order={index + 1} listData={v} isParent={true} uuidParent={v?.uuid} />
							))}
						</div>
					</DataWrapper>
				</div>
			</div>
		</div>
	);
}

export default FormDetailSampleDryness;
