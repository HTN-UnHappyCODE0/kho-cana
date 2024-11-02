import {createContext, useEffect, useRef, useState} from 'react';

import {PropsSelector} from './interfaces';
import clsx from 'clsx';
import styles from './Select.module.scss';
import {ArrowDown2} from 'iconsax-react';
import TippyHeadless from '@tippyjs/react/headless';

export const ContextSelect = createContext<any>({});

function Select(props: PropsSelector) {
	const ref = useRef<any>(null);

	const [width, setWidth] = useState<number>(0);
	const [show, setShow] = useState<boolean>(false);
	const [value, setValue] = useState<any>(null);
	const [keyword, setKeyword] = useState<string>('');

	const handleChange = (data: any) => {
		const e = {
			target: {
				name: props?.name,
				textname: props?.textname,
				value: data?.value,
				title: data?.title,
			},
		};

		props.onChange && props.onChange(e);
		setValue(data);
	};

	useEffect(() => {
		if (ref.current) {
			const resizeObserver = new ResizeObserver((entries) => {
				if (entries[0].contentRect) {
					setWidth(entries[0].contentRect.width);
				}
			});

			resizeObserver.observe(ref.current);

			return () => {
				resizeObserver.disconnect();
			};
		}
	}, []);

	return (
		<ContextSelect.Provider
			value={{
				onChange: handleChange,
				data: value,
				defaultValue: props?.value,
				keyword,
			}}
		>
			<div className={styles.container}>
				{props?.label ? <label>{props.label}</label> : null}
				<TippyHeadless
					maxWidth={'100%'}
					interactive
					onClickOutside={() => setShow(false)}
					placement='bottom-start'
					visible={show}
					render={(attrs: any) => (
						<div
							style={{width: width}}
							className={clsx(styles.containerOption, {
								[styles.active]: show,
							})}
						>
							{props.isSearch ? (
								<div>
									<input
										className={styles.input_search}
										type='text'
										placeholder='Tìm kiếm...'
										onChange={(e) => setKeyword(e.target.value)}
										value={keyword}
										autoFocus={show}
									/>
								</div>
							) : null}
							<div className={clsx(styles.main)} onClick={() => setShow(false)}>
								{props.children}
							</div>
						</div>
					)}
				>
					<div className={clsx(styles.select)} ref={ref}>
						<div
							className={clsx(styles.value, {[styles.active]: show, [styles.readOnly]: props.readOnly})}
							onClick={() => {
								if (props.readOnly) {
									return null;
								} else {
									setShow(!show);
								}
							}}
						>
							<p
								className={clsx(styles.text, {
									[styles.placeholder]: !props.value,
								})}
							>
								{props.value ? value?.title : props.placeholder}
							</p>
							<span className={styles.icon}>
								<ArrowDown2 size={16} />
							</span>
						</div>
					</div>
				</TippyHeadless>
			</div>
		</ContextSelect.Provider>
	);
}

export default Select;
