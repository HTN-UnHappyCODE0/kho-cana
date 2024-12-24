import React, {useEffect, useState} from 'react';

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
import ItemTablePC from '../ItemTablePC';
function FormDetailSampleDryness({onClose, dataUuidDetail}: PropsFormDetailSampleDryness) {
	const [statusSampleData, setStatusSampleData] = useState<any>('1');
	const [openArrow, setOpenArrow] = useState<boolean>(true);

	const [isPC, setIsPC] = useState<boolean>(window.innerWidth >= 1230);

	// Xử lý khi thay đổi kích thước màn hình
	useEffect(() => {
		const handleResize = () => {
			setIsPC(window.innerWidth >= 1230);
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

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
						{isPC ? (
							<div className={clsx('mt', styles.table_dropdow)}>
								<div className={styles.table_head}>
									<div style={{width: '44px', paddingRight: '16px'}}></div>
									<p style={{width: '44px', paddingRight: '16px'}}>STT</p>
									<p style={{width: '120px', paddingRight: '16px'}}>Mã khay</p>
									<p style={{width: '120px', paddingRight: '16px'}}>KL khay</p>
									<p style={{width: '120px', paddingRight: '16px'}}>KL dăm</p>
									<p style={{width: '120px', paddingRight: '16px'}}>
										<span className={styles.unit}>
											Khối lượng khay <br /> dăm 16h
										</span>
									</p>
									<p style={{width: '120px', paddingRight: '16px'}}>
										<span className={styles.unit}>
											Khối lượng khay <br /> dăm 18h
										</span>
									</p>
									<p style={{width: '120px', paddingRight: '16px'}}>
										<span className={styles.unit}>
											Khối lượng khay <br /> dăm 20h
										</span>
									</p>
									<p style={{width: '90px', paddingRight: '16px'}}>Độ khô(%)</p>
									<p style={{width: '180px', paddingRight: '16px'}}>Ghi chú</p>
									<p style={{width: '90px', paddingRight: '16px'}}>Trạng thái</p>
								</div>
								<div className={styles.main_table_dropdow}>
									{listSampleData?.data?.items?.map((v: any, i: number) => (
										<ItemTablePC
											key={v?.uuid}
											order={i + 1}
											listData={v}
											isParent={true}
											uuidParent={v?.uuid}
											header={true}
										/>
									))}
								</div>
							</div>
						) : (
							<div className={styles.table_option}>
								{listSampleData?.data?.items?.map((v: ISampleData, index: number) => (
									<ItemTable key={v?.uuid} order={index + 1} listData={v} isParent={true} uuidParent={v?.uuid} />
								))}
							</div>
						)}
					</DataWrapper>
				</div>
			</div>
		</div>
	);
}

export default FormDetailSampleDryness;
