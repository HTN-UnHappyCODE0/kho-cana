import React, {useState} from 'react';

import {PropsFormCreateQualities} from './interfaces';
import styles from './FormCreateQualities.module.scss';
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
import InputColor from '~/components/common/InputColor';

function FormCreateQualities({onClose}: PropsFormCreateQualities) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{
		name: string;
		description: string;
		colorShow: string;
	}>({name: '', colorShow: '#16DBCC', description: ''});

	const fucnCreateQualities = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới quốc gia thành công!',
				http: wareServices.upsertQualities({
					uuid: '',
					name: form.name,
					description: form.description,
					colorShow: form.colorShow,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					name: '',
					description: '',
					colorShow: '#16DBCC',
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
		return fucnCreateQualities.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnCreateQualities.isLoading} />
			<h4>Thêm quốc gia</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Input
					name='name'
					value={form.name || ''}
					isRequired
					min={5}
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
									Lưu lại
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

export default FormCreateQualities;
