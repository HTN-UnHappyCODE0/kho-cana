import React from 'react';
import Slider from 'react-slick';
import {PropsSliderDebt} from './interfaces';
import styles from './SliderDebt.module.scss';
import {ArrowLeft2, ArrowRight2} from 'iconsax-react';
import Image from 'next/image';
import icons from '~/constants/images/icons';

function SampleNextArrow(props: any) {
	const {onClick} = props;
	return (
		<div className={styles.next} onClick={onClick}>
			<ArrowRight2 size={18} />
		</div>
	);
}

function SamplePrevArrow(props: any) {
	const {onClick} = props;
	return (
		<div className={styles.prev} onClick={onClick}>
			<ArrowLeft2 size={18} />
		</div>
	);
}

function SliderDebt({listImage = []}: PropsSliderDebt) {
	return (
		<div className={styles.container}>
			{listImage?.length > 0 ? (
				<Slider
					slidesToShow={1}
					infinite={false}
					nextArrow={<SampleNextArrow />}
					prevArrow={<SamplePrevArrow />}
					dots={true}
					className={styles.main_slider}
				>
					{listImage?.map((v, index) => (
						<div className={styles.container_image} key={index}>
							<Image
								src={`${process.env.NEXT_PUBLIC_IMAGE}${v}`}
								alt='image slider'
								layout='fill'
								objectFit='contain'
								className={styles.image}
							/>
						</div>
					))}
				</Slider>
			) : (
				<div className={styles.empty}>
					<Image src={icons.emptyFile} alt='image empty' className={styles.icon} />
					<p>Tệp đính kèm trống!</p>
				</div>
			)}
		</div>
	);
}

export default SliderDebt;
