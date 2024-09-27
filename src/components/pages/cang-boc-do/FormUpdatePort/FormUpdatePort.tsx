import React, {useState} from 'react';

import {PropsFormUpdatePort} from './interfaces';
import styles from './FormUpdatePort.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import batchBillServices from '~/services/batchBillServices';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';

function FormUpdatePort({listBatchBillSubmit, onClose}: PropsFormUpdatePort) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{numberChecked: number; port: string}>({
		numberChecked: listBatchBillSubmit?.length,
		port: '',
	});

	const fucnUpdatePort = useMutation({
		mutationFn: (body: {uuids: string[]; port: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật cảng bốc dỡ thành công!',
				http: batchBillServices.updatePort({
					uuid: body.uuids,
					portname: body.port,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_cang_boc_do]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = () => {
		return fucnUpdatePort.mutate({
			uuids: listBatchBillSubmit?.map((v: any) => v?.uuid),
			port: form.port,
		});
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnUpdatePort.isLoading} />
			<h4>Cập nhật cảng bốc dỡ</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Input
					name='numberChecked'
					value={form.numberChecked || ''}
					type='number'
					placeholder='Số phiếu đã chọn '
					label={<span>Số phiếu đã chọn</span>}
					readOnly
				/>
				<Input
					name='port'
					value={form.port || ''}
					type='text'
					placeholder='Nhập cảng bốc dỡ'
					label={<span>Cảng bốc dỡ</span>}
					isRequired
				/>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<FormContext.Consumer>
						{({isDone}) => (
							<div>
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Xác nhận
								</Button>
							</div>
						)}
					</FormContext.Consumer>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default FormUpdatePort;
