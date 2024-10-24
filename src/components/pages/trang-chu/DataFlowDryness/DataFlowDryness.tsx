import React from 'react';

import {PropsDataFlowDryness} from './interfaces';
import styles from './DataFlowDryness.module.scss';
import clsx from 'clsx';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import dashbroadServices from '~/services/dashbroadServices';

function DataFlowDryness({}: PropsDataFlowDryness) {
	const {data: countBillKcs} = useQuery([QUERY_KEY.thong_ke_luong_du_lieu_duyet_do_kho], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: dashbroadServices.countBillKcs({}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Luồng dữ liệu duyệt độ khô:</h3>
			</div>
			<div className={styles.main}>
				<div className={styles.circle}>PHIẾU ĐÃ CÂN</div>
				<div className={styles.arrow}>
					<div className={clsx(styles.arrow, styles.arrow_two)}>
						<div className={styles.arrow_right}></div>
						<div className={styles.box}>
							<p>{countBillKcs?.billScaleDone || 0} phiếu</p>
						</div>
					</div>
				</div>
				<div className={styles.circle}>PHIẾU ĐÃ KCS</div>
				<div className={clsx(styles.arrow)}>
					<div className={styles.arrow_right}></div>
					<div className={styles.box}>
						<p>{countBillKcs?.billKcsDone || 0} phiếu</p>
					</div>
				</div>
				<div className={styles.circle}>PHIẾU ĐÃ KẾT THÚC</div>
			</div>
		</div>
	);
}

export default DataFlowDryness;
