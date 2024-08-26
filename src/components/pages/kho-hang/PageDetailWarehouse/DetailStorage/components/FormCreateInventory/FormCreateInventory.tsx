import React, {useState} from 'react';
import {PropsFormCreateInventory} from './interfaces';
import styles from './FormCreateInventory.module.scss';
import Form, {Input} from '~/components/common/Form';
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

function FormCreateInventory({onClose, nameStorage}: PropsFormCreateInventory) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [images, setImages] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const [form, setForm] = useState<{
		nameStorage: string;
		decription: string;
	}>({
		nameStorage: nameStorage || '',
		decription: '',
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
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					nameStorage: '',
					decription: '',
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
			<h4>Kiểm kê</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Input
					name='nameStorage'
					isRequired
					value={form.nameStorage || ''}
					readOnly
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
					<UploadMultipleFile images={images} setImages={setImages} />
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<Button p_10_24 rounded_2 primary>
							Cập nhật
						</Button>
					</div>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default FormCreateInventory;
