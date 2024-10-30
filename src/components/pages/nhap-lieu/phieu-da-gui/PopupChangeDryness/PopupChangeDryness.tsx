import {useMutation, useQueryClient} from '@tanstack/react-query';
import {PropsPopupChangeDryness} from './interfaces';
import {useEffect, useState} from 'react';
import Form, {FormContext, Input} from '~/components/common/Form';

import styles from './PopupChangeDryness.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {httpRequest} from '~/services';
import weightSessionServices from '~/services/weightSessionServices';
import {QUERY_KEY} from '~/constants/config/enum';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import TextArea from '~/components/common/Form/components/TextArea';

function PopupChangeDryness({dataBillChangeDryness, onClose}: PropsPopupChangeDryness) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{numberChecked: number; dryness: number; description: string}>({
		numberChecked: 0,
		dryness: 0,
		description: '',
	});

	useEffect(() => {
		if (dataBillChangeDryness?.length > 0) {
			setForm((prev) => ({
				...prev,
				numberChecked: dataBillChangeDryness?.length,
			}));
		}
	}, [dataBillChangeDryness]);

	const funcUpdateDrynessWeightSession = useMutation({
		mutationFn: (body: {uuids: string[]; dryness: number; description: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật độ khô thành công, Đợi duyệt!',
				http: weightSessionServices.updateDrynessWeightSession({
					wsUuids: body.uuids,
					dryness: body.dryness,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_phieu_da_gui_KT]);
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

		return funcUpdateDrynessWeightSession.mutate({
			uuids: dataBillChangeDryness?.map((v: any) => v?.uuid),
			dryness: Number(form.dryness),
			description: form.description,
		});
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateDrynessWeightSession.isLoading} />
			<h4>Cập nhật lại độ khô</h4>
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
				<div className='mt'>
					<TextArea
						label={
							<span>
								Lý do thay đổi <span style={{color: 'red'}}>*</span>
							</span>
						}
						isRequired
						name='description'
						max={5000}
						blur
						placeholder='Nhập lý do hủy'
					/>
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

export default PopupChangeDryness;
