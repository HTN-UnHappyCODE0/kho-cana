import React from 'react';

import {PropsFormReasonUpdateSpec} from './interfaces';
import styles from './FormReasonUpdateSpec.module.scss';
import {IoHelpCircleOutline} from 'react-icons/io5';
import clsx from 'clsx';
import Button from '~/components/common/Button';

function FormReasonUpdateSpec({onClose, onSubmit}: PropsFormReasonUpdateSpec) {
	return (
		<div className={clsx('effectZoom', styles.popup)}>
			<div className={styles.iconWarn}>
				<IoHelpCircleOutline />
			</div>
			{/* <p className={styles.note}>Đang có chí tiêu lớn hơn khối lượng cân mẫu</p> */}
			<p className={styles.note}>
				<p style={{fontSize: '700', color: '#E93A3A'}}>Đang có chí tiêu lớn hơn khối lượng cân mẫu.</p> Bạn có chắc chắn muốn cập
				nhật quy cách này không?
			</p>
			<div className={clsx('mt')}>
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

export default FormReasonUpdateSpec;
