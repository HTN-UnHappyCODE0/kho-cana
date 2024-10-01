import React from 'react';

import {PropsMainDashboard} from './interfaces';
import styles from './MainDashboard.module.scss';
import ChartImportCompany from '../ChartImportCompany';
import ChartExportCompany from '../ChartExportCompany';
import ChartServiceCompany from '../ChartServiceCompany';

function MainDashboard({}: PropsMainDashboard) {
	return (
		<div className={styles.container}>
			<ChartImportCompany />
			<ChartExportCompany />
			<ChartServiceCompany />
		</div>
	);
}

export default MainDashboard;
