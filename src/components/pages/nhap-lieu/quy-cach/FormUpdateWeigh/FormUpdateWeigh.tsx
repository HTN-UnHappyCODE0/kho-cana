import React, {useState} from 'react';

import {PropsFormUpdateWeigh} from './interfaces';
import styles from './FormUpdateWeigh.module.scss';
import Button from '~/components/common/Button';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_BATCH, TYPE_DATE} from '~/constants/config/enum';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import GridColumn from '~/components/layouts/GridColumn';

function FormUpdateWeigh({onClose}: PropsFormUpdateWeigh) {
	const router = useRouter();
	const {_keywordForm, _customerWeighUuid, _dateFromWeigh, _dateToWeigh, _time} = router.query;

	const [dataCheckWeigh, setDataCheckWeigh] = useState<string>();

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					partnerUUid: '',
					userUuid: '',
					status: null,
					typeCus: null,
					provinceId: '',
					specUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const options = Array.from({length: 10}, (_, index) => ({
		id: `option-${index + 1}`,
		label: `Option ${index + 1}`,
	}));

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h4 className={styles.title}>Cập nhật quy cách theo cân mẫu</h4>
				<div className={styles.btn}>
					<Button rounded_8 w_fit p_8_16 light_outline bold onClick={onClose}>
						Hủy bỏ
					</Button>

					<Button rounded_8 w_fit p_8_16 bold>
						Xác nhận
					</Button>
				</div>
			</div>
			<div className={styles.line}></div>
			<div className={styles.form}>
				<div className={styles.header_form}>
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search keyName='_keywordForm' placeholder='Tìm kiếm theo phiên làm việc' />
						</div>

						<FilterCustom
							isSearch
							name='Khách hàng'
							query='_customerWeighUuid'
							listFilter={listCustomer?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>

						<div className={styles.filter}>
							<DateRangerCustom
								titleTime='Thời gian'
								typeDateDefault={TYPE_DATE.TODAY}
								keyDateForm='_dateFromWeigh'
								keyDateTo='_dateToWeigh'
								keyTypeDate='_time'
							/>
						</div>
					</div>
				</div>
				<div className={styles.table_option}>
					{options.map((option, index) => (
						<label key={option.id} className={styles.option}>
							<input
								id={option.id}
								className={styles.input_radio}
								type='radio'
								name='check_weigh'
								value={option.id}
								onChange={() => setDataCheckWeigh(option.id)}
							/>
							<label htmlFor={option.id} className={styles.infor_check}>
								<GridColumn col_3>
									<div className={styles.item}>
										<p>Mẫu làm việc:</p>
										<p style={{color: '#2D74FF'}}>85224</p>
									</div>
									<div className={styles.item}>
										<p>Ngày phân tích:</p>
										<p>26/10/2024</p>
									</div>
									<div className={styles.item}>
										<p>Khách hàng:</p>
										<p></p>
									</div>
									<div className={styles.item}>
										<p>Nhập từ ngày:</p>
										<p></p>
									</div>
									<div className={styles.item}>
										<p>Tên tàu:</p>
										<p></p>
									</div>
									<div className={styles.item}>
										<p>Quy cách:</p>
										<p></p>
									</div>
									<div className={styles.item}>
										<p>Số khay:</p>
										<p></p>
									</div>
									<div className={styles.item}>
										<p>Lệnh nhập:</p>
										<p></p>
									</div>
								</GridColumn>
								<div className={styles.line_stroke}>
									<p></p>
								</div>
								<GridColumn col_3>
									<div className={styles.item}>
										<p>STT:</p>
										<p></p>
									</div>
								</GridColumn>
							</label>
						</label>
					))}
				</div>
			</div>
		</div>
	);
}

export default FormUpdateWeigh;
