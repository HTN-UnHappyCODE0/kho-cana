import React, {useState} from 'react';

import {PropsDashboardWarehouse} from './interfaces';
import styles from './DashboardWarehouse.module.scss';
import clsx from 'clsx';
import {ChartSquare} from 'iconsax-react';
import ItemDashboard from './components/ItemDashboard';
import ItemInfoChart from './components/ItemInfoChart';
import ChartDashboard from './components/ChartDashboard';
import Link from 'next/link';

function DashboardWarehouse({isTotal, total, productTotal, qualityTotal, specTotal, dataWarehouse}: PropsDashboardWarehouse) {
	const [arrayTypeAction, setArrayTypeAction] = useState<('product' | 'quality' | 'spec')[]>(['product', 'quality', 'spec']);

	const handleAction = (key: 'product' | 'quality' | 'spec') => {
		if (arrayTypeAction.some((v) => v == key)) {
			setArrayTypeAction(arrayTypeAction?.filter((x) => x != key));
		} else {
			setArrayTypeAction((prev) => [...prev, key]);
		}
	};

	return (
		<div className={clsx(styles.container, {[styles.isTotal]: isTotal})}>
			<div className={styles.top}>
				<div className={styles.head}>
					{isTotal && (
						<div className={styles.icon}>
							<ChartSquare size='28' color='#fff' variant='Bold' />
						</div>
					)}
					<h4 className={styles.title}>{isTotal ? 'Tổng kho Cái Lân' : dataWarehouse?.name}</h4>
				</div>
				{!isTotal && (
					<Link href={`/kho-hang/${dataWarehouse?.uuid}`} className={styles.link}>
						Chi tiết kho hàng
					</Link>
				)}
			</div>
			<div className={styles.main}>
				<div className={styles.main_item}>
					<ItemDashboard
						isTotal={isTotal}
						value={isTotal ? total?.amountMT! : dataWarehouse?.amountMT!}
						text='Tổng khối lượng kho hàng'
						background='#2D74FF'
					/>
					<ItemDashboard
						isTotal={isTotal}
						value={isTotal ? total?.amountBDMTDemo! : dataWarehouse?.amountBDMTDemo!}
						text='Khối lượng khô tạm tính (BDMT)'
						background='#FF6838'
					/>
					<ItemDashboard
						isTotal={isTotal}
						value={isTotal ? total?.amountBDMT! : dataWarehouse?.amountBDMT!}
						text='Trọng lượng khô (BDMT)'
						background='#2DA2BC'
					/>
				</div>
				<div className={styles.main_info}>
					<div className={styles.main_chart}>
						{isTotal ? (
							<ChartDashboard
								totalValueChart={total?.amountTotalBDMT!}
								dataChart={{
									productWeight: productTotal?.map((v) => ({
										name: v?.productTypeUu?.name,
										color: v?.productTypeUu?.colorShow,
										value: v?.amountBDMT,
									}))!,
									qualityWeight: qualityTotal?.map((v) => ({
										name: v?.qualityUu?.name,
										color: v?.qualityUu?.colorShow,
										value: v?.amountBDMT,
									}))!,
									specWeight: specTotal?.map((v) => ({
										name: v?.specUu?.name,
										color: v?.specUu?.colorShow,
										value: v?.amountBDMT,
									}))!,
								}}
								arrayTypeAction={arrayTypeAction}
							/>
						) : (
							<ChartDashboard
								totalValueChart={dataWarehouse?.amountTotalBDMT!}
								dataChart={{
									productWeight: dataWarehouse?.productWeight?.map((v) => ({
										name: v?.productTypeUu?.name,
										color: v?.productTypeUu?.colorShow,
										value: v?.amountBDMT,
									}))!,
									qualityWeight: dataWarehouse?.qualityWeight?.map((v) => ({
										name: v?.qualityUu?.name,
										color: v?.qualityUu?.colorShow,
										value: v?.amountBDMT,
									}))!,
									specWeight: dataWarehouse?.specWeight?.map((v) => ({
										name: v?.specUu?.name,
										color: v?.specUu?.colorShow,
										value: v?.amountBDMT,
									}))!,
								}}
								arrayTypeAction={arrayTypeAction}
							/>
						)}
					</div>
					<div className={styles.main_item_info}>
						<ItemInfoChart
							text='Loại gỗ'
							arrayData={
								isTotal
									? productTotal?.map((v) => ({
											name: v?.productTypeUu?.name,
											color: v?.productTypeUu?.colorShow,
											value: v?.amountBDMT,
									  }))!
									: dataWarehouse?.productWeight?.map((v) => ({
											name: v?.productTypeUu?.name,
											color: v?.productTypeUu?.colorShow,
											value: v?.amountBDMT,
									  }))!
							}
							keyAction='product'
							arrayTypeAction={arrayTypeAction}
							handleAction={() => handleAction('product')}
						/>
						<ItemInfoChart
							text='Quốc gia'
							arrayData={
								isTotal
									? qualityTotal?.map((v) => ({
											name: v?.qualityUu?.name,
											color: v?.qualityUu?.colorShow,
											value: v?.amountBDMT,
									  }))!
									: dataWarehouse?.qualityWeight?.map((v) => ({
											name: v?.qualityUu?.name,
											color: v?.qualityUu?.colorShow,
											value: v?.amountBDMT,
									  }))!
							}
							keyAction='quality'
							arrayTypeAction={arrayTypeAction}
							handleAction={() => handleAction('quality')}
						/>
						<ItemInfoChart
							text='Quy cách'
							arrayData={
								isTotal
									? specTotal?.map((v) => ({
											name: v?.specUu?.name,
											color: v?.specUu?.colorShow,
											value: v?.amountBDMT,
									  }))!
									: dataWarehouse?.specWeight?.map((v) => ({
											name: v?.specUu?.name,
											color: v?.specUu?.colorShow,
											value: v?.amountBDMT,
									  }))!
							}
							keyAction='spec'
							arrayTypeAction={arrayTypeAction}
							handleAction={() => handleAction('spec')}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DashboardWarehouse;
