import React, {memo} from 'react';
import {PieChart, Pie, Cell, Tooltip} from 'recharts';

import {PropsChartDashboard} from './interfaces';
import styles from './ChartDashboard.module.scss';
import {convertWeight} from '~/common/funcs/optionConvert';

function ChartDashboard({totalValueChart, dataChart, arrayTypeAction}: PropsChartDashboard) {
	return (
		<div className={styles.main_chart}>
			<PieChart width={260} height={260}>
				<Tooltip formatter={(value): any => convertWeight(Number(value))} />
				{arrayTypeAction?.some((v) => v == 'product') && (
					<Pie data={dataChart?.productWeight} dataKey={'value'} outerRadius={130} innerRadius={110}>
						{dataChart?.productWeight?.map((entry, index) => (
							<Cell key={`cell-01-${index}`} fill={entry.color} />
						))}
					</Pie>
				)}
				{arrayTypeAction?.some((v) => v == 'quality') && (
					<Pie data={dataChart?.qualityWeight} dataKey={'value'} outerRadius={110} innerRadius={90}>
						{dataChart?.qualityWeight?.map((entry, index) => (
							<Cell key={`cell-02-${index}`} fill={entry.color} />
						))}
					</Pie>
				)}
				{arrayTypeAction?.some((v) => v == 'spec') && (
					<Pie data={dataChart?.specWeight} dataKey={'value'} outerRadius={90} innerRadius={70}>
						{dataChart?.specWeight?.map((entry, index) => (
							<Cell key={`cell-03-${index}`} fill={entry.color} />
						))}
					</Pie>
				)}
			</PieChart>

			<div className={styles.total_value}>
				<p className={styles.text}>Tổng khối lượng</p>
				<p className={styles.value}>{convertWeight(totalValueChart)}</p>
			</div>
		</div>
	);
}

export default memo(ChartDashboard);
