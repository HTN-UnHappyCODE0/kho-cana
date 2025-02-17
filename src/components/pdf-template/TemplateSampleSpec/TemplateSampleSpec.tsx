import React, {forwardRef} from 'react';
import {PropsTemplateSampleSpec} from './interfaces';
import styles from './TemplateSampleSpec.module.scss';
import icons from '~/constants/images/icons';
import ImageFill from '~/components/common/ImageFill';
import Image from 'next/image';
import Moment from 'react-moment';
import {convertWeight} from '~/common/funcs/optionConvert';

const TemplateSampleSpec = forwardRef<HTMLDivElement, PropsTemplateSampleSpec>(
	({customerName, countSample, listBill, TypeQuality = false}, ref) => {
		return (
			<div ref={ref} className={styles.container}>
				<div className={styles.header}>
					<div className={styles.box_logo}>
						<ImageFill src={icons.logo} className={styles.logo_icon} alt='Logo' />

						{TypeQuality == true && (
							<div className={styles.info}>
								<h4>CÔNG TY TNHH TRIỀU AN QN</h4>
								<p>Tổ 2 - Khu 6C - Phường Hồng Hải - Thành phố Hạ Long - Tỉnh Quảng Ninh</p>
								{/* <p>Tel/Fax: 0203.657.9887 - Email: cangthaihung@gmail.com</p> */}
							</div>
						)}
						{TypeQuality == false && (
							<div className={styles.info}>
								<h4>Công ty cổ phần cảng Thái Hưng</h4>
								<p>Tổ 2 - Khu 6C - Phường Hồng Hải - TP Hạ Long - Quảng Ninh</p>
								<p>Tel/Fax: 0203.657.9887 - Email: cangthaihung@gmail.com</p>
							</div>
						)}
					</div>
				</div>
				<div className={styles.watermark_logo}>
					<div className={styles.logo_mark}>
						<Image src={icons.logo} className={styles.logo_mark_icon} alt='Logo' />
					</div>
				</div>
				<div className={styles.content}>
					<h3>Chứng nhận giám định về độ khô</h3>
					<div className={styles.item}>
						<p>Tên khách hàng:</p>
						<p>{customerName}</p>
					</div>
					<div className={styles.item}>
						<p>Tên hàng:</p>
						<p>{listBill?.[0]?.productName}</p>
					</div>
					<div className={styles.item}>
						<p>Khối lượng tươi:</p>
						<p>
							{convertWeight(listBill?.reduce((acc, item) => acc + item?.weightTotal, 0))} <span>(tấn)</span>
						</p>
					</div>
					<div className={styles.item}>
						<p>Khối lượng khô:</p>
						<p>
							{convertWeight(listBill?.reduce((acc, item) => acc + item?.weightBdmt, 0))} <span>(tấn)</span>
						</p>
					</div>
					<div className={styles.item}>
						<p>Số lượng mẫu:</p>
						<p>
							{countSample || 0} <span>(mẫu)</span>
						</p>
					</div>

					<h3 style={{marginTop: '24px'}}>Kết quả phân tích</h3>
					<p>
						Mẫu hàng được phân tích tại phòng phân tích của <b>Công ty cổ phần cảng Thái Hưng</b>. <br />
						Kết quả như sau:
					</p>

					<div className={styles.table}>
						<table>
							<thead>
								<tr>
									<th>STT</th>
									<th>Ngày nhập</th>
									<th>Số phiếu</th>
									<th>Số xe/Tàu</th>
									<th>Khối lượng tươi (tấn)</th>
									<th>Độ khô (%)</th>
									<th>Khối lượng khô (tấn)</th>
								</tr>
							</thead>
							<tbody>
								{listBill?.map((v, i) => (
									<tr key={v?.uuid}>
										<td>{i + 1}</td>
										<td>
											<Moment date={v?.date} format='DD/MM/YYYY' />
										</td>
										<td>{v?.code}</td>
										<td>{v?.licensePalate || '---'}</td>
										<td>{convertWeight(v?.weightTotal)}</td>
										<td>{v?.drynessAvg?.toFixed(2)}</td>
										<td>{convertWeight(v?.weightBdmt)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<p style={{marginTop: '20px'}}>
						Điểm giám định: <b>Tại Công ty cổ phần cảng Thái Hưng</b> - Phòng phân tích.
					</p>
					<div className={styles.grid} style={{marginTop: '60px'}}>
						<div></div>
						<div className={styles.sign}>
							<h3>Phân tích viên</h3>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

TemplateSampleSpec.displayName = 'TemplateSampleSpec';

export default TemplateSampleSpec;
