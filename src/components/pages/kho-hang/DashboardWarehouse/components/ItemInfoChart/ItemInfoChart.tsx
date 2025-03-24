import React, {memo} from 'react';

import {PropsItemInfoChart} from './interfaces';
import styles from './ItemInfoChart.module.scss';
import {Eye, EyeSlash} from 'iconsax-react';
import {convertCoin} from '~/common/funcs/convertCoin';
import clsx from 'clsx';
import Tippy from '@tippyjs/react';
import {convertWeight} from '~/common/funcs/optionConvert';

function ItemInfoChart({text, arrayData, keyAction, arrayTypeAction, handleAction}: PropsItemInfoChart) {
	return (
		<div className={styles.container}>
			<Tippy content={arrayTypeAction?.some((v) => v == keyAction) ? 'Ẩn thống kê' : 'Hiện thống kê'}>
				<div
					className={clsx(styles.action, {[styles.hidden]: !arrayTypeAction?.some((v) => v == keyAction)})}
					onClick={handleAction}
				>
					{arrayTypeAction?.some((v) => v == keyAction) ? (
						<Eye size='22' color='#2D74FF' />
					) : (
						<EyeSlash size='22' color='#F95B5B' />
					)}
				</div>
			</Tippy>
			<div className={styles.main}>
				<div className={styles.item}>
					<div className={styles.head}>
						<p className={styles.text}>{text}</p>
					</div>
					<p className={styles.value}>Khối lượng</p>
				</div>
				<div className={styles.list}>
					{arrayData?.map((v, i) => (
						<div key={i} className={styles.item}>
							<div className={styles.head}>
								<div style={{background: v.color}} className={styles.dot}></div>
								<p className={styles.text}>{v?.name}</p>
							</div>
							<p className={styles.value}>{convertWeight(v?.value)}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default memo(ItemInfoChart);
