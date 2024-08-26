import React, {useState} from 'react';

import {PropsMainMapWarehouse} from './interfaces';

import styles from './MainMapWarehouse.module.scss';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import warehouseServices from '~/services/warehouseServices';
import GridTemplateWarehouse from '../GridTemplateWarehouse';
import NoteSpecWarehouse from '../NoteSpecWarehouse';
import {IArrayDisabledGrid} from '../GridTemplateWarehouse/interfaces';
import {calculateDimensions} from '~/common/funcs/convertPositonStorage';

function MainMapWarehouse({}: PropsMainMapWarehouse) {
	const router = useRouter();

	const {_id} = router.query;

	const [dataDetailWarehouse, setDataDetailWarehouse] = useState<any>();
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
				setDataDetailWarehouse(data);
				setArrayDisabledGrid(
					data?.storage?.map((v: any) => ({
						uuid: v?.uuid,
						name: v?.name,
						code: v?.code,
						arrayPostion: v?.locationMap ? JSON.parse(v?.locationMap) : [],
						amountBdmt: v?.amountMt + v?.amountBdmt,
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
			<div className={styles.header}>
				<h4 className={styles.title}>Chi tiết sơ đồ kho {dataDetailWarehouse?.name}</h4>
				<div className={styles.right}>
					<Button p_10_24 rounded_2 grey_outline onClick={() => router.back()}>
						Quay lại
					</Button>
					<Button p_10_24 rounded_2 edit href={`/kho-hang/so-do/chinh-sua?_id=${dataDetailWarehouse?.uuid}`}>
						Chỉnh sửa sơ đồ
					</Button>
				</div>
			</div>
			<div className={styles.main}>
				<GridTemplateWarehouse isUpdate={false} arrayDisabledGrid={arrayDisabledGrid} />
				<NoteSpecWarehouse isUpdate={false} />
			</div>
		</div>
	);
}

export default MainMapWarehouse;
