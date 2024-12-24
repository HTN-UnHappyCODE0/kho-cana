import React, {useState} from 'react';

import {PropsItemTable} from './interfaces';
import styles from './ItemTable.module.scss';
import {clsx} from 'clsx';
import StateActive from '~/components/common/StateActive';
import GridColumn from '~/components/layouts/GridColumn';

function ItemTable({sampleData, order}: PropsItemTable) {
	const [openArrow, setOpenArrow] = useState<boolean>(true);

	return (
		<div className={styles.container}>
			<div className={styles.table_option}>
				<div key={sampleData?.uuid} className={styles.option}>
					<div
						className={clsx(styles.infor_check, {
							[styles.root_false]: sampleData?.isRoot != true,
							[styles.root_true]: sampleData?.isRoot == true,
						})}
					>
						<div className={styles.header_option}>
							<div style={{color: '#2D74FF'}}>{order}</div>
							<div className={styles.status_header}>
								<StateActive
									stateActive={sampleData?.status}
									listState={[
										{
											state: 0,
											text: 'Đã hủy',
											textColor: '#F95B5B',
											backgroundColor: 'rgba(249, 91, 91, 0.10)',
										},
										{
											state: 1,
											text: 'Sử dụng',
											textColor: '#2D74FF',
											backgroundColor: 'rgba(45, 116, 255, 0.10)',
										},
									]}
								/>
							</div>
						</div>
						<div className={styles.line_stroke}></div>
						<GridColumn col_1 className={styles.grid_column}>
							<div className={styles.item}>
								<p>Mã lô:</p>
								<p style={{color: '#2D74FF'}}>{sampleData?.billCode || '---'}</p>
							</div>

							<div className={styles.item}>
								<p>Khách hàng:</p>
								<p>{sampleData?.customerUu?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Độ khô:</p>
								<p>{sampleData?.finalDryness?.toFixed(2) || '---'}%</p>
							</div>
						</GridColumn>
						{openArrow && (
							<GridColumn col_1>
								{sampleData?.sampleDryness?.map((x: any, i: number) => (
									<div key={x?.uuid}>
										<div className={styles.line_stroke}></div>
										<div className={styles.item_child}>
											<div className={styles.item}>
												<p>STT:</p>
												<p style={{color: '#2D74FF'}}>{i + 1}</p>
											</div>
											<div className={styles.item}>
												<p>Mã khay:</p>
												<p>{x?.trayCode}</p>
											</div>
											<div className={styles.item}>
												<p>KL khay:</p>
												<p>{x?.trayWeight}</p>
											</div>
											<div className={styles.item}>
												<p>KL dăm:</p>
												<p>{x?.woodWeight}</p>
											</div>
											<div className={styles.item}>
												<p>KL khay dăm 16h:</p>
												<p>{x?.trayWoodWeight1}</p>
											</div>
											<div className={styles.item}>
												<p>KL khay dăm 18h:</p>
												<p>{x?.trayWoodWeight2}</p>
											</div>
											<div className={styles.item}>
												<p>KL khay dăm 20h:</p>
												<p>{x?.trayWoodWeight3}</p>
											</div>
											<div className={styles.item}>
												<p>Độ khô:</p>
												<p>{x?.finalDryness?.toFixed(2)}</p>
											</div>
											<div className={styles.item}>
												<p>Trạng thái:</p>
												<StateActive
													stateActive={x?.status}
													listState={[
														{
															state: 0,
															text: 'Đã hủy',
															textColor: '#F95B5B',
															backgroundColor: 'rgba(249, 91, 91, 0.10)',
														},
														{
															state: 1,
															text: 'Sử dụng',
															textColor: '#2D74FF',
															backgroundColor: 'rgba(45, 116, 255, 0.10)',
														},
													]}
												/>
											</div>
										</div>
									</div>
								))}
							</GridColumn>
						)}
						<div className={styles.line_stroke}></div>
						<div className={styles.view_more} onClick={() => setOpenArrow(!openArrow)}>
							<p className={styles.text}>{openArrow ? 'Thu gọn' : 'Xem chi tiết'}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ItemTable;
