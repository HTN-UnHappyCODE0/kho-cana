import React, {useEffect, useState} from 'react';
import {PropsUploadMultipleFilePDF} from './interfaces';
import styles from './UploadMultipleFilePDF.module.scss';
import Image from 'next/image';
import {IoClose} from 'react-icons/io5';
import {AddCircle} from 'iconsax-react';
import clsx from 'clsx';
import {toastError, toastWarn} from '~/common/funcs/toast';
import icons from '~/constants/images/icons';

type FileItem = {
	url: string;
	file: File;
};

function UploadMultipleFilePDF({images = [], setImages, isDisableDelete = false}: PropsUploadMultipleFilePDF) {
	const handleFileChange = (event: any) => {
		const files = event.target.files;
		const newFiles: any = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const url = URL.createObjectURL(file);
			newFiles.push({url, file, type: file.type});
		}

		setImages((prevImages: any) => [...prevImages, ...newFiles]);
	};

	const handleDelete = (index: number) => {
		setImages((prevImages: any) => {
			URL.revokeObjectURL(prevImages[index].url);
			return [...prevImages.slice(0, index), ...prevImages.slice(index + 1)];
		});
	};

	return (
		<div className={styles.main_upload}>
			{images?.length > 0 && (
				<div className={styles.list_image}>
					{images.map((image, index) => (
						<div className={styles.box_image} key={index}>
							{image.type.includes('image') ? (
								<Image
									className={styles.image}
									src={image?.url || image?.path}
									alt='image'
									objectFit='cover'
									layout='fill'
								/>
							) : (
								<embed
									className={styles.pdf_preview}
									src={image?.url || image?.path}
									type='application/pdf'
									width='100%'
									height='100%'
								/>
							)}
							{isDisableDelete && !image?.file && !!image?.img ? null : (
								<div className={clsx(styles.delete)} onClick={() => handleDelete(index)}>
									<IoClose size={14} color='#8496AC' />
								</div>
							)}
						</div>
					))}
				</div>
			)}
			<div className={styles.upload}>
				<label className={styles.input_upload}>
					<AddCircle color='rgba(198, 201, 206, 1)' />
					<input
						hidden
						type='file'
						multiple
						accept='image/png, image/gif, image/jpeg, application/pdf'
						onClick={(e: any) => {
							e.target.value = null;
						}}
						onChange={handleFileChange}
					/>
				</label>

				<div className={styles.note_upload}>
					<p>Upload file</p>
					<p>File không vượt quá 50MB</p>
				</div>
			</div>
		</div>
	);
}

export default UploadMultipleFilePDF;
