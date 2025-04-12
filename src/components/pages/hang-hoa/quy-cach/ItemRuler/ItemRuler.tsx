import React, {memo} from 'react';

import {PropsItemRuler} from './interfaces';
import styles from './ItemRuler.module.scss';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_RULER} from '~/constants/config/enum';
import clsx from 'clsx';
import {Trash} from 'iconsax-react';
import SelectSearch from '~/components/common/SelectSearch';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import criteriaServices from '~/services/criteriaServices';
import {useRouter} from 'next/router';

function ItemRuler({data, idx, showBtnDelete, handleDeleteRow, handleChangeValue, handleChangeValueSelectSearch}: PropsItemRuler) {
	const router = useRouter();

	const {_id} = router.query;

	const listCriteria = useQuery([QUERY_KEY.dropdown_tieu_chi_quy_cach, _id], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: criteriaServices.listCriteria({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					specificationUuid: _id ? (_id as string) : '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={clsx(styles.criteria)}>
			<div className={styles.input_field}>
				<SelectSearch
					data={{
						id: data?.uuid,
						name: data?.titleType,
					}}
					options={listCriteria?.data?.map((v: any) => ({
						id: v?.uuid,
						name: v?.title,
					}))}
					placeholder='Nhập, chọn tiêu chí'
					setData={(rule) => {
						const updates = {
							uuid: rule.id || '',
							titleType: rule.name,
						};
						handleChangeValueSelectSearch(idx, updates);
					}}
				/>
			</div>
			<div className={styles.group_radio}>
				<div className={styles.item_radio}>
					<input
						value={data.rule}
						type='radio'
						id={`type_ruler_1_${idx}`}
						name={`type_ruler_1_${idx}`}
						checked={data?.rule == TYPE_RULER.NHO_HON}
						onChange={() => handleChangeValue(idx, 'rule', TYPE_RULER.NHO_HON)}
					/>
					<label htmlFor={`type_ruler_1_${idx}`}>&lt; Nhỏ hơn</label>
				</div>
				<div className={styles.item_radio}>
					<input
						value={data.rule}
						type='radio'
						id={`type_ruler_${idx}`}
						name={`type_ruler_${idx}`}
						checked={data?.rule == TYPE_RULER.LON_HON}
						onChange={() => handleChangeValue(idx, 'rule', TYPE_RULER.LON_HON)}
					/>
					<label htmlFor={`type_ruler_${idx}`}>&gt; Lớn hơn</label>
				</div>
			</div>

			<div className={styles.box_control}>
				<div className={styles.input_specification}>
					<input
						name='value'
						value={data.value}
						type='number'
						max={100}
						step={0.01}
						placeholder='Nhập thông số'
						className={styles.input}
						onChange={(e) => handleChangeValue(idx, 'value', e.target.value)}
					/>
					<div className={styles.unit}>%</div>
				</div>
			</div>

			<div className={styles.box_control}>
				{/* <div className={styles.input_specification}>
					<input
						name='value'
						value={data.value}
						type='number'
						max={100}
						step={0.01}
						placeholder='Nhập thông số'
						className={styles.input}
						onChange={(e) => handleChangeValue(idx, 'value', e.target.value)}
					/>
					<div className={styles.unit}>%</div>
				</div> */}
				<div className={styles.input_specification}>
					<input
						name='order'
						value={data.order}
						type='number'
						max={100}
						step={0.01}
						placeholder='Nhập số thứ tự'
						className={styles.input}
						onChange={(e) => handleChangeValue(idx, 'order', e.target.value)}
					/>
					{/* <div className={styles.unit}>%</div> */}
				</div>
				{showBtnDelete && (
					<div className={styles.btn_delete} onClick={() => handleDeleteRow(idx)}>
						<Trash />
					</div>
				)}
			</div>
		</div>
	);
}

export default memo(ItemRuler);
