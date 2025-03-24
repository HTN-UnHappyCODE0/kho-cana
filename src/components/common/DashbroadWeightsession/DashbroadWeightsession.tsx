import React from 'react';

import {PropsDashbroadWeightsession} from './interfaces';
import styles from './DashbroadWeightsession.module.scss';
import Image from 'next/image';
import {BiLoader} from 'react-icons/bi';

function DashbroadWeightsession({value, text, icons, loading}: PropsDashbroadWeightsession) {
	return (
		<div className={styles.container}>
			<div className={styles.box_value}>
				{loading ? (
					<div className={styles.loading}>
						<BiLoader />
					</div>
				) : (
					<h4>{value}</h4>
				)}
				<p>{text}</p>
			</div>
			<Image alt='biểu tượng' src={icons} width={44} height={44} />
		</div>
	);
}

export default DashbroadWeightsession;
