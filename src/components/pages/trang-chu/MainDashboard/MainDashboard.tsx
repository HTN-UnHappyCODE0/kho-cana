import React from 'react';

import {PropsMainDashboard} from './interfaces';
import styles from './MainDashboard.module.scss';
import ChartImportCompany from '../ChartImportCompany';
import ChartExportCompany from '../ChartExportCompany';
import ChartServiceCompany from '../ChartServiceCompany';
import DataFlowWeight from '../DataFlowWeight';
import DataFlowDryness from '../DataFlowDryness';

function MainDashboard({}: PropsMainDashboard) {
	return (
		<div className={styles.container}>
			<DataFlowWeight />
			<DataFlowDryness />
			<ChartImportCompany />
			<ChartExportCompany />
			<ChartServiceCompany />
		</div>
	);
}

export default MainDashboard;
