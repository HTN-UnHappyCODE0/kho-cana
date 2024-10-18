import React from 'react';

import {PropsBoxViewSpec} from './interfaces';
import styles from './BoxViewSpec.module.scss';
import {TYPE_RULER} from '~/constants/config/enum';

function BoxViewSpec({dataUpdateSpec}: PropsBoxViewSpec) {
	return (
		<div className={styles.container}>
			<div className={styles.main}>
				{dataUpdateSpec?.specStyleUu?.map((v: any, i: number) => (
					<div key={i} className={styles.item}>
						<p>
							{v?.criteriaUu?.title}
							<span style={{margin: '0 6px'}}>{v?.criteriaUu?.ruler == TYPE_RULER.NHO_HON ? '<' : '>'}</span>
							{v?.criteriaUu?.value}
						</p>
						<p>{v?.value}%</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default BoxViewSpec;
