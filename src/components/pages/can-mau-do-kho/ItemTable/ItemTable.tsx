import React, {Fragment, useState} from 'react';

import {PropsItemTable} from './interfaces';
import styles from './ItemTable.module.scss';
import {useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import {clsx} from 'clsx';
import {IoIosArrowDown} from 'react-icons/io';

function ItemTable({order, listData, isParent = true, uuidParent = ''}: PropsItemTable) {
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
				<p style={{width: '44px', paddingRight: '16px'}}>{order}</p>
				<p style={{width: '120px', paddingRight: '16px'}}>{listData?.finalDryness?.toFixed(2) || '---'}</p>
			</div>

			{openArrow && !!listData?.sampleDryness ? (
				<div className={styles.list_storage}>
					{listData?.sampleDryness?.map((v: any, i: number) => (
						<ItemTable key={v.uuid} order={i + 1} listData={v} isParent={false} uuidParent={uuidParent} />
					))}
				</div>
			) : null}
		</Fragment>
	);
}

export default ItemTable;
