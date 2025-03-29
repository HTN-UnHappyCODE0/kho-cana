import React, {useEffect, useRef, useState} from 'react';

import {PropsFormUpdateDraftShip} from './interfaces';
import styles from './FormUpdateDraftShip.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import clsx from 'clsx';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import uploadImageService from '~/services/uploadService';
import batchBillServices from '~/services/batchBillServices';
import Popup from '~/components/common/Popup';
import FormReasonUpdateSpec from '../FormReasonUpdateSpec';
import {convertWeight} from '~/common/funcs/optionConvert';

function FormUpdateDraftShip({dataUpdate, onClose}: PropsFormUpdateDraftShip) {
	const queryClient = useQueryClient();

	const [loading, setLoading] = useState<boolean>(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [images, setImages] = useState<any[]>([]);
	const [openWarning, setOpenWarning] = useState<boolean>(false);

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

	const [form, setForm] = useState<{codeBill: string | number; amountDraft: number; totalSample: number | string; dryness: number}>({
		codeBill: '',
		amountDraft: 0,
		totalSample: 0,
		dryness: 0,
	});

	const [dataRules, setDataRules] = useState<
		{
			uuid: string;
			code: string;
			weightTotal: number;
			weightMon: number;
		}[]
	>([]);

	useEffect(() => {
		if (dataUpdate?.length === 1) {
			setForm({
				...form,
				codeBill: dataUpdate?.[0]?.code,
			});
		}

		if (dataUpdate?.length > 1) {
			setForm({
				...form,
				codeBill: dataUpdate?.length,
			});
		}

		setDataRules(
			dataUpdate?.map((item) => ({
				uuid: item?.uuid,
				code: item?.code,
				weightTotal: item?.weightTotal,
				weightMon: 0,
			})) || []
		);
	}, [dataUpdate]);

	const [manualValues, setManualValues] = useState<{[key: string]: number}>({});
	const prevAmountDraft = useRef(price(form.amountDraft));
	const prevManualValues = useRef<{[key: string]: boolean}>({});

	useEffect(() => {
		if (prevAmountDraft.current !== price(form.amountDraft)) {
			const totalGr = dataRules.reduce((sum, rule) => sum + (rule.weightTotal || 0), 0);

			setManualValues(() => {
				const updatedValues: {[key: string]: number} = {};
				dataRules.forEach((rule) => {
					updatedValues[rule.uuid] =
						Math.sign(rule.weightTotal) * ((Math.abs(rule.weightTotal) / totalGr) * price(form.amountDraft)) || 0;
				});
				return updatedValues;
			});

			prevManualValues.current = {};
			prevAmountDraft.current = price(form.amountDraft);
		}
	}, [form.amountDraft, dataRules]);

	useEffect(() => {
		setDataRules((prevRules) =>
			prevRules.map((r) => ({
				...r,
				weightMon: price(manualValues[r.uuid]) || 0,
			}))
		);
	}, [manualValues]);

	const handleChange = (uuid: string, value: number) => {
		prevManualValues.current = {...prevManualValues.current, [uuid]: true};

		setManualValues((prev) => {
			const updatedValues = {...prev, [uuid]: value};

			let totalManual = Object.entries(updatedValues).reduce(
				(sum, [key, val]) => (prevManualValues.current[key] ? sum + val : sum),
				0
			);

			let remainingAmount = price(form.amountDraft) - totalManual;
			let remainingRules = dataRules.filter((r) => !prevManualValues.current[r.uuid]);
			let totalGr = remainingRules.reduce((sum, r) => sum + (r.weightTotal || 0), 0);

			remainingRules.forEach((r) => {
				updatedValues[r.uuid] = Math.sign(r.weightTotal) * ((Math.abs(r.weightTotal) / totalGr) * remainingAmount) || 0;
			});

			return updatedValues;
		});

		setDataRules((prevRules) =>
			prevRules.map((r) => {
				if (r.uuid === uuid) {
					return {...r, weightMon: price(value)};
				} else {
					return r;
				}
			})
		);
	};

	const funcUpdateDraftShip = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật mớn tàu thành công!',
				http: batchBillServices.updateWeightBillOut({
					drynessAvg: form.dryness,
					paths: body.paths,
					itemBill: dataRules?.map((item) => ({
						billUuid: item.uuid,
						weightMon: item?.weightMon,
					})),
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_cap_nhat_mon_tau]);
			}
		},
		onError(error) {
			return;
		},
	});

	const handleSubmit = async () => {
		const imgs = images?.map((v: any) => v?.file);

		if (form.dryness < 0 || form.dryness > 100) {
			return toastWarn({msg: 'Độ khô không hợp lệ!'});
		}

		const totalManual = Object.values(manualValues).reduce((sum, val) => sum + val, 0);

		if (imgs.length > 0) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadMutilImage(imgs),
			});
			if (price(totalManual) !== price(form.amountDraft)) {
				setOpenWarning(true);
				return;
			} else {
				if (dataImage?.error?.code == 0) {
					return funcUpdateDraftShip.mutate({
						paths: dataImage.items,
					});
				} else {
					return toastWarn({msg: 'Upload ảnh thất bại!'});
				}
			}
		} else {
			return toastWarn({msg: 'Chưa cập nhật ảnh!'});
		}
	};

	const handleSubmitReason = async () => {
		const imgs = images?.map((v: any) => v?.file);

		if (imgs.length > 0) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadMutilImage(imgs),
			});
			if (dataImage?.error?.code == 0) {
				return funcUpdateDraftShip.mutate({
					paths: dataImage.items,
				});
			} else {
				return toastWarn({msg: 'Upload ảnh thất bại!'});
			}
		} else {
			return toastWarn({msg: 'Chưa cập nhật ảnh!'});
		}
	};

	useEffect(() => {
		const totalSample = Math.round((price(form.amountDraft) * form.dryness) / 100);
		setForm((prev) => ({
			...prev,
			totalSample: isNaN(totalSample) ? 0 : convertCoin(totalSample),
		}));
	}, [form.amountDraft, form.dryness]);

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcUpdateDraftShip.isLoading} />
			<h4>Cập nhật mớn tàu</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.wrapper}>
					<Input
						name='codeBill'
						value={form?.codeBill || ''}
						type='text'
						placeholder='Số lô/phiếu đã chọn'
						label={<span>Số lô/phiếu đã chọn</span>}
						readOnly
					/>

					<div className={clsx('mt', 'col_2')}>
						<div>
							<Input
								name='amountDraft'
								value={form.amountDraft || ''}
								type='number'
								unit='Kg'
								step='any'
								blur={true}
								label={
									<span>
										Khối lượng tươi theo mớn <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập khối lượng'
							/>
						</div>
						<Input
							name='dryness'
							value={form.dryness || ''}
							type='number'
							unit='%'
							blur={true}
							label={
								<span>
									Độ khô <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập độ khô'
						/>
					</div>

					<div className={styles.item}>
						<p>Mã phiếu</p>
						<p>Khối lượng tươi</p>
						<p>Khối lượng khô</p>
					</div>

					<div className={(clsx('mt'), styles.main_box)}>
						<div className={styles.box}>
							{dataRules?.map((v, i) => (
								<div key={i} className={styles.item}>
									<p>{v?.code}</p>

									<div className={styles.box_input}>
										<input
											className={styles.input}
											type='number'
											step='any'
											value={Number(manualValues[v.uuid]?.toFixed(3))}
											onChange={(e) => handleChange(v.uuid, parseFloat(e.target.value))}
											onKeyDown={(e) => handleKeyEnter(e, i)}
											ref={(el) => (inputRefs.current[i] = el)}
										/>
										<div className={styles.unit}>Kg</div>
									</div>

									<div className={styles.box_input}>
										<input
											className={styles.input}
											type='number'
											value={Number(((manualValues[v.uuid] * form.dryness) / 100)?.toFixed(3))}
											readOnly={true}
										/>
										<div className={styles.unit}>Kg</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* <div className={clsx('mt')}>
					<Input
						readOnly={true}
						name='totalSample'
						value={form.totalSample || ''}
						type='text'
						isMoney
						unit='Kg'
						blur={true}
						label={
							<span>
								Tổng lượng khô <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập khối lượng'
					/>
				</div> */}

					<div className='mt'>
						<div className={styles.image_upload}>
							Chọn ảnh <span style={{color: 'red'}}>*</span>
						</div>
						<UploadMultipleFile images={images} setImages={setImages} />
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
										Cập nhật
									</Button>
								)}
							</FormContext.Consumer>
						</div>
					</div>

					<div className={styles.close} onClick={onClose}>
						<IoClose />
					</div>
				</div>
			</Form>
			<Popup zIndex={102} open={openWarning} onClose={() => setOpenWarning(false)}>
				<FormReasonUpdateSpec onSubmit={handleSubmitReason} onClose={() => setOpenWarning(false)} />
			</Popup>
		</div>
	);
}

export default FormUpdateDraftShip;
