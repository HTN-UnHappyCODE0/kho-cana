import {useRouter} from 'next/router';
import React, {useState} from 'react';

import {PropsMainUpdateMapWarehouse} from './interfaces';
import styles from './MainUpdateMapWarehouse.module.scss';
import Button from '~/components/common/Button';
import GridTemplateWarehouse from '../GridTemplateWarehouse';
import NoteSpecWarehouse from '../NoteSpecWarehouse';
import {IArrayDisabledGrid} from '../GridTemplateWarehouse/interfaces';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import warehouseServices from '~/services/warehouseServices';
import {calculateDimensions} from '~/common/funcs/convertPositonStorage';
import Popup from '~/components/common/Popup';
import FormUpdateStorage from '../FormUpdateStorage';
import FormUpdatePostionStorage from '../FormUpdatePostionStorage';
import FormCreateStorage from '../FormCreateStorage';

function MainUpdateMapWarehouse({}: PropsMainUpdateMapWarehouse) {
	const router = useRouter();

	const {_id, _action} = router.query;

	const [dataDetailWarehouse, setDataDetailWarehouse] = useState<any>();
	const [draggedElements, setDraggedElements] = useState<number[]>([]);
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
			<div className={styles.header}>
				<h4 className={styles.title}>Chỉnh sửa sơ đồ kho {dataDetailWarehouse?.name}</h4>
				<div className={styles.right}>
					<Button p_10_24 rounded_2 grey_outline onClick={() => router.back()}>
						Hủy bỏ
					</Button>
					<Button p_10_24 rounded_2 primary href={`/kho-hang/${dataDetailWarehouse?.uuid}?_type=map`}>
						Chỉnh sửa kho
					</Button>
				</div>
			</div>

			<div className={styles.main}>
				<GridTemplateWarehouse
					isUpdate={true}
					arrayDisabledGrid={arrayDisabledGrid}
					draggedElements={draggedElements}
					setDraggedElements={setDraggedElements}
				/>
				<NoteSpecWarehouse isUpdate={true} numberElement={draggedElements?.length} />
			</div>

			<Popup
				open={_action == 'create-storage'}
				onClose={() => {
					const {_action, ...rest} = router.query;

					setDraggedElements([]);
					router.replace(
						{
							pathname: router.pathname,
							query: {
								...rest,
							},
						},
						undefined,
						{shallow: true, scroll: false}
					);
				}}
			>
				<FormCreateStorage
					draggedElements={draggedElements}
					onClose={() => {
						const {_action, ...rest} = router.query;

						setDraggedElements([]);
						router.replace(
							{
								pathname: router.pathname,
								query: {
									...rest,
								},
							},
							undefined,
							{shallow: true, scroll: false}
						);
					}}
				/>
			</Popup>

			<Popup
				open={_action == 'update-location'}
				onClose={() => {
					const {_action, ...rest} = router.query;
					setDraggedElements([]);
					router.replace(
						{
							pathname: router.pathname,
							query: {
								...rest,
							},
						},
						undefined,
						{shallow: true, scroll: false}
					);
				}}
			>
				<FormUpdatePostionStorage
					draggedElements={draggedElements}
					onClose={() => {
						const {_action, ...rest} = router.query;

						setDraggedElements([]);
						router.replace(
							{
								pathname: router.pathname,
								query: {
									...rest,
								},
							},
							undefined,
							{shallow: true, scroll: false}
						);
					}}
				/>
			</Popup>

			<Popup
				open={_action == 'update-storage'}
				onClose={() => {
					const {_action, _uuidStorage, ...rest} = router.query;
					setDraggedElements([]);
					router.replace(
						{
							pathname: router.pathname,
							query: {
								...rest,
							},
						},
						undefined,
						{shallow: true, scroll: false}
					);
				}}
			>
				<FormUpdateStorage
					onClose={() => {
						const {_action, _uuidStorage, ...rest} = router.query;

						setDraggedElements([]);
						router.replace(
							{
								pathname: router.pathname,
								query: {
									...rest,
								},
							},
							undefined,
							{shallow: true, scroll: false}
						);
					}}
				/>
			</Popup>
		</div>
	);
}

export default MainUpdateMapWarehouse;
