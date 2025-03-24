import React, {useState, useEffect} from 'react';
import {PropsInputColor} from './interfaces';
import styles from './InputColor.module.scss';

function InputColor({label, color = '', onSetColor}: PropsInputColor) {
	const [inputValue, setInputValue] = useState(color);

	useEffect(() => {
		setInputValue(color);
	}, [color]);

	const handleColorChange = (value: any) => {
		setInputValue(value);
		onSetColor(value);
	};

	const handleInputChange = (e: any) => {
		const value = e.target.value;
		if (/^#[0-9A-F]{6}$/i.test(value) || value === '') {
			handleColorChange(value);
		}
		setInputValue(value);
	};

	return (
		<div className={styles.container}>
			{label ? <label className={styles.label}>{label}</label> : null}
			<div className={styles.box_input}>
				<input type='color' value={color} onChange={(e) => handleColorChange(e.target.value)} />
				<input type='text' value={inputValue} onChange={handleInputChange} className={styles.text_input} placeholder='#000000' />
			</div>
		</div>
	);
}

export default InputColor;
