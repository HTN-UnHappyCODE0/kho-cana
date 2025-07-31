import React, {useState} from 'react';

import {PropsFormUpdateShipBill} from './interfaces';
import styles from './FormUpdateShipBill.module.scss';
import clsx from 'clsx';
import {GrSearch} from 'react-icons/gr';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import shipServices from '~/services/shipServices';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import batchBillServices from '~/services/batchBillServices';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';

function FormUpdateShipBill({uuid, onClose}: PropsFormUpdateShipBill) {
	const queryClient = useQueryClient();

	const [keyword, setKeyword] = useState<string>('');
	const [shipUuid, setShipUuid] = useState<string>('');

	const {data: listShip = []} = useQuery<
		{
			code: string;
			licensePlate: string;
			uuid: string;
		}[]
	>([QUERY_KEY.dropdown_ma_tau], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: shipServices.listShip({
					page: 1,
					pageSize: 200,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcUpdateShipBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật tàu trung chuyển thành công!',
				http: batchBillServices.updateShipTemp({
					uuid: uuid!,
					shipUuid: shipUuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.table_lenh_can_tat_ca]);
				queryClient.invalidateQueries([QUERY_KEY.table_lenh_can_nhap]);
				queryClient.invalidateQueries([QUERY_KEY.table_lenh_can_xuat]);
				queryClient.invalidateQueries([QUERY_KEY.table_lenh_can_dich_vu]);
				queryClient.invalidateQueries([QUERY_KEY.table_lenh_can_chuyen_kho]);
				queryClient.invalidateQueries([QUERY_KEY.table_lenh_can_xuat_thang]);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_lenh_can]);

				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_tat_ca]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_xuat_thang]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_xuat]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_nhap]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_dich_vu]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_chuyen_kho]);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_phieu_can]);
				onClose();
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const handleSubmit = () => {
		if (!uuid) {
			return toastWarn({msg: 'Không tìm thấy lệnh/phiếu cân!'});
		}
		if (!shipUuid) {
			return toastWarn({msg: 'Chọn tàu trung chuyển!'});
		}

		return funcUpdateShipBill.mutate();
	};

	return (
		<div className={styles.mainPopup}>
			<Loading loading={funcUpdateShipBill.isLoading} />
			<h4 className={styles.title}>Thêm tàu trung chuyển</h4>
			<p className={styles.des}>Vui lòng chọn một hoặc nhiều tàu trung chuyển</p>
			<div className={clsx(styles.input)}>
				<div className={styles.icon}>
					<GrSearch color='#3f4752' size={16} />
				</div>
				<input
					value={keyword}
					type='text'
					name='keyword'
					placeholder='Tìm kiếm tên hoặc mã'
					onChange={(e) => setKeyword(e.target.value)}
					autoComplete='off'
				/>
			</div>
			<div className={styles.list}>
				{listShip?.filter(
					(v) =>
						removeVietnameseTones(v.licensePlate)?.includes(keyword ? removeVietnameseTones(keyword) : '') ||
						removeVietnameseTones(v.code)?.includes(keyword ? removeVietnameseTones(keyword) : '')
				)?.length > 0 ? (
					<>
						{listShip
							?.filter(
								(v) =>
									removeVietnameseTones(v.licensePlate)?.includes(keyword ? removeVietnameseTones(keyword) : '') ||
									removeVietnameseTones(v.code)?.includes(keyword ? removeVietnameseTones(keyword) : '')
							)
							?.map((v, i) => (
								<div key={i} className={styles.option}>
									<input
										id={`check_item_${i}`}
										type='checkbox'
										className={clsx(styles.checkbox)}
										onChange={() => {
											setShipUuid(v?.uuid);
										}}
										checked={v.uuid == shipUuid}
									/>
									<label htmlFor={`check_item_${i}`} className={clsx(styles.label_check_item)}>
										{v?.licensePlate} - {v.code}
									</label>
								</div>
							))}
					</>
				) : (
					<div className={styles.empty}>
						<Image alt='icon empty' src={icons.iconEmpty} width={100} height={100} />
						<p>Danh sách tàu đang trống!</p>
					</div>
				)}
			</div>
			<div className={styles.control}>
				<div>
					<Button p_8_24 rounded_2 grey_outline onClick={onClose}>
						Hủy bỏ
					</Button>
				</div>
				<div>
					<Button disable={!shipUuid} p_8_24 rounded_2 primary onClick={handleSubmit}>
						Đồng ý
					</Button>
				</div>
			</div>

			<div className={styles.icon_close} onClick={onClose}>
				<IoClose size={24} color='#23262F' />
			</div>
		</div>
	);
}

export default FormUpdateShipBill;
