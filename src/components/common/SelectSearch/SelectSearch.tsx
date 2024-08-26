import React, {memo, useEffect, useRef, useState} from 'react';

import {PropsSelectSearch} from './interfaces';
import styles from './SelectSearch.module.scss';
import clsx from 'clsx';
import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import {convertCoin, price} from '~/common/funcs/convertCoin';

function SelectSearch({label, placeholder, options, data, readonly = false, isConvertNumber = false, setData, unit}: PropsSelectSearch) {
	const ref = useRef<any>(null);

	const [open, setOpen] = useState<boolean>(false);
	const [keyword, setKeyword] = useState<string>(isConvertNumber ? '0' : '');

	const handleClickOutside = (event: any) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isConvertNumber) {
			if (!Number(price(e.target.value))) {
				setKeyword('0');
				setData({
					id: '',
					name: 0,
				});
			} else {
				setKeyword(e.target.value);
				setData({
					id: '',
					name: price(e.target.value),
				});
			}
		} else {
			setKeyword(e.target.value);
			setData({
				id: '',
				name: e.target.value,
			});
		}
	};

	return (
		<div className={styles.container}>
			<label className={styles.label}>{label}</label>
			<div className={styles.box_input} ref={ref}>
				<input
					type='text'
					className={clsx(styles.input, {[styles.readonly]: readonly})}
					placeholder={placeholder || 'Tìm kiếm...'}
					name='keyword'
					value={isConvertNumber ? convertCoin(price(data.name)) : data.name || keyword}
					autoComplete='off'
					readOnly={readonly}
					onFocus={() => {
						if (readonly) {
							return;
						} else {
							setOpen(true);
						}
					}}
					onChange={handleChange}
				/>

				{!!unit && <div className={styles.unit}>{unit}</div>}

				<div
					className={clsx(styles.main_option, {
						[styles.open]:
							open &&
							options?.filter((v) =>
								removeVietnameseTones(v.name)?.includes(
									keyword ? removeVietnameseTones(isConvertNumber ? String(price(keyword)) : keyword) : ''
								)
							)?.length > 0,
					})}
				>
					{options
						?.filter((v) =>
							removeVietnameseTones(v.name)?.includes(
								keyword ? removeVietnameseTones(isConvertNumber ? String(price(keyword)) : keyword) : ''
							)
						)
						?.map((v) => (
							<div
								key={v.id}
								className={clsx(styles.item, {[styles.active]: v.id == data.id})}
								onClick={() => {
									setData({
										id: v?.id,
										name: isConvertNumber ? price(Number(v?.name)) : v?.name,
									});
									setOpen(false);
									setKeyword(isConvertNumber ? convertCoin(Number(v?.name)) : v?.name);
								}}
							>
								{isConvertNumber ? convertCoin(Number(v.name)) : v.name}
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

export default memo(SelectSearch);
