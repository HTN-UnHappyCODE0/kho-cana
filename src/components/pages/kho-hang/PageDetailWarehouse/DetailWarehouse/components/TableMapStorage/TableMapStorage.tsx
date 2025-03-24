import React, {useState} from 'react';

import {PropsTableMapStorage} from './interfaces';

import styles from './MainMapWarehouse.module.scss';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import warehouseServices from '~/services/warehouseServices';

import {calculateDimensions} from '~/common/funcs/convertPositonStorage';
import {IArrayDisabledGrid} from '../../../../GridTemplateWarehouse/interfaces';
import GridTemplateWarehouse from '../../../../GridTemplateWarehouse';
import NoteSpecWarehouse from '../../../../NoteSpecWarehouse';

function TableMapStorage({}: PropsTableMapStorage) {
	const router = useRouter();

	const {_id} = router.query;

	const [arrayDisabledGrid, setArrayDisabledGrid] = useState<IArrayDisabledGrid[]>([]);

	useQuery([QUERY_KEY.chi_tiet_kho_hang, _id], {
		queryFn: () =>
			httpRequest({
				http: warehouseServices.detailWarehouse({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setArrayDisabledGrid(
					data?.storage?.map((v: any) => ({
						uuid: v?.uuid,
						name: v?.name,
						code: v?.code,
						arrayPostion: v?.locationMap ? JSON.parse(v?.locationMap) : [],
						amountBdmt: v?.amountBdmtDemo + v?.amountBdmt,
						background: v?.specificationsUu?.colorShow,
						specificationName: v?.specificationsUu?.name,
						col: calculateDimensions(v?.locationMap ? JSON.parse(v?.locationMap) : [], 10).numColumns,
						row: calculateDimensions(v?.locationMap ? JSON.parse(v?.locationMap) : [], 10).numRows,
					}))
				);
			}
		},
		enabled: !!_id,
	});

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<GridTemplateWarehouse isUpdate={false} arrayDisabledGrid={arrayDisabledGrid} />
				<NoteSpecWarehouse isUpdate={false} />
			</div>
		</div>
	);
}

export default TableMapStorage;
