import React, {useEffect, useRef, useState} from 'react';

import {PropsBoxUpdateSpec} from './interfaces';
import styles from './BoxUpdateSpec.module.scss';
import Button from '~/components/common/Button';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import weightSessionServices from '~/services/weightSessionServices';
import {httpRequest} from '~/services';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import Form from '~/components/common/Form';
import Popup from '~/components/common/Popup';
import FormReasonUpdateSpec from '../../quy-cach/FormReasonUpdateSpec';
import {price} from '~/common/funcs/convertCoin';
import criteriaServices from '~/services/criteriaServices';

function BoxUpdateSpec({dataUpdateSpec, onClose}: PropsBoxUpdateSpec) {
	const queryClient = useQueryClient();

	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleKeyEnter = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
			const newIndex = event.key === 'ArrowUp' ? index - 1 : index + 1;

			if (inputRefs.current[newIndex]) {
				inputRefs.current[newIndex]?.focus();
			}
		}
		if (event.key === 'Enter' || event.keyCode === 13) {
			event.preventDefault();
			if (index === -1) {
				inputRefs.current[0]?.focus();
			} else {
				if (inputRefs.current[index + 1]) {
					inputRefs.current[index + 1]?.focus();
				} else {
					inputRefs.current[-1]?.focus();
				}
			}
		}
	};

	const [openWarning, setOpenWarning] = useState<boolean>(false);
	const [form, setForm] = useState<{totalSample: number | string}>({
		totalSample: 0,
	});

	const [dataRules, setDataRules] = useState<
		{
			uuid: string;
			title: string;
			amountSample: number;
			ruler: number;
			value: number;
			valuecriteria: number;
		}[]
	>([]);

	useEffect(() => {
		if (dataUpdateSpec?.specStyleUu?.length != 0) {
			setDataRules(
				dataUpdateSpec?.specStyleUu?.map((v) => ({
					uuid: v?.criteriaUu?.uuid!,
					title: v?.criteriaUu?.title!,
					amountSample: v?.amountSample! || 0,
					ruler: v?.criteriaUu?.ruler!,
					valuecriteria: v?.criteriaUu.value!,
					value: v?.value!,
				}))!
			);
			setForm({
				totalSample: dataUpdateSpec?.specStyleUu?.[0]?.totalSample?.toFixed(2) || 0,
			});
		}
		if (dataUpdateSpec?.specStyleUu?.length == 0) {
			setForm({
				totalSample: 0,
			});
		}
	}, [dataUpdateSpec]);

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

	useQuery([QUERY_KEY.danh_sach_tieu_chi_nhap_lieu, dataUpdateSpec?.specificationsUu?.uuid], {
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
					specificationUuid: dataUpdateSpec?.specificationsUu?.uuid || '',
				}),
			}),
		onSuccess(data) {
			if (data && dataUpdateSpec?.specStyleUu?.length == 0) {
				setDataRules(
					data?.map((v: any) => ({
						uuid: v?.uuid,
						title: v?.title,
						amountSample: 0,
					}))
				);
			}
		},
		enabled: !!dataUpdateSpec?.specificationsUu?.uuid,
	});

	const funcUpdateSpecWeightSession = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật quy cách thành công!',
				http: weightSessionServices.updateSpecWeightSession({
					wsUuids: [dataUpdateSpec?.uuid!],
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
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_do_kho]);
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

		if (dataRules?.some((v) => v?.amountSample > price(form?.totalSample!))) {
			return toastWarn({msg: 'Đang có chí tiêu lớn hơn khối lượng cân mẫu!'});
		} else {
			return funcUpdateSpecWeightSession.mutate();
		}
	};

	const handleSubmitWarning = async () => {
		setOpenWarning(false);
		return funcUpdateSpecWeightSession.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateSpecWeightSession.isLoading} />
			<Form form={form} setForm={setForm}>
				<div className={styles.main}>
					{/* <Input
						name='totalSample'
						value={form.totalSample}
						type='text'
						isMoney
						placeholder='Nhập khối lượng cân mẫu'
						label={<span>Khối lượng cân mẫu</span>}
						unit='gr'
					/> */}
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
							onKeyDown={(e) => handleKeyEnter(e, -1)}
							ref={(el) => (inputRefs.current[-1] = el)}
						/>
						<div className={styles.unit}>gr</div>
					</div>
					<div className='mt'>
						{dataRules?.map((v, i) => {
							const totalGr = dataRules.reduce((sum, rule) => sum + (rule.amountSample || 0), 0);
							const percentage = price(form?.totalSample)
								? (v?.amountSample / Number(form?.totalSample)) * 100
								: (v?.amountSample / totalGr) * 100;

							return (
								<div key={i} className={styles.item}>
									<p>
										{v?.title} <span style={{fontWeight: '600'}}>( {v?.value?.toFixed(2)} %)</span>
									</p>

									<div className={styles.value_spec}>
										<div className={styles.box_input}>
											<input
												className={styles.input}
												type='number'
												value={v?.amountSample}
												onChange={(e) => handleChange(v, parseFloat(e.target.value))}
												onKeyDown={(e) => handleKeyEnter(e, i)}
												ref={(el) => (inputRefs.current[i] = el)}
											/>
											<div className={styles.unit}>gr</div>
										</div>
										<div className={styles.percent}>{!isNaN(percentage) ? `${percentage.toFixed(2)}%` : ''}</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className={styles.box_btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
							Cập nhật
						</Button>
						{/* <FormContext.Consumer>
							{({isDone}) => (
								
							)}
						</FormContext.Consumer> */}
					</div>
				</div>
				<Popup
					zIndex={102}
					open={openWarning}
					onClose={() => {
						setOpenWarning(false);
					}}
				>
					<FormReasonUpdateSpec
						onSubmit={handleSubmitWarning}
						onClose={() => {
							setOpenWarning(false);
						}}
					/>
				</Popup>
			</Form>
		</div>
	);
}

export default BoxUpdateSpec;
