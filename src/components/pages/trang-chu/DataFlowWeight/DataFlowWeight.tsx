import React from 'react';

import {PropsDataFlowWeight} from './interfaces';
import styles from './DataFlowWeight.module.scss';
import clsx from 'clsx';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import dashbroadServices from '~/services/dashbroadServices';
import {QUERY_KEY} from '~/constants/config/enum';

function DataFlowWeight({}: PropsDataFlowWeight) {
	const {data: countBillWeight} = useQuery([QUERY_KEY.thong_ke_luong_du_lieu_duyet_khoi_luong], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: dashbroadServices.countBillWeight({}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Luồng dữ liệu duyệt khối lượng:</h3>
			</div>
			<div className={styles.main}>
				<div className={styles.circle}>QUẢN LÝ CÂN</div>
				<div className={styles.arrow}>
					<div className={styles.arrow_right}></div>
					<div style={{background: '#2cae39'}} className={styles.box}>
						<p>{countBillWeight?.billNeedQlkCheck || 0} phiếu đợi duyệt</p>
						<p>{countBillWeight?.billOverQlkCheck || 0} phiếu quá hạn</p>
					</div>
				</div>
				<div className={styles.circle}>KẾ TOÁN KHO</div>
				<div className={clsx(styles.arrow, styles.arrow_two)}>
					<div className={styles.arrow_right}></div>
					<div className={styles.box}>
						<p>{countBillWeight?.billNeedKtkCheck || 0} phiếu đợi duyệt</p>
						<p>{countBillWeight?.billOverKtkCheck || 0} phiếu quá hạn</p>
					</div>
				</div>
				<div className={styles.circle}>KẾ TOÁN CÔNG TY</div>
			</div>
		</div>
	);
}

export default DataFlowWeight;
