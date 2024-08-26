import {useEffect, useMemo, useRef, useState} from 'react';

import {PropsTable} from './interfaces';
import clsx from 'clsx';
import styles from './Table.module.scss';

function Table({data, column, onSetData}: PropsTable) {
	const myElementRef = useRef<any>(null);
	const [isShowScroll, setIsShowScroll] = useState<boolean>(false);

	const checkForHorizontalScroll = () => {
		const element = myElementRef.current;
		if (element.scrollWidth > element.clientWidth) {
			setIsShowScroll(true);
		} else {
			setIsShowScroll(false);
		}
	};

	useEffect(() => {
		// Check scroll on component mount
		checkForHorizontalScroll();

		// Set up resize event listener
		window.addEventListener('resize', checkForHorizontalScroll);

		return () => {
			window.removeEventListener('resize', checkForHorizontalScroll);
		};
	}, []);

	/*---------- Handle CheckBox ----------*/
	useEffect(() => {
		onSetData &&
			onSetData((prev: any[]) =>
				prev.map((item: any, index: number) => ({
					...item,
					isChecked: false,
					index: index,
				}))
			);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCheckAll = (e: any) => {
		const {checked} = e.target;
		onSetData && onSetData((prev: any[]) => prev.map((item: any) => ({...item, isChecked: checked})));
	};

	const handleCheckRow = (e: any, i: any) => {
		const {checked} = e.target;
		onSetData &&
			onSetData((prev: any[]) =>
				prev.map((item: any, index: number) => {
					if (index === i) {
						return {...item, isChecked: checked};
					}
					return item;
				})
			);
	};

	const isCheckedAll = useMemo(() => {
		return data.length > 0 ? data.some((item: any) => item?.isChecked === false) : false;
	}, [data]);

	return (
		<div ref={myElementRef} className={styles.container}>
			<table>
				<thead>
					<tr>
						{column.map((v: any, i: number) => (
							<th
								className={clsx({
									[styles.checkBox]: v.checkBox,
									[styles.textEnd]: v.textAlign == 'end',
									[styles.textStart]: v.textAlign == 'start',
									[styles.textCenter]: v.textAlign == 'center',
									[styles.fixedLeft]: v.fixedLeft && isShowScroll,
									[styles.fixedRight]: v.fixedRight && isShowScroll,
								})}
								key={i}
							>
								{v.checkBox ? (
									<input
										className={clsx(styles.checkbox, styles.checkbox_head)}
										onChange={handleCheckAll}
										checked={!isCheckedAll || false}
										type='checkbox'
									/>
								) : null}

								{v.title}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((v: any, i: number) => (
						<tr key={i}>
							{column.map((y: any, j: number) => (
								<td
									key={j}
									className={clsx({
										[styles.fixedLeft]: y.fixedLeft && isShowScroll,
										[styles.fixedRight]: y.fixedRight && isShowScroll,
									})}
								>
									<div
										className={clsx(y.className, {
											[styles.checkBox]: y.checkBox,
										})}
									>
										{y.checkBox ? (
											<input
												className={styles.checkbox}
												onChange={(e) => handleCheckRow(e, i)}
												checked={v?.isChecked || false}
												type='checkbox'
											/>
										) : null}
										{y.render(v, i)}
									</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default Table;
