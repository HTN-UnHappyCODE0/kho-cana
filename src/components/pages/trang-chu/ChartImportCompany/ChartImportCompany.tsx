import React, {useState} from 'react';

import {PropsChartImportCompany} from './interfaces';
import styles from './ChartImportCompany.module.scss';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import SelectFilterOption from '../SelectFilterOption';
import SelectFilterDate from '../SelectFilterDate';
import {useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_CUSTOMER,
	TYPE_CUSTOMER,
	TYPE_DATE,
	TYPE_DATE_SHOW,
	TYPE_SHOW_BDMT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import batchBillServices from '~/services/batchBillServices';
import moment from 'moment';
import {convertWeight, timeSubmit} from '~/common/funcs/optionConvert';
import customerServices from '~/services/customerServices';
import storageServices from '~/services/storageServices';

function ChartImportCompany({}: PropsChartImportCompany) {
	const [isShowBDMT, setIsShowBDMT] = useState<string>(String(TYPE_SHOW_BDMT.MT));
	const [customerUuid, setCustomerUuid] = useState<string>('');
	const [storageUuid, setStorageUuid] = useState<string>('');
	const [typeDate, setTypeDate] = useState<number | null>(TYPE_DATE.LAST_7_DAYS);
	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>(null);

	const [dataChart, setDataChart] = useState<any[]>([]);
	const [productTypes, setProductTypes] = useState<any[]>([]);
	const [dataTotal, setDataTotal] = useState<{
		totalWeight: number;
		lstProductTotal: {
			name: string;
			colorShow: string;
			weightMT: number;
		}[];
	}>({
		totalWeight: 0,
		lstProductTotal: [],
	});

	const listStorage = useQuery([QUERY_KEY.dropdown_bai], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					warehouseUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang_nhap], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					partnerUUid: '',
					userUuid: '',
					status: STATUS_CUSTOMER.HOP_TAC,
					typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
					provinceId: '',
					specUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	useQuery([QUERY_KEY.thong_ke_tong_hang_nhap, customerUuid, storageUuid, isShowBDMT, date], {
		queryFn: () =>
			httpRequest({
				isData: true,
				http: batchBillServices.dashbroadBillIn({
					partnerUuid: '',
					customerUuid: customerUuid,
					isShowBDMT: Number(isShowBDMT),
					storageUuid: storageUuid,
					warehouseUuid: '',
					companyUuid: '',
					typeFindDay: 0,
					timeStart: timeSubmit(date?.from)!,
					timeEnd: timeSubmit(date?.to, true)!,
				}),
			}),
		onSuccess({data}) {
			// Convert data chart
			const dataConvert = data?.lstProductDay?.map((v: any) => {
				const date =
					data?.typeShow == TYPE_DATE_SHOW.HOUR
						? moment(v?.timeScale).format('HH:mm')
						: data?.typeShow == TYPE_DATE_SHOW.DAY
						? moment(v?.timeScale).format('DD/MM')
						: data?.typeShow == TYPE_DATE_SHOW.MONTH
						? moment(v?.timeScale).format('MM-YYYY')
						: moment(v?.timeScale).format('YYYY');

				const obj = v?.productDateWeightUu?.reduce((acc: any, item: any) => {
					acc[item.productTypeUu.name] = item.weightMT;

					return acc;
				}, {});

				return {
					name: date,
					...obj,
				};
			});

			// Convert bar chart
			const productColors = data?.lstProductDay
				?.flatMap((item: any) =>
					item.productDateWeightUu.map((product: any) => ({
						name: product.productTypeUu.name,
						color: product.productTypeUu.colorShow,
					}))
				)
				.reduce((acc: any, {name, color}: {name: string; color: string}) => {
					if (!acc[name]) {
						acc[name] = color;
					}
					return acc;
				}, {});

			const productTypes = Object.keys(productColors).map((key) => ({
				key,
				fill: productColors[key],
			}));

			setDataChart(dataConvert);
			setProductTypes(productTypes);
			setDataTotal({
				totalWeight: data?.totalWeight,
				lstProductTotal: data?.lstProductTotal?.map((v: any) => ({
					name: v?.productTypeUu?.name,
					colorShow: v?.productTypeUu?.colorShow,
					weightMT: v?.weightMT,
				})),
			});
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Biểu đồ thống kê hàng nhập</h3>
				<div className={styles.filter}>
					<SelectFilterOption
						isShowAll={false}
						uuid={isShowBDMT}
						setUuid={setIsShowBDMT}
						listData={[
							{
								uuid: String(TYPE_SHOW_BDMT.MT),
								name: 'Tấn tươi',
							},
							{
								uuid: String(TYPE_SHOW_BDMT.BDMT),
								name: 'Tấn khô',
							},
						]}
						placeholder='Tấn hàng'
					/>
					<SelectFilterOption
						uuid={customerUuid}
						setUuid={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả nhà cung cấp'
					/>
					<SelectFilterOption
						uuid={storageUuid}
						setUuid={setStorageUuid}
						listData={listStorage?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả bãi'
					/>
					<SelectFilterDate isOptionDateAll={true} date={date} setDate={setDate} typeDate={typeDate} setTypeDate={setTypeDate} />
				</div>
			</div>
			<div className={styles.head_data}>
				<p className={styles.data_total}>
					Tổng khối lượng nhập hàng: <span>{convertWeight(dataTotal?.totalWeight)}</span>
				</p>
				{dataTotal?.lstProductTotal?.map((v, i) => (
					<div key={i} className={styles.data_item}>
						<div style={{background: v?.colorShow}} className={styles.box_color}></div>
						<p className={styles.data_total}>
							{v?.name}: <span style={{color: '#171832'}}>{convertWeight(v?.weightMT)}</span>
						</p>
					</div>
				))}
			</div>
			<div className={styles.main_chart}>
				<ResponsiveContainer width='100%' height='100%'>
					<BarChart
						width={500}
						height={300}
						data={dataChart}
						margin={{
							top: 8,
							right: 8,
							left: 24,
							bottom: 8,
						}}
						barSize={24}
					>
						<XAxis dataKey='name' scale='point' padding={{left: 40, right: 10}} />
						<YAxis domain={[0, 4000000]} tickFormatter={(value): any => convertWeight(value)} />
						<Tooltip formatter={(value): any => convertWeight(Number(value))} />
						<CartesianGrid strokeDasharray='3 3' vertical={false} />
						{productTypes.map((v, i) => (
							<Bar key={i} dataKey={v?.key} stackId='product_type' fill={v?.fill} />
						))}
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default ChartImportCompany;
