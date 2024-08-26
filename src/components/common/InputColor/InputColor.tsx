import React from 'react';

import {PropsInputColor} from './interfaces';
import styles from './InputColor.module.scss';

function InputColor({label, color = '', onSetColor}: PropsInputColor) {
	return (
		<div className={styles.container}>
			{label ? <label className={styles.label}>{label}</label> : null}
			<div className={styles.box_input}>
				<input
					type='color'
					value={color}
					onChange={(e) => {
						onSetColor(e.target.value);
					}}
				/>
				<p className={styles.value}>{color}</p>
			</div>
		</div>
	);
}

export default InputColor;
