import React, {forwardRef} from 'react';

import {PropsTemplateSampleSpec} from './interfaces';
import styles from './TemplateSampleSpec.module.scss';
import icons from '~/constants/images/icons';
import ImageFill from '~/components/common/ImageFill';
import Image from 'next/image';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';

const TemplateSampleSpec = forwardRef<HTMLDivElement, PropsTemplateSampleSpec>(({}, ref) => {
	const {infoUser} = useSelector((state: RootState) => state.user);

	return (
		<div ref={ref} className={styles.container}>
			<div className={styles.header}>
				<div className={styles.box_logo}>
					<ImageFill src={icons.logo} className={styles.logo_icon} alt='Logo' />
					<div className={styles.info}>
						<h4>Công ty cổ phần cảng Thái Hưng</h4>
						<p>Tổ 2 - Khu 6C - Phường Hồng Hải - TP Hạ Long - Quảng Ninh</p>
						<p>Tel/Fax: 0203.657.9887 - Email: cangthaihung@gmail.com</p>
					</div>
				</div>
			</div>
			<div className={styles.watermark_logo}>
				<div className={styles.logo_mark}>
					<Image src={icons.logo} className={styles.logo_mark_icon} alt='Logo' />
				</div>
			</div>
			<div className={styles.content}>
				<h3>Chứng nhận giám định về độ khô</h3>

				<p>
					Tên khách hàng: <span>Bình An</span>
				</p>
				<p>
					Tên hàng: <span>Dăm gỗ</span>
				</p>
				<p>
					Khối lượng tươi: <span>121.34</span> (tấn)
				</p>
				<p>
					Khối lượng khô: <span>60.86</span> (tấn)
				</p>
				<p>
					Số lượng mẫu: <span>3</span> (mẫu)
				</p>

				<h3 style={{marginTop: '24px'}}>Kết quả phân tích</h3>
				<p>
					Mẫu hàng được phân tích tại phòng phân tích của <b>Công ty công phần cảng Thái Hưng</b>. <br />
					Kết quả như sau:
				</p>

				<div className={styles.table}>
					<table>
						<thead>
							<tr>
								<th>STT</th>
								<th>Ngày nhập</th>
								<th>Số phiếu</th>
								<th>Biển số xe</th>
								<th>Khối lượng tươi (tấn)</th>
								<th>Độ khô (%)</th>
								<th>Khối lượng khô (tấn)</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>1</td>
								<td>1/12/2024</td>
								<td>25</td>
								<td>98C 35431</td>
								<td>42.27</td>
								<td>48.32</td>
								<td>20.42</td>
							</tr>
							<tr>
								<td>2</td>
								<td>1/12/2024</td>
								<td>42</td>
								<td>98C 01159</td>
								<td>36.96</td>
								<td>51.53</td>
								<td>19.05</td>
							</tr>
							<tr>
								<td>3</td>
								<td>1/12/2024</td>
								<td>57</td>
								<td>98C 35431</td>
								<td>42.11</td>
								<td>50.80</td>
								<td>21.39</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p style={{marginTop: '20px'}}>
					Điểm giám định: <b>Tại Công ty công phần cảng Thái Hưng</b> - Phòng phân tích.
				</p>
				<div className={styles.grid} style={{marginTop: '60px'}}>
					<div></div>
					<div className={styles.sign}>
						<h3>Phân tích viên</h3>
						<p>{infoUser?.fullname}</p>
					</div>
				</div>
			</div>
		</div>
	);
});

TemplateSampleSpec.displayName = 'TemplateSampleSpec';

export default TemplateSampleSpec;
