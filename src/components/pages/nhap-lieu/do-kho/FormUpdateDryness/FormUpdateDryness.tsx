import {useMutation, useQueryClient} from '@tanstack/react-query';
import {PropsFormUpdateDryness} from './interfaces';
import {useEffect, useState} from 'react';
import Form, {FormContext, Input} from '~/components/common/Form';

import styles from './FormUpdateDryness.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {httpRequest} from '~/services';
import weightSessionServices from '~/services/weightSessionServices';
import {QUERY_KEY} from '~/constants/config/enum';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';

function FormUpdateDryness({dataUpdateDryness, onClose}: PropsFormUpdateDryness) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{numberChecked: number; dryness: number}>({
		numberChecked: 0,
		dryness: 0,
	});

	useEffect(() => {
		if (dataUpdateDryness?.length > 0) {
			setForm((prev) => ({
				...prev,
				numberChecked: dataUpdateDryness?.length,
			}));
		}
	}, [dataUpdateDryness]);

	const fucnUpdateDrynessWeightSession = useMutation({
		mutationFn: (body: {uuids: string[]; dryness: number}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật độ khô thành công!',
				http: weightSessionServices.updateDrynessWeightSession({
					wsUuids: body.uuids,
					dryness: body.dryness,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_do_kho]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (Number(form.dryness) <= 0 || Number(form.dryness) > 100) {
			return toastWarn({msg: 'Giá trị độ khô không hợp lệ!'});
		}

		return fucnUpdateDrynessWeightSession.mutate({
			uuids: dataUpdateDryness?.map((v: any) => v?.uuid),
			dryness: Number(form.dryness),
		});
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnUpdateDrynessWeightSession.isLoading} />
			<h4>Cập nhật độ khô</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Input
					name='numberChecked'
					value={form.numberChecked || ''}
					type='number'
					placeholder='Số phiếu đã chọn '
					label={<span>Số phiếu đã chọn</span>}
					readOnly
				/>
				<div className='mt'>
					<div>
						<label className={styles.label}>
							Độ khô <span style={{color: 'red'}}>*</span>
						</label>
						<input
							name='dryness'
							value={form.dryness || ''}
							className={styles.input}
							type='number'
							step='0.01'
							min={0}
							max={100}
							placeholder='Nhập độ khô'
							onChange={(e) =>
								setForm((prev: any) => ({
									...prev,
									dryness: e.target?.value,
								}))
							}
						/>
					</div>
				</div>

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

export default FormUpdateDryness;
