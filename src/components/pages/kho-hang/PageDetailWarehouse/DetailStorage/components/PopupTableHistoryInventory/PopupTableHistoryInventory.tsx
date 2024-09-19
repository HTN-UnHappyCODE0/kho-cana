import React from 'react';
import {IInventory, PropsPopupTableHistoryInventory} from './interfaces';
import styles from './PopupTableHistoryInventory.module.scss';
import {IoClose} from 'react-icons/io5';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';

import storageServices from '~/services/storageServices';
import Moment from 'react-moment';
import {convertWeight} from '~/common/funcs/optionConvert';
import SliderDebt from '~/components/common/SliderDebt';

function PopupTableHistoryInventory({onClose}: PropsPopupTableHistoryInventory) {
	const router = useRouter();

	const {_uuidInventory} = router.query;

	const {data: detailHistoryInventory} = useQuery<IInventory>([QUERY_KEY.chi_tiet_lich_su_kiem_ke, _uuidInventory], {
		queryFn: () =>
			httpRequest({
				http: storageServices.detailHistoryInventory({
					uuid: _uuidInventory as string,
				}),
			}),
		onSuccess(data) {
			return data;
		},
		enabled: !!_uuidInventory,
	});

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Chi tiết kiểm kê</h2>
			<table>
				<thead>
					<tr>
						<th className={styles.table_header_left}>Thông tin kiểm kê</th>
						<th className={styles.table_header_right}>Tệp đính kèm</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={styles.left}>
							<ul className={styles.list_detail}>
								<li>
									<p>Kho bãi :</p>
									<p>{detailHistoryInventory?.storageUu?.name || '---'}</p>
								</li>
								<li>
									<p>Tổng lượng quy khô ban đầu (tấn):</p>
									<p>{convertWeight(detailHistoryInventory?.totalAmountBefore ?? 0)}</p>
								</li>
								<li>
									<p>Tổng lượng quy khô còn lại (tấn):</p>
									<p>{convertWeight(detailHistoryInventory?.totalAmountAfter ?? 0)}</p>
								</li>
								<li>
									<p>Thời gian thay đổi :</p>
									<p>{<Moment date={detailHistoryInventory?.created} format='HH:mm,DD/MM/YYYY' />}</p>
								</li>
								<li>
									<p>Người thay đổi :</p>
									<p>{detailHistoryInventory?.accountUu?.username}</p>
								</li>
							</ul>
						</td>
						<td className={styles.right}>{<SliderDebt listImage={detailHistoryInventory?.path || []} />}</td>
					</tr>
				</tbody>
			</table>

			<div className={styles.icon_close} onClick={onClose}>
				<IoClose size={24} color='#23262F' />
			</div>
		</div>
	);
}

export default PopupTableHistoryInventory;
