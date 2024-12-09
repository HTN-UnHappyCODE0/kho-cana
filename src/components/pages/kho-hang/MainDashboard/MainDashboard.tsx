import React, {useState} from 'react';

import {PropsMainDashboard} from './interfaces';
import styles from './MainDashboard.module.scss';
import DashboardWarehouse from '../DashboardWarehouse';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, TYPE_STORE} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import warehouseServices from '~/services/warehouseServices';

function MainDashboard({}: PropsMainDashboard) {
	const [uuidCompany, setUuidCompany] = useState<string>('');
	const {data: dataWarehouse} = useQuery([QUERY_KEY.thong_ke_kho_hang, uuidCompany], {
		queryFn: () =>
			httpRequest({
				isData: true,
				http: warehouseServices.dashbroadWarehouse({
					typeProduct: TYPE_STORE.ADMIN_KHO,
					companyUuid: uuidCompany as string,
				}),
			}),
		select(data) {
			if (data) {
				return data.data;
			}
		},
	});

	return (
		<div className={styles.container}>
			<DashboardWarehouse
				isTotal={true}
				total={dataWarehouse?.total}
				productTotal={dataWarehouse?.productTotal}
				qualityTotal={dataWarehouse?.qualityTotal}
				specTotal={dataWarehouse?.specTotal}
				setUuidCompany={setUuidCompany}
			/>
			{dataWarehouse?.detailWarehouseSpec?.map((v: any) => (
				<DashboardWarehouse dataWarehouse={v} key={v?.uuid} isTotal={false} />
			))}
		</div>
	);
}

export default MainDashboard;
