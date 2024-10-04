import React, {useState} from 'react';

import {IFormUpdateShip, PropsMainPageUpdateShip} from './interfaces';
import styles from './MainPageUpdateShip.module.scss';
import TextArea from '~/components/common/Form/components/TextArea';
import Form, {FormContext, Input} from '~/components/common/Form';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';
import {httpRequest} from '~/services';
import {useMutation, useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import {useRouter} from 'next/router';
import shipServices from '~/services/shipServices';

function MainPageUpdateShip({}: PropsMainPageUpdateShip) {
	const router = useRouter();

	const {_id} = router.query;
	const [form, setForm] = useState<IFormUpdateShip>({
		code: '',
		licensePalate: '',
		description: '',
	});

	useQuery([QUERY_KEY.chi_tiet_tau], {
		queryFn: () =>
			httpRequest({
				http: shipServices.getDetail({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setForm({
				code: data?.code,
				licensePalate: data?.licensePalate,
				description: data?.description,
			});
		},
		enabled: !!_id,
	});

	const funcUpdateShip = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa tàu thành công!',
				http: shipServices.upsertShip({
					uuid: _id as string,
					code: form?.code,
					licensePalate: form?.licensePalate,
					description: form.description,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					code: '',
					licensePalate: '',
					description: '',
				});
				router.replace(PATH.QuanLyTau, undefined, {
					scroll: false,
					locale: false,
				});
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = () => {
		funcUpdateShip.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateShip.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Chỉnh sửa tàu</h4>
						<p>Điền đầy đủ các thông tin tàu</p>
					</div>
					<div className={styles.right}>
						<Button href={PATH.QuanLyTau} p_10_24 rounded_2 grey_outline>
							Hủy bỏ
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Lưu lại
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>
				<div className={styles.form}>
					<div className={clsx('col_2', 'mt')}>
						<Input
							name='code'
							value={form.code || ''}
							max={255}
							isRequired
							type='text'
							blur={true}
							label={
								<span>
									Logo tàu <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập logo tàu'
						/>
						<div>
							<Input
								name='licensePalate'
								value={form.licensePalate || ''}
								isRequired
								max={255}
								type='text'
								blur={true}
								label={
									<span>
										Mã tàu <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='VD: QN1234'
							/>
						</div>
					</div>

					<div className={clsx('mt')}>
						<TextArea name='description' placeholder='Nhập ghi chú' label={<span>Ghi chú</span>} max={5000} blur />
					</div>
				</div>
			</Form>
		</div>
	);
}

export default MainPageUpdateShip;
