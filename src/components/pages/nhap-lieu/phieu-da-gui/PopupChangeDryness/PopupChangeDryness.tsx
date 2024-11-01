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
import batchBillServices from '~/services/batchBillServices';

function PopupChangeDryness({dataBillChangeDryness, onClose}: PropsPopupChangeDryness) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{drynessNew: number; description: string; billNumber: string}>({
		drynessNew: 0,
		description: '',
		billNumber: '',
	});

	useEffect(() => {
		setForm((prev) => ({
			...prev,
			billNumber: dataBillChangeDryness?.length > 1 ? String(dataBillChangeDryness?.length) : dataBillChangeDryness[0]?.code,
		}));
	}, [dataBillChangeDryness]);

	const funcUpdateDrynessWeightSession = useMutation({
		mutationFn: (body: {uuids: string[]; drynessNew: number; description: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật độ khô thành công, Đợi duyệt!',
				http: batchBillServices.reupDryness({
					billUuid: body.uuids,
					drynessNew: body.drynessNew,
					description: body.description,
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
		if (Number(form.drynessNew) <= 0 || Number(form.drynessNew) > 100) {
			return toastWarn({msg: 'Giá trị độ khô không hợp lệ!'});
		}

		return funcUpdateDrynessWeightSession.mutate({
			uuids: dataBillChangeDryness?.map((v: any) => v?.uuid),
			drynessNew: Number(form.drynessNew),
			description: form.description,
		});
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateDrynessWeightSession.isLoading} />
			<h4>Cập nhật lại độ khô</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Input
					name='billNumber'
					value={form.billNumber || ''}
					type='text'
					placeholder='Số lố/phiếu đã chọn'
					label={<span>Số lố/phiếu đã chọn</span>}
					readOnly
				/>

				<div className='mt'>
					<label className={styles.label}>
						Độ khô thay đổi <span style={{color: 'red'}}>*</span>
					</label>
					<input
						name='drynessNew'
						value={form.drynessNew || ''}
						className={styles.input}
						type='number'
						placeholder='Nhập độ khô'
						onChange={(e) =>
							setForm((prev: any) => ({
								...prev,
								drynessNew: e.target?.value,
							}))
						}
					/>
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
									Gửi yêu cầu cập nhật độ khô
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
