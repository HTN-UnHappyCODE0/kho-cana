import React, {Fragment, useState} from 'react';
import {IFormAddScalesMachine, PropsAddScalesMachine} from './interfaces';
import styles from './AddScalesMachine.module.scss';
import Form, {Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import clsx from 'clsx';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Select, {Option} from '~/components/common/Select';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import {useRouter} from 'next/router';
import scalesMachineServices from '~/services/scalesMachineServices';

function AddScalesMachine({onClose, nameScalesStation, uuidScalesStation, listScalesMachineUuid}: PropsAddScalesMachine) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _id} = router.query;

	const [form, setForm] = useState<IFormAddScalesMachine>({scalesMachineUuid: '', nameScalesStation: nameScalesStation});

	const listScalesMachine = useQuery([QUERY_KEY.dropdown_ban_can], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: scalesMachineServices.listScalesMachine({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: null,
					scalesStationUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcAddScalesMachine = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm cầu cân thành công!',
				http: scalesMachineServices.changeScalesStation({
					uuid: form.scalesMachineUuid,
					scalesStationUuid: uuidScalesStation,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					nameScalesStation: nameScalesStation,
					scalesMachineUuid: '',
				});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_tram_can, _id]);
				queryClient.invalidateQueries([QUERY_KEY.table_ban_can, _page, _pageSize, _id]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = () => {
		if (!uuidScalesStation) {
			return toastWarn({msg: 'Không tìm thấy trạm cân!'});
		}
		if (!form.scalesMachineUuid) {
			return toastWarn({msg: 'Vui lòng chọn cầu cân!'});
		}

		return funcAddScalesMachine.mutate();
	};

	return (
		<Fragment>
			<Loading loading={funcAddScalesMachine.isLoading} />
			<div className={styles.container}>
				<h4>Thêm cầu cân vào trạm cân</h4>
				<Form form={form} setForm={setForm}>
					<div className={clsx('mt')}>
						<Input
							name='nameScalesStation'
							value={form.nameScalesStation || ''}
							isRequired
							max={50}
							type='text'
							blur={true}
							placeholder='Nhập tên trạm cân'
							readOnly={true}
							label={
								<span>
									Tên trạm cân <span style={{color: 'red'}}>*</span>
								</span>
							}
						/>
					</div>

					<div className={clsx('mt')}>
						<Select
							isSearch
							name='scalesMachineUuid'
							value={form.scalesMachineUuid}
							placeholder='Chọn cầu cân'
							onChange={(e) =>
								setForm((prev: any) => ({
									...prev,
									scalesMachineUuid: e.target.value,
								}))
							}
							label={
								<span>
									Cầu cân <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listScalesMachine?.data
								?.filter((x: any) => !listScalesMachineUuid.includes(x.uuid))
								?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
								))}
						</Select>
					</div>

					<div className={styles.btn}>
						<div>
							<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<Button disable={!form.scalesMachineUuid} p_10_24 rounded_2 primary onClick={handleSubmit}>
								Lưu lại
							</Button>
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

export default AddScalesMachine;
