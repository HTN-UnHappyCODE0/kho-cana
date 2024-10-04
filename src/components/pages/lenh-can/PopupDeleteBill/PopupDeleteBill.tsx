import React, {useState} from 'react';
import {IFormDeleteBill, PropsPopupDeleteBill} from './interfaces';
import styles from './PopupDeleteBill.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import Form, {FormContext} from '~/components/common/Form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import TextArea from '~/components/common/Form/components/TextArea';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import {IoHelpCircleOutline} from 'react-icons/io5';
import batchBillServices from '~/services/batchBillServices';

function PopupDeleteBill({uuid, onClose}: PropsPopupDeleteBill) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormDeleteBill>({
		description: '',
	});

	const funcDeleteBatchBill = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Hủy lệnh cân thành công!',
				http: batchBillServices.deleteBatchBill({
					uuid: uuid as string,
					description: form.description,
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
				onClose();
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const handleSubmit = () => {
		return funcDeleteBatchBill.mutate();
	};

	return (
		<div className={clsx('effectZoom', styles.popup)}>
			<Loading loading={funcDeleteBatchBill.isLoading} />
			<div className={styles.iconWarn}>
				<IoHelpCircleOutline />
			</div>

			<p className={styles.note}>{'Bạn chắc chắn muốn hủy phiếu cân hiện tại?'}</p>
			<div className={clsx('mt')}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<TextArea isRequired name='description' max={5000} blur placeholder='Nhập lý do hủy phiếu' />
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

export default PopupDeleteBill;
