import React, {useState} from 'react';

import {PropsDataFlowWeight} from './interfaces';
import styles from './DataFlowWeight.module.scss';
import SelectFilterDate from '../SelectFilterDate';
import {TYPE_DATE} from '~/constants/config/enum';
import clsx from 'clsx';

function DataFlowWeight({}: PropsDataFlowWeight) {
	const [typeDate, setTypeDate] = useState<number | null>(TYPE_DATE.LAST_7_DAYS);
	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>(null);

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Luồng dữ liệu duyệt khối lượng:</h3>
				<div className={styles.filter}>
					<SelectFilterDate isOptionDateAll={true} date={date} setDate={setDate} typeDate={typeDate} setTypeDate={setTypeDate} />
				</div>
			</div>
			<div className={styles.main}>
				<div className={styles.circle}>QUẢN LÝ CÂN</div>
				<div className={styles.arrow}>
					<div className={styles.arrow_right}></div>
				</div>
				<div className={styles.circle}>KẾ TOÁN KHO</div>
				<div className={clsx(styles.arrow, styles.arrow_two)}>
					<div className={styles.arrow_right}></div>
					<div className={styles.box}>24 phiếu đợi duyệt</div>
				</div>
				<div className={styles.circle}>KẾ TOÁN CÔNG TY</div>
			</div>
		</div>
	);
}

export default DataFlowWeight;
