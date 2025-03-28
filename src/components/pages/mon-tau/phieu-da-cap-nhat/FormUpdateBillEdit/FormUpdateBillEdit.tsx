import React, {useEffect, useRef, useState} from 'react';

import {PropsFormUpdateBillEdit} from './interfaces';
import styles from './FormUpdateBillEdit.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import wareServices from '~/services/wareServices';
import {httpRequest} from '~/services';
import weightSessionServices from '~/services/weightSessionServices';
import Loading from '~/components/common/Loading';
import criteriaServices from '~/services/criteriaServices';
import {toastWarn} from '~/common/funcs/toast';
import clsx from 'clsx';
import Popup from '~/components/common/Popup';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import FormReasonUpdateSpec from '~/components/pages/nhap-lieu/quy-cach/FormReasonUpdateSpec';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import uploadImageService from '~/services/uploadService';
import batchBillServices from '~/services/batchBillServices';

function FormUpdateBillEdit({dataUpdate, onClose}: PropsFormUpdateBillEdit) {
	const queryClient = useQueryClient();

	const [loading, setLoading] = useState<boolean>(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [images, setImages] = useState<any[]>([]);

	const handleKeyEnter = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
			const newIndex = event.key === 'ArrowUp' ? index - 1 : index + 1;

			if (inputRefs.current[newIndex]) {
				inputRefs.current[newIndex]?.focus();
			}
		}
		if (event.key === 'Enter' || event.keyCode === 13) {
			event.preventDefault();
			if (index === -1) {
				inputRefs.current[0]?.focus();
			} else {
				if (inputRefs.current[index + 1]) {
					inputRefs.current[index + 1]?.focus();
				} else {
					inputRefs.current[-1]?.focus();
				}
			}
		}
	};

	const [form, setForm] = useState<{codeBill: string; amountDraft: number | string; totalSample: number | string; dryness: number}>({
		codeBill: '',
		amountDraft: 0,
		totalSample: 0,
		dryness: 0,
	});

	useEffect(() => {
		setForm({
			...form,
			dryness: dataUpdate?.drynessAvg || 0,
			amountDraft: convertCoin(dataUpdate?.weightMon) || 0,
			codeBill: dataUpdate?.code || '',
		});
		setImages(
			dataUpdate?.path?.map((v: any) => ({
				file: null,
				img: v,
				path: `${process.env.NEXT_PUBLIC_IMAGE}/${v}`,
			})) || []
		);
	}, [dataUpdate]);

	const funcUpdateDraftShip = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa cập nhật mớn tàu thành công!',
				http: batchBillServices.updateWeightBillOut({
					drynessAvg: form.dryness,
					paths: body.paths,
					itemBill: [
						{
							billUuid: dataUpdate?.uuid,
							weightMon: price(form.amountDraft),
						},
					],
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_cap_nhat_phieu_da_cap_nhat]);
			}
		},
		onError(error) {
			return;
		},
	});

	const handleSubmit = async () => {
		const imgs = images?.filter((v: any) => v?.file);

		if (form.dryness < 0 || form.dryness > 100) {
			return toastWarn({msg: 'Độ khô không hợp lệ!'});
		}

		if (imgs.length > 0) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadMutilImage(images?.map((v: any) => v?.file)),
			});
			if (dataImage?.error?.code == 0) {
				return funcUpdateDraftShip.mutate({
					paths: [...images?.filter((x) => !x.file).map((v: any) => v?.img), ...dataImage?.items],
				});
			} else {
				return toastWarn({msg: 'Upload ảnh thất bại!'});
			}
		} else {
			return funcUpdateDraftShip.mutate({
				paths: images.map((v: any) => v?.img),
			});
		}
	};

	useEffect(() => {
		const totalSample = Math.round((price(form.amountDraft) * form.dryness) / 100);
		setForm((prev) => ({
			...prev,
			totalSample: isNaN(totalSample) ? 0 : convertCoin(totalSample),
		}));
	}, [form.amountDraft, form.dryness]);

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcUpdateDraftShip.isLoading} />
			<h4>Chỉnh sửa cập nhật mớn tàu</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Input
					name='codeBill'
					value={form?.codeBill || ''}
					type='text'
					placeholder='Số lô/phiếu đã chọn'
					label={<span>Số lô/phiếu đã chọn</span>}
					readOnly
				/>

				<div className={clsx('mt')}>
					<Input
						name='amountDraft'
						value={form.amountDraft || ''}
						type='text'
						unit='Kg'
						isMoney
						blur={true}
						label={
							<span>
								Khối lượng tươi theo mớn <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập khối lượng'
					/>
				</div>

				<div className={clsx('mt')}>
					<Input
						name='dryness'
						value={form.dryness || ''}
						type='number'
						unit='%'
						blur={true}
						label={
							<span>
								Độ khô <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập độ khô'
					/>
				</div>

				<div className={clsx('mt')}>
					<Input
						readOnly={true}
						name='totalSample'
						value={form.totalSample || ''}
						type='text'
						isMoney
						unit='Kg'
						blur={true}
						label={
							<span>
								Tổng lượng khô <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập khối lượng'
					/>
				</div>

				<div className='mt'>
					<div className={styles.image_upload}>
						Chọn ảnh <span style={{color: 'red'}}>*</span>
					</div>
					<UploadMultipleFile isDisableDelete={true} images={images} setImages={setImages} />
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Cập nhật
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default FormUpdateBillEdit;
