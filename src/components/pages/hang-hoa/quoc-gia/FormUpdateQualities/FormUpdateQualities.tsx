import React, {useEffect, useState} from 'react';

import {PropsFormUpdateQualities} from './interfaces';
import styles from './FormUpdateQualities.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Loading from '~/components/common/Loading';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import {QUERY_KEY} from '~/constants/config/enum';
import {toastWarn} from '~/common/funcs/toast';
import InputColor from '~/components/common/InputColor';

function FormUpdateQualities({dataUpdateQualities, onClose}: PropsFormUpdateQualities) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{
		uuid: string;
		name: string;
		colorShow: string;
		description: string;
	}>({uuid: '', name: '', description: '', colorShow: ''});

	useEffect(() => {
		setForm({
			uuid: dataUpdateQualities?.uuid || '',
			name: dataUpdateQualities?.name || '',
			description: dataUpdateQualities?.description || '',
			colorShow: dataUpdateQualities?.colorShow || '#16DBCC',
		});
	}, [dataUpdateQualities]);

	const funcUpdateQualities = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa quốc gia thành công!',
				http: wareServices.upsertQualities({
					uuid: form.uuid,
					name: form.name,
					description: form.description,
					colorShow: form.colorShow,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					uuid: '',
					name: '',
					description: '',
					colorShow: '',
				});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_quoc_gia]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = () => {
		if (!form.uuid) {
			return toastWarn({
				msg: 'Không tìm thấy quốc gia!',
			});
		}

		return funcUpdateQualities.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateQualities.isLoading} />
			<h4>Chỉnh sửa quốc gia</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Input
					name='name'
					value={form.name || ''}
					isRequired
					max={255}
					type='text'
					blur={true}
					placeholder='Nhập tên quốc gia'
					label={
						<span>
							Tên quốc gia <span style={{color: 'red'}}> *</span>
						</span>
					}
				/>
				<div className='mt'>
					<InputColor
						label={
							<span>
								Màu hiển thị <span style={{color: 'red'}}>*</span>
							</span>
						}
						color={form.colorShow}
						onSetColor={(color) =>
							setForm((prev) => ({
								...prev,
								colorShow: color,
							}))
						}
					/>
				</div>
				<div className={clsx('mt')}>
					<TextArea placeholder='Thêm mô tả' name='description' label={<span>Mô tả</span>} blur max={5000} />
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

export default FormUpdateQualities;
