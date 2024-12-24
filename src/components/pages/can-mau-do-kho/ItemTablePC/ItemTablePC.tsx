import React, {Fragment, useState} from 'react';

import {PropsItemTablePC} from './interfaces';
import styles from './ItemTablePC.module.scss';
import {useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import {clsx} from 'clsx';
import {IoIosArrowDown} from 'react-icons/io';
import StateActive from '~/components/common/StateActive';

function ItemTablePC({order, listData, isParent = true, uuidParent = '', header = false}: PropsItemTablePC) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [openArrow, setOpenArrow] = useState<boolean>(true);
	const [dataStatus, setDataStatus] = useState<any | null>(null);
	return (
		<Fragment>
			<div className={clsx(styles.container, {[styles.isChild]: !isParent})}>
				<div style={{width: '44px', paddingRight: '16px'}} className={styles.box_arrow} onClick={() => setOpenArrow(!openArrow)}>
					{isParent && (
						<IoIosArrowDown
							className={clsx(styles.arrow, {[styles.activeArrow]: openArrow})}
							size={18}
							color='rgba(45, 116, 255, 1)'
						/>
					)}
				</div>
				{header ? (
					<>
						<p style={{width: '44px', paddingRight: '16px'}}>{order}</p>
						<p style={{width: '240px', paddingRight: '16px'}}>Mã lô: {listData?.billCode || '---'}</p>
						<p style={{width: '120px', paddingRight: '16px'}}>Khách hàng: </p>
						<p style={{width: '360px', paddingRight: '16px'}}>{listData?.customerUu?.name || '---'}</p>
						<p style={{width: '90px', paddingRight: '16px'}}>{listData?.finalDryness?.toFixed(2)}</p>
						<p style={{width: '180px', paddingRight: '16px'}}>{listData?.description}</p>
						<p style={{width: '90px', paddingRight: '16px'}}>
							{listData?.status ? (
								<StateActive
									stateActive={listData?.status}
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
							) : (
								'---'
							)}
						</p>
					</>
				) : (
					<>
						<p style={{width: '44px', paddingRight: '16px'}}>{order}</p>
						<p style={{width: '120px', paddingRight: '16px'}}>{listData?.trayCode || '---'}</p>
						<p style={{width: '120px', paddingRight: '16px'}}>{listData?.trayWeight || '---'}</p>
						<p style={{width: '120px', paddingRight: '16px'}}>{listData?.woodWeight || '---'}</p>
						<p style={{width: '120px', paddingRight: '16px'}}>{listData?.trayWoodWeight1 || 0}</p>
						<p style={{width: '120px', paddingRight: '16px'}}>{listData?.trayWoodWeight2 || 0}</p>
						<p style={{width: '120px', paddingRight: '16px'}}>{listData?.trayWoodWeight3 || 0}</p>
						<p style={{width: '90px', paddingRight: '16px'}}>{listData?.finalDryness?.toFixed(2) || '---'}</p>
						<p style={{width: '180px', paddingRight: '16px'}}>{listData?.description || '---'}</p>
						<p style={{width: '90px', paddingRight: '16px'}}>
							<StateActive
								stateActive={listData?.status}
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
						</p>
					</>
				)}
			</div>

			{openArrow && !!listData?.sampleDryness ? (
				<div className={styles.list_storage}>
					{listData?.sampleDryness?.map((v: any, i: number) => (
						<ItemTablePC key={v.uuid} order={i + 1} listData={v} isParent={false} uuidParent={uuidParent} />
					))}
				</div>
			) : null}
		</Fragment>
	);
}

export default ItemTablePC;
