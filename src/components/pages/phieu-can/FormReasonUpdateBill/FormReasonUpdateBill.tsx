import React from 'react';

import {PropsFormReasonUpdateBill} from './interfaces';
import styles from './FormReasonUpdateBill.module.scss';
import {IoHelpCircleOutline} from 'react-icons/io5';
import clsx from 'clsx';
import TextArea from '~/components/common/Form/components/TextArea';
import Button from '~/components/common/Button';

function FormReasonUpdateBill({onClose, onSubmit}: PropsFormReasonUpdateBill) {
	return (
		<div className={clsx('effectZoom', styles.popup)}>
			<div className={styles.iconWarn}>
				<IoHelpCircleOutline />
			</div>

			<p className={styles.note}>Bạn có muốn thay đổi thông tin phiếu này không?</p>
			<div className={clsx('mt')}>
				<TextArea name='reason' max={5000} blur placeholder='Nhập lý do thay đổi' />
				<div className={styles.groupBtnPopup}>
					<Button p_10_24 grey_2 rounded_8 bold maxContent onClick={onClose}>
						Đóng
					</Button>
					<Button p_10_24 primary bold rounded_8 maxContent onClick={onSubmit}>
						Xác nhận
					</Button>
				</div>
			</div>
		</div>
	);
}

export default FormReasonUpdateBill;
