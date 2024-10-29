import React, {useEffect, useState} from 'react';

import {PropsFormUpdateSpecWS} from './interfaces';
import styles from './FormUpdateSpecWS.module.scss';
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
import FormReasonUpdateSpec from '../FormReasonUpdateSpec';
import Popup from '~/components/common/Popup';
import {price} from '~/common/funcs/convertCoin';

function FormUpdateSpecWS({dataUpdateSpecWS, onClose}: PropsFormUpdateSpecWS) {
	const queryClient = useQueryClient();

	const [openWarning, setOpenWarning] = useState<boolean>(false);
	const [form, setForm] = useState<{numberChecked: number; specificationsUuid: string; totalSample: number | string}>({
		numberChecked: 0,
		specificationsUuid: '',
		totalSample: 0,
	});

	const [dataRules, setDataRules] = useState<
		{
			uuid: string;
			title: string;
			amountSample: number;
		}[]
	>([]);

	useEffect(() => {
		setForm({
			totalSample: 0,
			numberChecked: dataUpdateSpecWS?.length,
			specificationsUuid: dataUpdateSpecWS?.[0]?.specificationsUu?.uuid,
		});
	}, [dataUpdateSpecWS]);

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	useQuery([QUERY_KEY.danh_sach_tieu_chi_nhap_lieu, dataUpdateSpecWS?.[0]?.specificationsUu?.uuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: criteriaServices.listCriteriaSpec({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					specificationUuid: dataUpdateSpecWS?.[0]?.specificationsUu?.uuid || '',
				}),
			}),
		onSuccess(data) {
			if (data) {
				setDataRules(
					data?.map((v: any) => ({
						uuid: v?.uuid,
						title: v?.title,
						amountSample: 0,
					}))
				);
			}
		},
		enabled: !!dataUpdateSpecWS?.[0]?.specificationsUu?.uuid,
	});

	const handleChange = (rule: {uuid: string; title: string; amountSample: number}, value: any) => {
		setDataRules((prevRules) =>
			prevRules.map((r) =>
				r.uuid === rule.uuid
					? {
							...r,
							amountSample: value,
					  }
					: r
			)
		);
	};

	const funcUpdateSpecWeightSession = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật quy cách thành công!',
				http: weightSessionServices.updateSpecWeightSession({
					wsUuids: dataUpdateSpecWS?.map((v: any) => v?.uuid),
					lstValueSpec: dataRules?.map((v) => ({
						uuid: v?.uuid,
						amountSample: v?.amountSample ? Number(v?.amountSample) : 0,
					})),
					totalSample: form?.totalSample ? Number(form?.totalSample) : 0,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_quy_cach]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (dataRules?.some((v) => isNaN(v?.amountSample))) {
			return toastWarn({msg: 'Nhập giá trị cho tiêu chí quy cách!'});
		}
		if (dataRules?.some((v) => v?.amountSample > price(form?.totalSample))) {
			return setOpenWarning(true);
		} else {
			return funcUpdateSpecWeightSession.mutate();
		}
	};

	const handleSubmitReason = async () => {
		return funcUpdateSpecWeightSession.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateSpecWeightSession.isLoading} />
			<h4>Cập nhật quy cách</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<Input
					name='numberChecked'
					value={form.numberChecked || ''}
					type='number'
					placeholder='Số phiếu đã chọn '
					label={<span>Số phiếu đã chọn</span>}
					readOnly
				/>
				<div className={clsx('mt')}>
					<Select
						isSearch
						name='specificationsUuid'
						placeholder='Chọn quy cách'
						value={form?.specificationsUuid}
						readOnly
						label={
							<span>
								Quy cách <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listSpecification?.data?.map((v: any) => (
							<Option
								key={v?.uuid}
								value={v?.uuid}
								title={v?.name}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										specificationsUuid: v?.uuid,
									}))
								}
							/>
						))}
					</Select>
				</div>

				{/* <div className={clsx('mt')}>
					<Input
						value={form.totalSample}
						type='text'
						isMoney
						placeholder='Nhập khối lượng cân mẫu'
						label={<span>Khối lượng cân mẫu</span>}
						unit='gr'
					/>
				</div> */}

				<label className={styles.label}>Nhập khối lượng cân mẫu</label>
				<div className={styles.input_total}>
					<input
						className={styles.input_sample}
						name='totalSample'
						type='number'
						step='any'
						placeholder='Nhập khối lượng cân mẫu'
						value={form.totalSample}
						onChange={(e) => setForm((prev) => ({...prev, totalSample: e.target.value}))}
					/>
					<div className={styles.unit}>gr</div>
				</div>

				<div className='mt'>
					{dataRules?.map((v, i) => {
						const totalGr = dataRules.reduce((sum, rule) => sum + (rule.amountSample || 0), 0);
						const percentage = price(form?.totalSample)
							? (v?.amountSample / price(form?.totalSample)) * 100
							: (v?.amountSample / totalGr) * 100;

						return (
							<div key={i} className={styles.item}>
								<p>{v?.title}</p>
								<div className={styles.value_spec}>
									<div className={styles.percent}>{!isNaN(percentage) ? `${percentage.toFixed(2)}%` : ''}</div>
									<div className={styles.box_input}>
										<input
											className={styles.input}
											type='number'
											step='any'
											value={v?.amountSample}
											onChange={(e) => handleChange(v, parseFloat(e.target.value))}
										/>
										<div className={styles.unit}>gr</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* <div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
							Xác nhận
						</Button>
					</div>
				</div> */}

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
				<Popup
					zIndex={102}
					open={openWarning}
					onClose={() => {
						setOpenWarning(false);
					}}
				>
					<FormReasonUpdateSpec
						onSubmit={handleSubmitReason}
						onClose={() => {
							setOpenWarning(false);
						}}
					/>
				</Popup>
			</Form>
		</div>
	);
}

export default FormUpdateSpecWS;
