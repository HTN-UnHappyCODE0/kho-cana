import React from 'react';

import {PropsBoxViewSpec} from './interfaces';
import styles from './BoxViewSpec.module.scss';

function BoxViewSpec({dataUpdateSpec}: PropsBoxViewSpec) {
	return (
		<div className={styles.container}>
			<div className={styles.main}>
				{dataUpdateSpec?.specStyleUu?.map((v: any, i: number) => (
					<div key={i} className={styles.item}>
						<p>{v?.criteriaUu?.title}</p>
						<p>{v?.value}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default BoxViewSpec;
