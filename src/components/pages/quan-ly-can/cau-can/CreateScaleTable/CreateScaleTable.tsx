import React, {Fragment, useState} from 'react';
import {IFormCreate, PropsCreateScaleTable} from './interfaces';
import styles from './CreateScaleTable.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import TextArea from '~/components/common/Form/components/TextArea';
import clsx from 'clsx';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Select, {Option} from '~/components/common/Select';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import scalesStationServices from '~/services/scalesStationServices';
import scalesMachineServices from '~/services/scalesMachineServices';

function CreateScaleTable({onClose}: PropsCreateScaleTable) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFormCreate>({name: '', scalesStationUuid: '', description: ''});

	const listScalesStation = useQuery([QUERY_KEY.dropdown_tram_can], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: scalesStationServices.listScalesStation({
					page: 1,
					pageSize: 20,
					keyword: '',
					companyUuid: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const fucnAddScalesMachine = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới cầu cân thành công!',
				http: scalesMachineServices.upsertScalesMachine({
					uuid: '',
					...form,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					name: '',
					scalesStationUuid: '',
					description: '',
				});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_ban_can]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = () => {
		if (!form.scalesStationUuid) {
			return toastWarn({msg: 'Vui lòng chọn trạm cân!'});
		}

		return fucnAddScalesMachine.mutate();
	};

	return (
		<Fragment>
			<Loading loading={fucnAddScalesMachine.isLoading} />
			<div className={styles.container}>
				<h4>Thêm cầu cân</h4>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<Input
						name='name'
						value={form.name || ''}
						isRequired
						max={255}
						type='text'
						blur={true}
						placeholder='Nhập tên cầu cân'
						label={
							<span>
								Tên cầu cân <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>

					<div className={clsx('mt')}>
						<Select
							isSearch
							name='scalesStationUuid'
							value={form.scalesStationUuid}
							placeholder='Chọn trạm cân'
							onChange={(e) =>
								setForm((prev: any) => ({
									...prev,
									scalesStationUuid: e.target.value,
								}))
							}
							label={
								<span>
									Trạm cân <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listScalesStation?.data?.map((v: any) => (
								<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
							))}
						</Select>
					</div>

					<div className={clsx('mt')}>
						<TextArea placeholder='Thêm ghi chú' name='description' label={<span>Ghi chú</span>} blur max={5000} />
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
		</Fragment>
	);
}

export default CreateScaleTable;
