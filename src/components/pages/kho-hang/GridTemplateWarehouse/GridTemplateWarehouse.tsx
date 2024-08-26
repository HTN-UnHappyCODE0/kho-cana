import React, {useCallback, useState} from 'react';

import {PropsGridTemplateWarehouse} from './interfaces';
import styles from './GridTemplateWarehouse.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {MdAdd, MdOutlineRotateRight} from 'react-icons/md';
import {calculateDimensions} from '~/common/funcs/convertPositonStorage';
import {useRouter} from 'next/router';
import {IoClose} from 'react-icons/io5';
import {convertCoin} from '~/common/funcs/convertCoin';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import Tippy from '@tippyjs/react';

function GridTemplateWarehouse({isUpdate = true, arrayDisabledGrid, draggedElements = [], setDraggedElements}: PropsGridTemplateWarehouse) {
	const numCols = 10;
	const router = useRouter();

	const gridCells = Array.from({length: numCols * numCols}, (_, index) => index + 1);

	const [dragging, setDragging] = useState<boolean>(false);
	const [selectedElements, setSelectedElements] = useState<number[]>([]);

	const handleMouseDown = useCallback(
		(cellNumber: number) => {
			// Không chọn được những ô đã kéo
			if (draggedElements.includes(cellNumber)) {
				return;
			}

			// Không chọn được khi ở màn xem
			if (!isUpdate) {
				return;
			}

			// Không chọn được những ô của kho khách
			if (arrayDisabledGrid.some((element) => element.arrayPostion.includes(cellNumber))) {
				return;
			}

			// Bắt đầu kéo
			setDragging(true);
			setSelectedElements([cellNumber]);

			if (!draggedElements.includes(cellNumber)) {
				setDraggedElements && setDraggedElements([]);
			}
		},
		[draggedElements, arrayDisabledGrid]
	);

	const handleMouseOver = useCallback(
		(cellNumber: number) => {
			if (dragging) {
				// Không chọn được những ô đã kéo
				if (draggedElements.includes(cellNumber)) {
					return;
				}

				// Không chọn được khi ở màn xem
				if (!isUpdate) {
					return;
				}

				// Không chọn được những ô của kho khách
				if (arrayDisabledGrid.some((element) => element.arrayPostion.includes(cellNumber))) {
					return;
				}

				setSelectedElements((prevSelected) => {
					if (!prevSelected.includes(cellNumber)) {
						return [...prevSelected, cellNumber];
					}
					return prevSelected;
				});
			}
		},
		[dragging, draggedElements, arrayDisabledGrid]
	);

	const handleMouseUp = useCallback(() => {
		setDragging(false);
		setDraggedElements &&
			setDraggedElements((prevDragged: any) => {
				const newDragged = fillRectangle(selectedElements, numCols);
				return [...prevDragged, ...newDragged];
			});
		setSelectedElements([]);
	}, [selectedElements, numCols]);

	// Format mảng selected để được hình chữ nhật
	const fillRectangle = useCallback((selectedElements: number[], numCols: number) => {
		const arr = selectedElements.sort((a, b) => a - b);

		const [start, end] = [Math.min(...arr), Math.max(...arr)];

		const startRow = Math.floor((start - 1) / numCols);
		const endRow = Math.floor((end - 1) / numCols);

		const startCol = (start - 1) % numCols;
		const endCol = (end - 1) % numCols;

		const filledElements = [];
		for (let row = startRow; row <= endRow; row++) {
			for (let col = startCol; col <= endCol; col++) {
				const cellNumber = row * numCols + col + 1;
				filledElements.push(cellNumber);
			}
		}

		return filledElements;
	}, []);

	return (
		<div className={clsx(styles.grid, {[styles.isNotUpdate]: !isUpdate})}>
			{gridCells?.map((cellNumber) => {
				// Lấy ô đầu tiên của mảng đã kéo
				const isFirstItemDragged = draggedElements[0] === cellNumber;

				// Khối có sẵn kho
				const storage = arrayDisabledGrid.find((element) => element.arrayPostion.includes(cellNumber));
				const isFirstItemDisabled = storage && storage.arrayPostion[0] === cellNumber;

				return (
					<div
						key={cellNumber}
						className={clsx(styles.cell, {
							[styles.selected]: selectedElements.includes(cellNumber) || draggedElements.includes(cellNumber),
							[styles.isFirstItemDragged]: isFirstItemDragged,
							[styles.isFirstItemDisabled]: isFirstItemDisabled,
						})}
						onMouseDown={() => handleMouseDown(cellNumber)}
						onMouseOver={() => handleMouseOver(cellNumber)}
						onMouseUp={handleMouseUp}
					>
						{/* Đè lớp overlay lên khu vực đã kéo */}
						{isFirstItemDragged && (
							<div
								className={styles.overlay}
								style={{
									width: `${80 * calculateDimensions(draggedElements, numCols).numColumns}px`,
									height: `${80 * calculateDimensions(draggedElements, numCols).numRows}px`,
								}}
							>
								<div className={styles.action_create}>
									{calculateDimensions(draggedElements, numCols).numColumns > 2 ? (
										<div className={styles.group_btn}>
											<Button
												primary
												small
												rounded_4
												icon={<MdAdd size={18} color='#fff' />}
												onClick={() => {
													router.replace(
														{
															pathname: router.pathname,
															query: {
																...router.query,
																_action: 'create-storage',
															},
														},
														undefined,
														{shallow: true, scroll: false}
													);
												}}
											>
												Thêm kho hàng
											</Button>
											<Button
												primary
												small
												rounded_4
												icon={<MdOutlineRotateRight size={18} color='#fff' />}
												onClick={() => {
													router.replace(
														{
															pathname: router.pathname,
															query: {
																...router.query,
																_action: 'update-location',
															},
														},
														undefined,
														{shallow: true, scroll: false}
													);
												}}
											>
												Chuyển vị trí kho
											</Button>
										</div>
									) : (
										// Trường hợp diện tích nhỏ hơn 2 ô dọc
										<div className={styles.group_btn}>
											<Button
												primary
												small
												w_fit
												rounded_4
												onClick={() => {
													router.replace(
														{
															pathname: router.pathname,
															query: {
																...router.query,
																_action: 'create-storage',
															},
														},
														undefined,
														{shallow: true, scroll: false}
													);
												}}
											>
												<MdAdd size={18} color='#fff' />
											</Button>
											<Button
												primary
												small
												w_fit
												rounded_4
												onClick={() => {
													router.replace(
														{
															pathname: router.pathname,
															query: {
																...router.query,
																_action: 'update-location',
															},
														},
														undefined,
														{shallow: true, scroll: false}
													);
												}}
											>
												<MdOutlineRotateRight size={18} color='#fff' />
											</Button>
										</div>
									)}

									{/* Hiển thị nút delete các phần tử đã chọn */}
									{calculateDimensions(draggedElements, numCols).numColumns == 1 &&
									calculateDimensions(draggedElements, numCols).numRows == 1 ? null : (
										<div
											className={styles.delete_dragged}
											onClick={() => {
												setSelectedElements([]);
												setDraggedElements && setDraggedElements([]);
											}}
										>
											<IoClose color='#fff' size={20} />
										</div>
									)}
								</div>
							</div>
						)}

						{/* Đè lớp boxDisabled lên các kho có sẵn */}
						{isFirstItemDisabled && (
							<div
								className={styles.box_disabled}
								style={{
									width: `${80 * storage.col}px`,
									height: `${80 * storage.row}px`,
									backgroundColor: storage ? storage.background : 'rgb(22, 219, 204)',
								}}
							>
								<div className={styles.storage}>
									{calculateDimensions(storage.arrayPostion, numCols).numColumns == 1 &&
									calculateDimensions(storage.arrayPostion, numCols).numRows == 1 ? null : (
										<>
											<h4 className={styles.name_storage}>{storage.name}</h4>
											<h3 className={styles.name_storage}>{convertCoin(storage.amountBdmt)} BDMT</h3>
										</>
									)}

									{isUpdate && (
										<Tippy content='Chỉnh sửa'>
											<div
												className={styles.btn_edit}
												onClick={() => {
													router.replace(
														{
															pathname: router.pathname,
															query: {
																...router.query,
																_action: 'update-storage',
																_uuidStorage: storage.uuid,
															},
														},
														undefined,
														{shallow: true, scroll: false}
													);
												}}
											>
												<Image alt='icon edit' src={icons.icon_edit} width={24} height={24} />
											</div>
										</Tippy>
									)}
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default GridTemplateWarehouse;
