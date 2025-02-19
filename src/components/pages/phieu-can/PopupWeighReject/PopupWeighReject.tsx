import React, {useState} from 'react';
import {PropsPopupWeighReject} from './interfaces';
import styles from './PopupWeighReject.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import Form, {FormContext, Input} from '~/components/common/Form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import batchBillServices from '~/services/batchBillServices';
import {price} from '~/common/funcs/convertCoin';
import {toastWarn} from '~/common/funcs/toast';

function PopupWeighReject({uuid, onClose}: PropsPopupWeighReject) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{amountImpurities: number}>({
		amountImpurities: 0,
	});

	const funcSuccessWeighReject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật khối lượng tạp chất thành công!',
				http: batchBillServices.updateWeighReject({
					uuid: uuid as string,
					weightReject: price(form.amountImpurities),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_tat_ca]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_nhap]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_xuat]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_dich_vu]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_chuyen_kho]);
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_can_xuat_thang]);
				queryClient.invalidateQueries([QUERY_KEY.table_ktk_duyet_san_luong]);
			}
		},
	});

	const handleSubmit = () => {
		if (price(form.amountImpurities) == 0) {
			return toastWarn({msg: 'Vui lòng nhập khối lượng tạp chất!'});
		}
		return funcSuccessWeighReject.mutate();
	};

	return (
		<div className={clsx('effectZoom', styles.popup)}>
			<Loading loading={funcSuccessWeighReject.isLoading} />
			{/* <div className={styles.iconWarn}>
				<IoHelpCircleOutline />
			</div> */}

			<p className={styles.note}>Cập nhật khối lượng tạp chất</p>
			<div className={clsx('mt')}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<div className='mt'>
						<Input
							name='amountImpurities'
							value={form.amountImpurities || 0}
							isMoney
							type='text'
							unit='KG'
							blur={true}
							placeholder='Khối lượng tạp chất'
							label={
								<span>
									Khối lượng tạp chất<span style={{color: 'red'}}> *</span>
								</span>
							}
						/>
					</div>
					<div className={styles.groupBtnPopup}>
						<Button p_10_24 grey_2 rounded_8 bold onClick={onClose} maxContent>
							Đóng
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 primary bold rounded_8 onClick={handleSubmit} maxContent>
									Xác nhận
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</Form>
			</div>
		</div>
	);
}

export default PopupWeighReject;
