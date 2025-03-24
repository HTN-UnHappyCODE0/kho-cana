import React from 'react';

import {PropsNoteSpecWarehouse} from './interfaces';
import styles from './NoteSpecWarehouse.module.scss';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import {WEIGHT_WAREHOUSE} from '~/constants/config';

function NoteSpecWarehouse({isUpdate, numberElement}: PropsNoteSpecWarehouse) {
	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.FILTER,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.box_note}>
			<h4>Chú thích:</h4>
			{listSpecifications?.data?.map((v: any) => (
				<div key={v?.uuid} className={styles.item}>
					<div style={{background: v?.colorShow || '#16DBCC'}} className={styles.dot}></div>
					<p>{v?.name}</p>
				</div>
			))}

			{/* {isUpdate && (
				<div className={styles.des}>
					<p>1 đơn vị ô = {convertCoin(WEIGHT_WAREHOUSE)} KG</p>
					<p>KL kho tạm tính: {convertCoin(WEIGHT_WAREHOUSE * numberElement!)} KG</p>
				</div>
			)} */}
		</div>
	);
}

export default NoteSpecWarehouse;
