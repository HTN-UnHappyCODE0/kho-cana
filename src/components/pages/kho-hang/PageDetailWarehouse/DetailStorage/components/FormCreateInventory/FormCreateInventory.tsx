import React, {useEffect, useState} from 'react';
import {PropsFormCreateInventory} from './interfaces';
import styles from './FormCreateInventory.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import clsx from 'clsx';
import TextArea from '~/components/common/Form/components/TextArea';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {useRouter} from 'next/router';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import storageServices from '~/services/storageServices';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import uploadImageService from '~/services/uploadService';
import {price} from '~/common/funcs/convertCoin';

function FormCreateInventory({onClose, nameStorage}: PropsFormCreateInventory) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [images, setImages] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const [form, setForm] = useState<{
		nameStorage: string;
		decription: string;
		amountKcs: number;
		dryness: number;
	}>({
		nameStorage: nameStorage || '',
		decription: '',
		amountKcs: 0,
		dryness: 0,
	});

	const fucnInventoryStorage = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Kiểm kê bãi thành công!',
				http: storageServices.inventoryStorage({
					uuid: _id as string,
					path: body.paths,
					description: form.decription,
					amountKcs: price(form.amountKcs),
					dryness: Number(form.dryness),
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					nameStorage: '',
					decription: '',
					amountKcs: 0,
					dryness: 0,
				});
				setImages([]);
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_bai]);
				queryClient.invalidateQueries([QUERY_KEY.table_kiem_ke_bai]);
				queryClient.invalidateQueries([QUERY_KEY.table_khach_hang_bai]);
				queryClient.invalidateQueries([QUERY_KEY.table_lich_su_bai]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		const imgs = images?.map((v: any) => v?.file);

		if (imgs.length == 0) {
			return toastWarn({msg: 'Vui lòng chọn ảnh!'});
		}

		if ((!!form.amountKcs && form.dryness < 0) || form.dryness > 100) {
			return toastWarn({msg: 'Độ khô không hợp lệ!'});
		}

		const dataImage = await httpRequest({
			setLoading,
			isData: true,
			http: uploadImageService.uploadMutilImage(imgs),
		});

		if (dataImage?.error?.code == 0) {
			return fucnInventoryStorage.mutate({
				paths: dataImage.items,
			});
		} else {
			return toastWarn({msg: 'Upload ảnh thất bại!'});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnInventoryStorage.isLoading || loading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.wrapper}>
					<h4>Kiểm kê</h4>
					<div className={clsx(styles.main_form)}>
						<Input
							name='nameStorage'
							isRequired
							value={form.nameStorage || ''}
							readOnly={true}
							min={5}
							max={255}
							type='text'
							blur={true}
							placeholder='Chọn kho bãi'
							label={
								<span>
									Kho bãi <span style={{color: 'red'}}> *</span>
								</span>
							}
						/>

						<Input
							name='amountKcs'
							value={form.amountKcs || ''}
							type='text'
							isMoney
							unit='MT'
							placeholder='Nhập khối lượng còn lại'
							label={<span>Khối lượng còn lại</span>}
						/>

						<Input
							name='dryness'
							value={form.dryness || ''}
							readOnly={!form.amountKcs}
							unit='%'
							type='number'
							blur={true}
							placeholder='Nhập độ khô'
							label={<span>Độ khô</span>}
						/>

						<div className={clsx('mt')}>
							<TextArea
								max={5000}
								placeholder='Thêm mô tả'
								name='decription'
								label={
									<span>
										Mô tả <span style={{color: 'red'}}> *</span>
									</span>
								}
								blur={true}
							/>
						</div>

						<div className='mt'>
							<div className={styles.image_upload}>
								Chọn ảnh <span style={{color: 'red'}}> *</span>
							</div>
							<UploadMultipleFile images={images} setImages={setImages} />
						</div>
					</div>

					<div className={styles.control}>
						<div>
							<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<FormContext.Consumer>
								{({isDone}) => (
									<Button disable={!isDone} p_10_24 rounded_2 primary>
										Xác nhận
									</Button>
								)}
							</FormContext.Consumer>
						</div>
					</div>
				</div>
			</Form>

			<div className={styles.close} onClick={onClose}>
				<IoClose />
			</div>
		</div>
	);
}

export default FormCreateInventory;
